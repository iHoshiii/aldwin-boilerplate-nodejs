/**
 * Chat — AI chat interface shell ported from Vetify.
 * Decoupled from FastAPI. Messages are sent to /api/v1/chat on the
 * Express backend. Wire up src/server/routes/v1/index.js with a
 * POST /chat endpoint that calls your AI provider.
 *
 * Session history is stored in localStorage (no auth required).
 */
import { useEffect, useRef, useState } from 'react';

/* ─── localStorage helpers ──────────────────────────────────── */
const STORAGE_KEY = 'bp_chat_sessions';

function loadSessions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveSession(session) {
  const sessions = loadSessions();
  const idx = sessions.findIndex((s) => s.id === session.id);
  if (idx >= 0) sessions[idx] = session;
  else sessions.unshift(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(0, 50)));
}

function deleteSession(id) {
  const sessions = loadSessions().filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

function newSessionId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function deriveTitle(messages) {
  const first = messages.find((m) => m.role === 'user');
  if (!first) return 'New chat';
  return first.content.length > 40 ? first.content.slice(0, 40) + '…' : first.content;
}

/* ─── Suggestions for empty state ──────────────────────────── */
const SUGGESTIONS = [
  'What can this AI assistant help me with?',
  'Show me what this boilerplate can do.',
  'How do I connect this to my database?',
  'Help me understand the project structure.',
];

/* ─── ChatWindow (inner component) ─────────────────────────── */
function ChatWindow({ messages, onMessagesChange }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);
  const abortRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const lastUserIndex = messages.reduce((last, m, i) => (m.role === 'user' ? i : last), -1);

  const sendMessage = async (text, replaceFromIndex) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const userMsg = { role: 'user', content };
    const base = replaceFromIndex != null ? messages.slice(0, replaceFromIndex) : messages;
    const updated = [...base, userMsg];
    onMessagesChange(updated);
    setInput('');
    setLoading(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          history: base.map((m) => ({ role: m.role, content: m.content })),
        }),
        signal: controller.signal,
      });
      const data = await res.json();
      onMessagesChange([...updated, { role: 'assistant', content: data.reply || data.message || 'No response.' }]);
    } catch (err) {
      if (err?.name === 'AbortError') {
        onMessagesChange(base);
        setInput(content);
      } else {
        onMessagesChange([...updated, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
      }
    } finally {
      abortRef.current = null;
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 shadow-lg shadow-teal-500/20">
              <span className="text-3xl">🤖</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">AI Assistant</h2>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">
                Ask anything. This assistant connects to your Express backend.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-lg">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="text-left text-sm px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-600 hover:border-teal-400 hover:bg-teal-50 hover:text-teal-700 transition-all duration-200 shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 shadow-sm mt-1">
                    <span className="text-sm">🤖</span>
                  </div>
                )}
                <div className={`max-w-[65%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-teal-600 text-white rounded-tr-sm'
                    : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                }`}>
                  <p className="whitespace-pre-wrap">{m.content}</p>
                </div>
                {m.role === 'user' && (
                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200 text-slate-600 text-xs font-bold mt-1">
                    You
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-teal-700 shadow-sm mt-1">
                  <span className="text-sm">🤖</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t border-slate-200 bg-white px-6 py-3">
        <div className="flex items-center gap-2">
          <div className="flex-1 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 focus-within:border-teal-400 focus-within:ring-2 focus-within:ring-teal-400/20 transition-all">
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message…"
              className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none max-h-32"
            />
            {loading ? (
              <button
                onClick={() => abortRef.current?.abort()}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-red-500 text-white transition-all hover:bg-red-600"
                title="Cancel"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                  <rect x="4" y="4" width="16" height="16" rx="2" />
                </svg>
              </button>
            ) : (
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim()}
                className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-teal-600 text-white transition-all hover:bg-teal-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4 rotate-90">
                  <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-1 text-center">
          This AI connects to your Express backend — wire up POST /api/v1/chat to your AI provider.
        </p>
      </div>
    </div>
  );
}

/* ─── Chat Page ─────────────────────────────────────────────── */
export default function ChatPage() {
  const [sessions, setSessions] = useState([]);
  const [activeId, setActiveId] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const stored = loadSessions();
    setSessions(stored);
    setActiveId(newSessionId());
  }, []);

  useEffect(() => {
    if (!activeId || messages.length === 0) return;
    const session = { id: activeId, title: deriveTitle(messages), messages, updatedAt: Date.now() };
    saveSession(session);
    setSessions(loadSessions());
  }, [messages, activeId]);

  const handleNewChat = () => {
    setActiveId(newSessionId());
    setMessages([]);
  };

  const handleSelectSession = (session) => {
    setActiveId(session.id);
    setMessages(session.messages);
  };

  const handleDeleteSession = (e, id) => {
    e.stopPropagation();
    deleteSession(id);
    setSessions(loadSessions());
    if (id === activeId) handleNewChat();
  };

  return (
    <main className="h-[calc(100vh-57px)] flex overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white flex flex-col overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-teal-500 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 hover:bg-teal-100 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2">Recent</p>
          {sessions.length === 0 ? (
            <p className="text-xs text-slate-400 px-2">No recent chats yet.</p>
          ) : (
            sessions.map((s) => (
              <div
                key={s.id}
                onClick={() => handleSelectSession(s)}
                className={`group flex items-center justify-between gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-colors ${
                  s.id === activeId ? 'bg-teal-50 text-teal-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base flex-shrink-0">💬</span>
                  <span className="text-xs font-medium truncate">{s.title}</span>
                </div>
                <button
                  onClick={(e) => handleDeleteSession(e, s.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-3.5 w-3.5">
                    <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatWindow messages={messages} onMessagesChange={setMessages} />
      </div>
    </main>
  );
}
