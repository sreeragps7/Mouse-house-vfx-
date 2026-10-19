import React, { createContext, useContext, useState, useEffect } from "react";

interface AdminContextType {
  isAdmin: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (passcode: string) => boolean;
  logout: () => void;
}

const ADMIN_STORAGE_KEY = "mousehouse_admin_session";
// Accepted studio passcodes
const VALID_PASSCODES = ["mousehouse", "sreerosh", "vfx2025", "1234", "sreerag"];

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(ADMIN_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Check URL query param or hash on load (?admin=true or #admin)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true" || window.location.hash === "#admin") {
      setIsAuthModalOpen(true);
    }

    // Keyboard shortcut: Ctrl+Shift+A or Cmd+Shift+A to toggle admin login
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === "A" || e.key === "a")) {
        e.preventDefault();
        setIsAuthModalOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const login = (passcode: string): boolean => {
    const normalized = (passcode || "").trim().toLowerCase();
    if (VALID_PASSCODES.includes(normalized)) {
      setIsAdmin(true);
      try {
        sessionStorage.setItem(ADMIN_STORAGE_KEY, "true");
      } catch (e) {
        console.warn(e);
      }
      setIsAuthModalOpen(false);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        logout,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useStudioAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useStudioAdmin must be used within an AdminProvider");
  }
  return context;
}
