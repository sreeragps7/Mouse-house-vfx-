export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  from?: string;
  to?: string;
  subject?: string;
  date?: string;
  unread?: boolean;
}

export interface GmailProfile {
  emailAddress: string;
  messagesTotal: number;
  threadsTotal: number;
  historyId: string;
}

// Helper to encode UTF-8 string to base64url (RFC 4648 § 5)
function toBase64Url(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = "";
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getGmailProfile(accessToken: string): Promise<GmailProfile> {
  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/profile", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gmail API Profile Error (${res.status}): ${errorText}`);
  }

  return res.json();
}

export async function listGmailMessages(
  accessToken: string,
  options: { maxResults?: number; q?: string; labelIds?: string[] } = {}
): Promise<{ messages: { id: string; threadId: string }[]; resultSizeEstimate?: number }> {
  const params = new URLSearchParams();
  params.set("maxResults", String(options.maxResults || 15));
  if (options.q) params.set("q", options.q);
  if (options.labelIds) {
    options.labelIds.forEach((l) => params.append("labelIds", l));
  }

  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gmail API list error (${res.status}): ${errorText}`);
  }

  return res.json();
}

export async function getGmailMessage(
  accessToken: string,
  messageId: string
): Promise<GmailMessageSummary> {
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}?format=full`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Gmail API get error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  const headers = data.payload?.headers || [];
  const getHeader = (name: string) =>
    headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value;

  const labels: string[] = data.labelIds || [];

  return {
    id: data.id,
    threadId: data.threadId,
    snippet: data.snippet,
    from: getHeader("from") || "Unknown Sender",
    to: getHeader("to") || "",
    subject: getHeader("subject") || "(No Subject)",
    date: getHeader("date") || "",
    unread: labels.includes("UNREAD"),
  };
}

export async function sendGmailMessage(
  accessToken: string,
  params: { to: string; subject: string; body: string }
): Promise<any> {
  // Construct RFC 2822 email format
  const emailLines = [
    `To: ${params.to}`,
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(params.subject)))}?=`,
    `MIME-Version: 1.0`,
    `Content-Type: text/plain; charset=UTF-8`,
    `Content-Transfer-Encoding: 7bit`,
    "",
    params.body,
  ];

  const rawEmail = emailLines.join("\r\n");
  const rawBase64Url = toBase64Url(rawEmail);

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ raw: rawBase64Url }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to send email (${res.status}): ${errorText}`);
  }

  return res.json();
}

export async function trashGmailMessage(accessToken: string, messageId: string): Promise<any> {
  const res = await fetch(
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}/trash`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to trash email (${res.status}): ${errorText}`);
  }

  return res.json();
}
