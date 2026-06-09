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

// Module-level state persists across component unmounts (tab switches)
let persistedMessages: ChatMessage[] = [];
let persistedIdCounter = 0;

const PANTRY_QUERY_KEY = ['pantry'] as const;
const GROCERY_QUERY_KEY = ['grocery'] as const;

export function useMealChat() {
  const session = useAuthStore((s) => s.session);
  const queryClient = useQueryClient();
  const householdId = session?.householdId ?? '';
  const token = session?.token ?? '';

  const [messages, setMessages] = useState<ChatMessage[]>(persistedMessages);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const nextId = useCallback(() => {
    persistedIdCounter += 1;
    return `msg-${persistedIdCounter}-${Date.now()}`;
  }, []);

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

      const updatedMessages = [...persistedMessages, userMsg];
      persistedMessages = updatedMessages;
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
        persistedMessages = messagesWithReply;
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
    persistedMessages = [];
    persistedIdCounter = 0;
    setMessages([]);
    setError(null);
  }, []);

  return {
    messages,
    isTyping,
    error,
    sendMessage,
    clearChat,
  };
}
