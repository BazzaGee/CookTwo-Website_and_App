-- Initial Supabase Schema for CookTwo Web

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  partner_id UUID REFERENCES profiles(id),
  pairing_code TEXT UNIQUE,
  pairing_code_expires_at TIMESTAMPTZ,
  preferred_color TEXT DEFAULT '#4F46E5',
  date_frequency_goal TEXT DEFAULT 'weekly',
  onboarding_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_pairing_code ON profiles(pairing_code)
  WHERE pairing_code IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_partner ON profiles(partner_id);

-- ============================================
-- CALENDAR CONNECTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS calendar_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'outlook')),
  provider_account_id TEXT NOT NULL,
  provider_calendar_id TEXT NOT NULL,
  display_name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ NOT NULL,
  sync_enabled BOOLEAN DEFAULT true,
  sync_direction TEXT DEFAULT 'bidirectional'
    CHECK (sync_direction IN ('read_only', 'bidirectional')),
  privacy_mode TEXT DEFAULT 'full'
    CHECK (privacy_mode IN ('full', 'busy_only')),
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_calendar_connections_user ON calendar_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_calendar_connections_provider ON calendar_connections(provider, user_id);

-- ============================================
-- EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  is_all_day BOOLEAN DEFAULT false,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_rule TEXT,
  event_type TEXT DEFAULT 'shared'
    CHECK (event_type IN ('personal', 'shared', 'date', 'task')),
  color_tag TEXT,
  status TEXT DEFAULT 'confirmed'
    CHECK (status IN ('confirmed', 'tentative', 'cancelled', 'pending_accept')),
  assigned_to UUID REFERENCES profiles(id),
  accepted_by UUID REFERENCES profiles(id),
  accepted_at TIMESTAMPTZ,
  source_calendar_id UUID REFERENCES calendar_connections(id),
  external_event_id TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_couple ON events(couple_id);
CREATE INDEX IF NOT EXISTS idx_events_time ON events(start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_couple_time ON events(couple_id, start_time);

-- ============================================
-- TODO LISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS todo_lists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  list_type TEXT DEFAULT 'todo'
    CHECK (list_type IN ('todo', 'checklist', 'grocery', 'custom')),
  icon TEXT,
  color TEXT,
  is_private BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_todo_lists_couple ON todo_lists(couple_id);

-- ============================================
-- TODOS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  list_id UUID NOT NULL REFERENCES todo_lists(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  assigned_to UUID REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  priority TEXT DEFAULT 'medium'
    CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  due_date TIMESTAMPTZ,
  reminder_at TIMESTAMPTZ,
  labels TEXT[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]'::jsonb,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_todos_list ON todos(list_id);
CREATE INDEX IF NOT EXISTS idx_todos_assigned ON todos(assigned_to);
CREATE INDEX IF NOT EXISTS idx_todos_due ON todos(due_date);

-- ============================================
-- GROCERY ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS grocery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id UUID NOT NULL REFERENCES todo_lists(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'other',
  quantity TEXT,
  is_checked BOOLEAN DEFAULT false,
  is_favorite BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_grocery_items_list ON grocery_items(list_id);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES profiles(id),
  content TEXT,
  message_type TEXT DEFAULT 'text'
    CHECK (message_type IN ('text', 'image', 'file', 'event_discuss', 'todo_discuss')),
  attachment_url TEXT,
  attachment_type TEXT,
  related_event_id UUID REFERENCES events(id),
  related_todo_id UUID REFERENCES todos(id),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_messages_couple ON messages(couple_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- ============================================
-- WISHLISTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  is_shared BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wishlists_couple ON wishlists(couple_id);

-- ============================================
-- WISHLIST ITEMS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  source_url TEXT,
  source_platform TEXT CHECK (source_platform IN ('instagram', 'tiktok', 'web', 'manual')),
  category TEXT,
  notes TEXT,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_wishlist_items_wishlist ON wishlist_items(wishlist_id);

-- ============================================
-- KEY DATES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS key_dates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_type TEXT CHECK (recurrence_type IN ('yearly', 'monthly')),
  date_type TEXT DEFAULT 'milestone'
    CHECK (date_type IN ('anniversary', 'birthday', 'trip', 'milestone', 'other')),
  cover_image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_key_dates_couple ON key_dates(couple_id, date);

-- ============================================
-- DATE PLAN HISTORY TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS date_plan_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id UUID NOT NULL,
  event_id UUID REFERENCES events(id),
  planned_by UUID NOT NULL REFERENCES profiles(id),
  accepted_by UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'accepted', 'declined', 'completed', 'cancelled')),
  planned_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_date_history_couple ON date_plan_history(couple_id, planned_at DESC);

-- ============================================
-- NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL
    CHECK (type IN ('date_request', 'date_reminder', 'event_invite',
                     'todo_assigned', 'message', 'key_date_upcoming',
                     'calendar_sync', 'pairing_request')),
  title TEXT NOT NULL,
  body TEXT,
  related_id UUID,
  related_type TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read, created_at DESC);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get the couple_id for current user
CREATE OR REPLACE FUNCTION get_couple_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT CASE
    WHEN partner_id IS NOT NULL THEN LEAST(id, partner_id)
    ELSE id
  END
  FROM profiles WHERE id = auth.uid();
$$;

-- Function to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own and partner profiles"
  ON profiles FOR SELECT
  USING (id = auth.uid() OR partner_id = auth.uid());

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Calendar Connections
ALTER TABLE calendar_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own calendar connections"
  ON calendar_connections FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own calendar connections"
  ON calendar_connections FOR ALL
  USING (user_id = auth.uid());

-- Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own couple events"
  ON events FOR SELECT
  USING (couple_id = get_couple_id());

CREATE POLICY "Users can create events for own couple"
  ON events FOR INSERT
  WITH CHECK (couple_id = get_couple_id() AND created_by = auth.uid());

CREATE POLICY "Users can update own couple events"
  ON events FOR UPDATE
  USING (couple_id = get_couple_id());

CREATE POLICY "Users can delete own couple events"
  ON events FOR DELETE
  USING (couple_id = get_couple_id());

-- Todo Lists
ALTER TABLE todo_lists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own couple todo lists"
  ON todo_lists FOR SELECT
  USING (couple_id = get_couple_id() AND (NOT is_private OR created_by = auth.uid()));

CREATE POLICY "Users can create todo lists for own couple"
  ON todo_lists FOR INSERT
  WITH CHECK (couple_id = get_couple_id());

CREATE POLICY "Users can update own couple todo lists"
  ON todo_lists FOR UPDATE
  USING (couple_id = get_couple_id());

CREATE POLICY "Users can delete own couple todo lists"
  ON todo_lists FOR DELETE
  USING (couple_id = get_couple_id());

-- Todos
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own couple todos"
  ON todos FOR SELECT
  USING (couple_id = get_couple_id());

CREATE POLICY "Users can create todos for own couple"
  ON todos FOR INSERT
  WITH CHECK (couple_id = get_couple_id() AND created_by = auth.uid());

CREATE POLICY "Users can update own couple todos"
  ON todos FOR UPDATE
  USING (couple_id = get_couple_id());

CREATE POLICY "Users can delete own couple todos"
  ON todos FOR DELETE
  USING (couple_id = get_couple_id());

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own couple messages"
  ON messages FOR SELECT
  USING (couple_id = get_couple_id());

CREATE POLICY "Users can send messages to own couple"
  ON messages FOR INSERT
  WITH CHECK (couple_id = get_couple_id() AND sender_id = auth.uid());

-- Wishlists
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own couple wishlists"
  ON wishlists FOR SELECT
  USING (couple_id = get_couple_id());

CREATE POLICY "Users can manage own couple wishlists"
  ON wishlists FOR ALL
  USING (couple_id = get_couple_id());

-- Wishlist Items
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view wishlist items"
  ON wishlist_items FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM wishlists w WHERE w.id = wishlist_id AND w.couple_id = get_couple_id()
  ));

CREATE POLICY "Users can manage wishlist items"
  ON wishlist_items FOR ALL
  USING (EXISTS (
    SELECT 1 FROM wishlists w WHERE w.id = wishlist_id AND w.couple_id = get_couple_id()
  ));

-- Key Dates
ALTER TABLE key_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own couple key dates"
  ON key_dates FOR SELECT
  USING (couple_id = get_couple_id());

CREATE POLICY "Users can manage own couple key dates"
  ON key_dates FOR ALL
  USING (couple_id = get_couple_id());

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own notifications"
  ON notifications FOR ALL
  USING (user_id = auth.uid());

-- ============================================
-- REALTIME SUBSCRIPTIONS
-- ============================================

-- Enable realtime for key tables
ALTER TABLE events REPLICA IDENTITY FULL;
ALTER TABLE messages REPLICA IDENTITY FULL;
ALTER TABLE todos REPLICA IDENTITY FULL;
ALTER TABLE notifications REPLICA IDENTITY FULL;

-- Note: Enable these in Supabase dashboard under Database > Replication
-- events, messages, todos, notifications should all be enabled for realtime

-- ============================================
-- SEED DATA
-- ============================================

-- Pre-populate common grocery categories
-- This can be done via the app, no need for DB seed
