import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '../lib/api';
import { useAuthStore } from '../stores/authStore';
import type { GeneratedMeal } from '../types/meal';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  meal?: GeneratedMeal;
  addedToPantry?: string[];
  addedToList?: string[];
  timestamp: number;
}

interface ServerResponse {
  message: string;
  meal?: GeneratedMeal;
  actions?: {
    addToPantry?: string[];
    addToList?: string[];
  };
}

const STORAGE_KEY = 'cupla_chat_messages';

function loadMessages(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved) as ChatMessage[];
  } catch { /* ignore */ }
  return [];
}

function saveMessages(msgs: ChatMessage[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs));
  } catch { /* ignore (e.g. quota) */ }
}

function loadIdCounter(): number {
  try {
    const saved = localStorage.getItem('cupla_chat_counter');
    if (saved) return parseInt(saved, 10) || 0;
  } catch { /* ignore */ }
  return 0;
}

function saveIdCounter(n: number) {
  try {
    localStorage.setItem('cupla_chat_counter', String(n));
  } catch { /* ignore */ }
}

const PANTRY_QUERY_KEY = ['pantry'] as const;
const GROCERY_QUERY_KEY = ['grocery'] as const;

export function useMealChat() {
  const session = useAuthStore((s) => s.session);
  const queryClient = useQueryClient();
  const householdId = session?.householdId ?? '';
  const token = session?.token ?? '';

  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let idCounter = loadIdCounter();

  function nextId() {
    idCounter += 1;
    saveIdCounter(idCounter);
    return `msg-${idCounter}-${Date.now()}`;
  }

  function invalidateRelated() {
    if (householdId) {
      queryClient.invalidateQueries({ queryKey: [...PANTRY_QUERY_KEY, householdId] });
      queryClient.invalidateQueries({ queryKey: [...GROCERY_QUERY_KEY, householdId] });
    }
  }

  const sendMessage = useCallback(
    async (text: string) => {
      if (!householdId || !token || !text.trim()) return;

      const userMsg: ChatMessage = {
        id: nextId(),
        role: 'user',
        content: text.trim(),
        timestamp: Date.now(),
      };

      const currentMessages = loadMessages();
      const updatedMessages = [...currentMessages, userMsg];
      saveMessages(updatedMessages);
      setMessages(updatedMessages);
      setIsTyping(true);
      setError(null);

      const history = updatedMessages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content }));

      try {
        const result = await apiFetch<ServerResponse>(
          `/api/household/${householdId}/meal-chat`,
          {
            method: 'POST',
            body: { message: text.trim(), history },
            token,
          },
        );

        const assistantMsg: ChatMessage = {
          id: nextId(),
          role: 'assistant',
          content: result.message,
          meal: result.meal,
          addedToPantry: result.actions?.addToPantry,
          addedToList: result.actions?.addToList,
          timestamp: Date.now(),
        };

        const messagesWithReply = [...updatedMessages, assistantMsg];
        saveMessages(messagesWithReply);
        setMessages(messagesWithReply);

        if (result.actions?.addToPantry?.length || result.actions?.addToList?.length) {
          invalidateRelated();
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to get response');
      } finally {
        setIsTyping(false);
      }
    },
    [householdId, token, nextId, queryClient],
  );

  const clearChat = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    try { localStorage.removeItem('cupla_chat_counter'); } catch { /* ignore */ }
    setMessages([]);
    setError(null);
    idCounter = 0;
  }, []);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    clearChat,
  };
}
