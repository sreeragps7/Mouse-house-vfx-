import { useState, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Mail,
  Send,
  Trash2,
  RefreshCw,
  Search,
  ExternalLink,
  Sparkles,
  Inbox,
  PenSquare,
  ShieldCheck,
  LogOut,
  AlertCircle,
  CheckCircle2,
  Film,
} from "lucide-react";
import { useGmail } from "../context/GmailContext";
import GoogleSignInButton from "./GoogleSignInButton";
import { GmailMessageSummary } from "../services/gmailApi";

export default function GmailModal() {
  const {
    isModalOpen,
    closeGmailModal,
    isAuthenticated,
    isLoadingAuth,
    user,
    profile,
    login,
    logout,
    messages,
    isLoadingMessages,
    messagesError,
    fetchMessages,
    sendEmail,
    deleteMessage,
  } = useGmail();

  const [activeTab, setActiveTab] = useState<"inbox" | "compose">("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<GmailMessageSummary | null>(null);

  // Compose state
  const [toAddress, setToAddress] = useState("sreeragpsuresh9@gmail.com");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState<string | null>(null);

  // Destructive Confirmation States (MANDATORY for Workspace skill)
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isModalOpen) return null;

  const handleTemplateSelect = (templateType: "vfx" | "collaboration" | "festival") => {
    if (templateType === "vfx") {
      setSubject("[VFX Inquiry] Feature Film Post-Production & CGI Compositing");
      setBody(
        `Dear Sreerosh & Mouse House VFX Team,\n\nI would like to inquire about Visual Effects and CGI compositing services for an upcoming production.\n\nProject Title:\nRuntime/Shots count:\nEstimated Timeline:\nKey VFX requirements (e.g. 3D elements, green screen, wire removal, color grading):\n\nLooking forward to discussing this project!\n\nBest regards,\n${user?.displayName || ""}`
      );
    } else if (templateType === "collaboration") {
      setSubject("[Film Collaboration] Direction & Visual Storytelling Proposal");
      setBody(
        `Dear Sreerosh,\n\nI am reaching out regarding a creative collaboration with Mouse House VFX.\n\nProject Concept:\nRole required:\nTentative schedule:\n\nThank you,\n${user?.displayName || ""}`
      );
    } else {
      setSubject("[Festival Screening] Paithalattam / Theatrical Showcase Inquiry");
      setBody(
        `Hello Mouse House VFX Team,\n\nI am contacting you regarding your film portfolio (including Paithalattam and Oru Parvai Pothum) for a festival screening / press feature.\n\nEvent / Organization:\nDate & Venue:\nFormat:\n\nWarm regards,\n${user?.displayName || ""}`
      );
    }
    setActiveTab("compose");
  };

  const handlePromptSend = (e: FormEvent) => {
    e.preventDefault();
    if (!toAddress.trim() || !subject.trim() || !body.trim()) return;
    setConfirmSendOpen(true);
  };

  const handleExecuteSend = async () => {
    setConfirmSendOpen(false);
    setIsSending(true);
    setSendSuccess(null);
    try {
      await sendEmail({ to: toAddress, subject, body });
      setSendSuccess("Email dispatched successfully via Gmail!");
      setSubject("");
      setBody("");
      setTimeout(() => setSendSuccess(null), 4000);
      setActiveTab("inbox");
    } catch (err: any) {
      alert("Failed to send email: " + (err.message || "Unknown error"));
    } finally {
      setIsSending(false);
    }
  };

  const handleExecuteDelete = async (messageId: string) => {
    setIsDeleting(true);
    try {
      await deleteMessage(messageId);
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      setConfirmDeleteId(null);
    } catch (err: any) {
      alert("Failed to trash email: " + (err.message || "Unknown error"));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md"
      onClick={closeGmailModal}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl bg-vfx-card border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-vfx-dark/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center text-neon-blue">
              <Mail size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Mouse House <span className="text-neon-blue">Gmail Hub</span>
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                  Google Workspace
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Official Studio Communications &amp; Project Inquiries
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && user && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-300">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || "User"}
                    className="w-5 h-5 rounded-full object-cover"
                  />
                ) : (
                  <ShieldCheck size={14} className="text-emerald-400" />
                )}
                <span className="max-w-[140px] truncate">{user.email}</span>
                <button
                  type="button"
                  onClick={logout}
                  className="ml-1 p-1 hover:text-rose-400 transition-colors"
                  title="Sign out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={closeGmailModal}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        {!isAuthenticated ? (
          /* Unauthenticated State: Sign in with Google */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neon-blue/20 to-neon-purple/20 border border-white/10 flex items-center justify-center text-neon-blue shadow-lg">
              <Mail size={32} />
            </div>

            <div className="max-w-md space-y-2">
              <h4 className="text-xl font-bold text-white">
                Connect Studio Gmail
              </h4>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Sign in with your Google account with permission to manage official studio communications, send project inquiries directly to Sreerosh &amp; Mouse House VFX, and view message threads.
              </p>
            </div>

            <div className="pt-2">
              <GoogleSignInButton
                onClick={login}
                isLoading={isLoadingAuth}
                text="Sign in with Google to Connect Gmail"
              />
            </div>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg text-left text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <Sparkles size={14} className="text-neon-blue" />
                <p className="font-semibold text-white">Direct Dispatch</p>
                <p className="text-gray-400 text-[11px]">Send project briefs with verified sender credentials.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <Inbox size={14} className="text-neon-purple" />
                <p className="font-semibold text-white">Studio Inquiries</p>
                <p className="text-gray-400 text-[11px]">Check recent inquiry threads and studio updates.</p>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1">
                <Film size={14} className="text-emerald-400" />
                <p className="font-semibold text-white">VFX Presets</p>
                <p className="text-gray-400 text-[11px]">One-click templates for quoting and screenings.</p>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated State */
          <div className="flex-1 flex flex-col min-h-0">
            {/* Action Bar */}
            <div className="px-6 py-3 border-b border-white/10 bg-black/40 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("inbox")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeTab === "inbox"
                      ? "bg-neon-blue text-vfx-dark shadow-sm"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <Inbox size={14} />
                  <span>Studio Inbox</span>
                  {profile && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/20">
                      {profile.messagesTotal}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("compose")}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    activeTab === "compose"
                      ? "bg-neon-blue text-vfx-dark shadow-sm"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  <PenSquare size={14} />
                  <span>Compose Brief</span>
                </button>
              </div>

              {/* Template shortcuts */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                <span className="text-[11px] text-gray-500 font-mono hidden sm:inline">Templates:</span>
                <button
                  type="button"
                  onClick={() => handleTemplateSelect("vfx")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-neon-blue/20 text-gray-300 hover:text-neon-blue text-[11px] transition-colors"
                >
                  VFX Quote
                </button>
                <button
                  type="button"
                  onClick={() => handleTemplateSelect("collaboration")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-neon-blue/20 text-gray-300 hover:text-neon-blue text-[11px] transition-colors"
                >
                  Film Collab
                </button>
                <button
                  type="button"
                  onClick={() => handleTemplateSelect("festival")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-neon-blue/20 text-gray-300 hover:text-neon-blue text-[11px] transition-colors"
                >
                  Screening
                </button>
              </div>
            </div>

            {/* Success toast */}
            {sendSuccess && (
              <div className="mx-6 mt-3 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center gap-2 text-emerald-300 text-xs">
                <CheckCircle2 size={16} />
                <span>{sendSuccess}</span>
              </div>
            )}

            {/* Tab: Inbox */}
            {activeTab === "inbox" && (
              <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
                {/* Messages list */}
                <div
                  className={`flex-1 border-r border-white/10 flex flex-col ${
                    selectedMessage ? "hidden md:flex" : "flex"
                  }`}
                >
                  {/* Search and refresh */}
                  <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-vfx-dark/30">
                    <div className="relative flex-1">
                      <Search
                        size={14}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchMessages(searchQuery)}
                        placeholder="Search emails (press Enter)..."
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => fetchMessages(searchQuery)}
                      disabled={isLoadingMessages}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      title="Refresh messages"
                    >
                      <RefreshCw
                        size={14}
                        className={isLoadingMessages ? "animate-spin text-neon-blue" : ""}
                      />
                    </button>
                  </div>

                  {/* List items */}
                  <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                    {isLoadingMessages ? (
                      <div className="p-10 text-center space-y-3">
                        <div className="w-6 h-6 border-2 border-neon-blue border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-xs text-gray-400">Loading messages from Gmail...</p>
                      </div>
                    ) : messagesError ? (
                      <div className="p-8 text-center space-y-2">
                        <AlertCircle size={24} className="text-rose-400 mx-auto" />
                        <p className="text-xs text-rose-300 font-medium">{messagesError}</p>
                        <button
                          type="button"
                          onClick={() => fetchMessages()}
                          className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-white hover:bg-white/15"
                        >
                          Retry
                        </button>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="p-12 text-center space-y-2">
                        <Inbox size={32} className="text-gray-600 mx-auto" />
                        <p className="text-sm font-semibold text-gray-300">No emails found</p>
                        <p className="text-xs text-gray-500">
                          {searchQuery ? "No results match your search" : "Your inbox is clear"}
                        </p>
                      </div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg.id}
                          onClick={() => setSelectedMessage(msg)}
                          className={`p-4 cursor-pointer transition-colors hover:bg-white/5 flex flex-col gap-1 ${
                            selectedMessage?.id === msg.id ? "bg-neon-blue/10 border-l-2 border-neon-blue" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span
                              className={`font-semibold truncate max-w-[180px] ${
                                msg.unread ? "text-neon-blue" : "text-white"
                              }`}
                            >
                              {msg.from}
                            </span>
                            <span className="text-[10px] text-gray-500 shrink-0">
                              {msg.date ? new Date(msg.date).toLocaleDateString() : ""}
                            </span>
                          </div>
                          <p
                            className={`text-xs truncate ${
                              msg.unread ? "font-bold text-gray-100" : "text-gray-300"
                            }`}
                          >
                            {msg.subject || "(No Subject)"}
                          </p>
                          <p className="text-[11px] text-gray-400 line-clamp-1">{msg.snippet}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Message preview details panel */}
                <div
                  className={`flex-1 overflow-y-auto flex flex-col bg-vfx-dark/20 ${
                    !selectedMessage ? "hidden md:flex items-center justify-center p-8 text-center" : "flex p-6"
                  }`}
                >
                  {!selectedMessage ? (
                    <div className="text-center space-y-2 text-gray-500">
                      <Mail size={36} className="mx-auto opacity-40" />
                      <p className="text-xs">Select an email to view complete details</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
                        <div>
                          <button
                            type="button"
                            onClick={() => setSelectedMessage(null)}
                            className="md:hidden text-xs text-neon-blue mb-2 flex items-center gap-1"
                          >
                            ← Back to list
                          </button>
                          <h4 className="text-lg font-bold text-white">{selectedMessage.subject}</h4>
                          <p className="text-xs text-gray-400 mt-1">
                            From: <strong className="text-gray-200">{selectedMessage.from}</strong>
                          </p>
                          {selectedMessage.to && (
                            <p className="text-xs text-gray-500">To: {selectedMessage.to}</p>
                          )}
                          <p className="text-[11px] text-gray-500 font-mono mt-0.5">
                            {selectedMessage.date}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setToAddress(selectedMessage.from?.match(/<([^>]+)>/)?.[1] || selectedMessage.from || "");
                              setSubject(`Re: ${selectedMessage.subject}`);
                              setActiveTab("compose");
                            }}
                            className="px-3 py-1.5 rounded-xl bg-neon-blue/20 hover:bg-neon-blue text-neon-blue hover:text-vfx-dark text-xs font-semibold flex items-center gap-1.5 transition-all"
                          >
                            <Send size={12} />
                            <span>Reply</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(selectedMessage.id)}
                            className="p-2 rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-400 transition-colors"
                            title="Move email to trash"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-black/40 border border-white/10 text-xs sm:text-sm text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
                        {selectedMessage.snippet}
                      </div>

                      <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/10">
                        <span>Message ID: {selectedMessage.id}</span>
                        <a
                          href={`https://mail.google.com/mail/u/0/#inbox/${selectedMessage.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-neon-blue hover:underline"
                        >
                          <span>Open in Gmail</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab: Compose */}
            {activeTab === "compose" && (
              <div className="flex-1 overflow-y-auto p-6 sm:p-8">
                <form onSubmit={handlePromptSend} className="max-w-2xl mx-auto space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400">Recipient Email</label>
                    <input
                      type="email"
                      required
                      value={toAddress}
                      onChange={(e) => setToAddress(e.target.value)}
                      placeholder="client@production.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400">Subject</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g. [Mouse House VFX] Film Compositing Brief"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-gray-400">Message Body</label>
                      <span className="text-[11px] text-gray-500 font-mono">
                        Sending as {user?.email}
                      </span>
                    </div>
                    <textarea
                      required
                      rows={9}
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      placeholder="Write your brief, timeline, or notes here..."
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition-colors font-sans leading-relaxed"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Dispatched directly through Google Workspace API
                    </span>

                    <button
                      type="submit"
                      disabled={isSending}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-neon-blue to-neon-purple text-vfx-dark font-bold text-xs flex items-center gap-2 hover:opacity-95 transition-opacity shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                    >
                      <Send size={14} />
                      <span>{isSending ? "Preparing..." : "Send via Gmail"}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Modal Footer info */}
        <div className="px-6 py-3 border-t border-white/10 bg-vfx-dark/80 flex items-center justify-between text-[11px] text-gray-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck size={13} className="text-neon-blue" />
            <span>Mouse House VFX • Authorized Workspace Integration</span>
          </div>
          <span>Signed into: {user?.email || "Guest"}</span>
        </div>
      </motion.div>

      {/* MANDATORY CONFIRMATION DIALOG FOR SENDING (Workspace skill requirement) */}
      <AnimatePresence>
        {confirmSendOpen && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setConfirmSendOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-vfx-card border border-white/20 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center text-neon-blue">
                <Send size={20} />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Confirm Sending Email</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Are you sure you want to send this email via your Gmail account (<strong>{user?.email}</strong>)?
                </p>
              </div>

              <div className="p-3 rounded-xl bg-black/60 border border-white/10 space-y-1 text-xs font-mono">
                <div><strong className="text-white">To:</strong> {toAddress}</div>
                <div><strong className="text-white">Subject:</strong> {subject}</div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmSendOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteSend}
                  className="px-5 py-2 rounded-xl bg-neon-blue text-vfx-dark font-bold text-xs hover:bg-neon-blue/90 flex items-center gap-1.5 shadow"
                >
                  <Send size={13} />
                  <span>Confirm &amp; Send</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MANDATORY CONFIRMATION DIALOG FOR TRASHING/DELETING (Workspace skill requirement) */}
      <AnimatePresence>
        {confirmDeleteId && (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
            onClick={() => setConfirmDeleteId(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-md w-full bg-vfx-card border border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-4"
            >
              <div className="w-12 h-12 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <Trash2 size={20} />
              </div>

              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Move Email to Trash?</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Are you sure you want to move this email to the Gmail Trash folder? You can still recover it from Trash in your Gmail account.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteId(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => confirmDeleteId && handleExecuteDelete(confirmDeleteId)}
                  disabled={isDeleting}
                  className="px-5 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 flex items-center gap-1.5 shadow"
                >
                  <Trash2 size={13} />
                  <span>{isDeleting ? "Trashing..." : "Move to Trash"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
