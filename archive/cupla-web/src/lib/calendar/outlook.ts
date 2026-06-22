const MICROSOFT_CLIENT_ID = import.meta.env.MICROSOFT_CLIENT_ID;
const REDIRECT_URI = `${import.meta.env.PUBLIC_SITE_URL}/api/calendar/callback`;

export function getMicrosoftAuthUrl(): string {
  const rootUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
  const options = {
    client_id: MICROSOFT_CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    scope: 'Calendars.Read Calendars.ReadWrite offline_access',
    response_mode: 'query',
  };
  
  const qs = new URLSearchParams(options);
  return `${rootUrl}?${qs.toString()}`;
}

export async function getMicrosoftTokensFromCode(code: string) {
  const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
  const values = {
    client_id: MICROSOFT_CLIENT_ID,
    client_secret: import.meta.env.MICROSOFT_CLIENT_SECRET,
    code,
    redirect_uri: REDIRECT_URI,
    grant_type: 'authorization_code',
  };
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(values),
  });
  
  return response.json();
}
