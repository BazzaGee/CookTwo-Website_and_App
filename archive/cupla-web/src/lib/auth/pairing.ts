import { supabase } from '../supabase/client';

export async function generatePairingCode(): Promise<string> {
  const words = ['LOVE', 'FIRE', 'MOON', 'STAR', 'WAVE', 'HEART', 'DREAM', 'SPARK', 'BLUE', 'GOLD'];
  const w1 = words[Math.floor(Math.random() * words.length)];
  const w2 = words[Math.floor(Math.random() * words.length)];
  const num = Math.floor(Math.random() * 999).toString().padStart(3, '0');
  return `${w1}-${w2}-${num}`;
}

export async function validatePairingCode(code: string): Promise<{ valid: boolean; error?: string; partnerId?: string }> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, partner_id, pairing_code_expires_at')
    .eq('pairing_code', code.toUpperCase())
    .single();
  
  if (error || !data) {
    return { valid: false, error: 'Invalid pairing code' };
  }
  
  if (data.partner_id) {
    return { valid: false, error: 'This partner is already linked with someone else' };
  }
  
  if (new Date(data.pairing_code_expires_at) < new Date()) {
    return { valid: false, error: 'This pairing code has expired' };
  }
  
  return { valid: true, partnerId: data.id };
}

export async function linkPartners(partnerId: string): Promise<{ success: boolean; error?: string }> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'Not authenticated' };
  
  // Link both ways
  const { error: error1 } = await supabase
    .from('profiles')
    .update({ partner_id: partnerId })
    .eq('id', user.id);
  
  const { error: error2 } = await supabase
    .from('profiles')
    .update({ partner_id: user.id })
    .eq('id', partnerId);
  
  if (error1 || error2) {
    return { success: false, error: 'Failed to link accounts' };
  }
  
  return { success: true };
}

export async function getProfileByCode(code: string): Promise<{ name: string | null } | null> {
  const { data } = await supabase
    .from('profiles')
    .select('full_name, pairing_code_expires_at, partner_id')
    .eq('pairing_code', code.toUpperCase())
    .single();

  if (!data) return null;
  if (data.partner_id) return null;
  if (new Date(data.pairing_code_expires_at) < new Date()) return null;

  return { name: data.full_name };
}
