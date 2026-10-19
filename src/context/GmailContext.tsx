import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User } from "firebase/auth";
import {
  initAuth,
  googleSignIn,
  logout as authLogout,
  getAccessToken,
} from "../services/googleAuth";
import {
  GmailMessageSummary,
  GmailProfile,
  getGmailProfile,
  listGmailMessages,
  getGmailMessage,
  sendGmailMessage,
  trashGmailMessage,
} from "../services/gmailApi";

interface GmailContextType {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  isModalOpen: boolean;
  openGmailModal: () => void;
  closeGmailModal: () => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  profile: GmailProfile | null;
  messages: GmailMessageSummary[];
  isLoadingMessages: boolean;
  messagesError: string | null;
  fetchMessages: (searchQuery?: string) => Promise<void>;
  sendEmail: (params: { to: string; subject: string; body: string }) => Promise<any>;
  deleteMessage: (messageId: string) => Promise<void>;
}

const GmailContext = createContext<GmailContextType | undefined>(undefined);

export function GmailProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [profile, setProfile] = useState<GmailProfile | null>(null);
  const [messages, setMessages] = useState<GmailMessageSummary[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);

  const openGmailModal = () => setIsModalOpen(true);
  const closeGmailModal = () => setIsModalOpen(false);

  // Initialize Auth state listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
        setIsLoadingAuth(false);
      },
      () => {
        setUser(null);
        setAccessToken(null);
        setIsLoadingAuth(false);
      }
    );

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  const login = async () => {
    setIsLoadingAuth(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser(res.user);
        setAccessToken(res.accessToken);
      }
    } catch (err) {
      console.error("Sign-in failed:", err);
      throw err;
    } finally {
      setIsLoadingAuth(false);
    }
  };

  const logout = async () => {
    try {
      await authLogout();
      setUser(null);
      setAccessToken(null);
      setProfile(null);
      setMessages([]);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const fetchMessages = useCallback(
    async (searchQuery?: string) => {
      const token = accessToken || (await getAccessToken());
      if (!token) return;

      setIsLoadingMessages(true);
      setMessagesError(null);
      try {
        // Fetch profile
        getGmailProfile(token)
          .then(setProfile)
          .catch((e) => console.warn("Failed to load profile:", e));

        const list = await listGmailMessages(token, {
          maxResults: 12,
          q: searchQuery,
        });

        if (!list.messages || list.messages.length === 0) {
          setMessages([]);
          setIsLoadingMessages(false);
          return;
        }

        // Fetch details in parallel with limit
        const summaries = await Promise.all(
          list.messages.slice(0, 10).map((msg) =>
            getGmailMessage(token, msg.id).catch((err) => ({
              id: msg.id,
              threadId: msg.threadId,
              subject: "Message detail unavailable",
              snippet: "",
              from: "Unknown",
            }))
          )
        );

        setMessages(summaries);
      } catch (err: any) {
        console.error("Failed to fetch messages:", err);
        setMessagesError(err.message || "Failed to load messages from Gmail");
      } finally {
        setIsLoadingMessages(false);
      }
    },
    [accessToken]
  );

  // Auto-fetch messages when authenticated and modal is opened
  useEffect(() => {
    if (accessToken && isModalOpen) {
      fetchMessages();
    }
  }, [accessToken, isModalOpen, fetchMessages]);

  const sendEmail = async (params: { to: string; subject: string; body: string }) => {
    const token = accessToken || (await getAccessToken());
    if (!token) {
      throw new Error("You must connect your Gmail account to send emails.");
    }
    const result = await sendGmailMessage(token, params);
    // Refresh messages after sending
    fetchMessages();
    return result;
  };

  const deleteMessage = async (messageId: string) => {
    const token = accessToken || (await getAccessToken());
    if (!token) {
      throw new Error("You must connect your Gmail account to delete emails.");
    }
    await trashGmailMessage(token, messageId);
    setMessages((prev) => prev.filter((m) => m.id !== messageId));
  };

  return (
    <GmailContext.Provider
      value={{
        user,
        accessToken,
        isAuthenticated: !!accessToken && !!user,
        isLoadingAuth,
        isModalOpen,
        openGmailModal,
        closeGmailModal,
        login,
        logout,
        profile,
        messages,
        isLoadingMessages,
        messagesError,
        fetchMessages,
        sendEmail,
        deleteMessage,
      }}
    >
      {children}
    </GmailContext.Provider>
  );
}

export function useGmail() {
  const context = useContext(GmailContext);
  if (!context) {
    throw new Error("useGmail must be used within a GmailProvider");
  }
  return context;
}
