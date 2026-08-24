import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { renderFormattedMarkdown } from '../utils/formatMarkdown';
import { RiskBadge, StatusBadge, PriorityBadge } from '../components/common/Badge';
import api from '../services/api';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Flame,
  AlertTriangle,
  FileText,
  Sliders,
  ClipboardList,
  RefreshCw,
  Copy,
  Check,
  Plus,
  ArrowRight
} from 'lucide-react';

const SUGGESTIONS = [
  { label: '⚡ Top Risk Units', prompt: 'Analyze top recurring risk units and recommend preventative actions' },
  { label: '📋 Overdue Tickets', prompt: 'Show all overdue SLA tickets and required escalations' },
  { label: '🎛️ Dynamic Decay Simulation', prompt: 'Explain the dynamic exponential decay formula and show current parameters' },
  { label: '📢 Draft Notice', prompt: 'Draft a maintenance circular for common plumbing riser inspection' }
];

export const AICopilotView = ({ onNavigateTab, onOpenCreateTicket }) => {
  const { user } = useAuth();
  const { success } = useToast();

  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `### Welcome to Greenwood Operations AI\n\nI am your real-time facility intelligence copilot powered by live telemetry, exponential decay risk-scoring, and state-validated maintenance tracking.\n\n**How can I assist you today?**`,
      data: null
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (customPrompt) => {
    const query = (customPrompt || input).trim();
    if (!query || loading) return;

    const userMsgId = 'u-' + Date.now();
    const assistantMsgId = 'a-' + Date.now();

    setMessages((prev) => [
      ...prev,
      { id: userMsgId, sender: 'user', text: query }
    ]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/assistant/chat', { prompt: query });
      const replyData = res.data;

      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          sender: 'assistant',
          text: replyData.reply || 'Analysis completed.',
          actionType: replyData.actionType,
          payload: replyData.data
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: assistantMsgId,
          sender: 'assistant',
          text: `⚠️ Query processing failed: ${err.message}`
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success('Copied to clipboard.');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6.5rem)] max-w-4xl mx-auto">
      {/* Top Status Capsule */}
      <div className="flex items-center justify-between px-4 py-2 mb-2 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Operations Intelligence Engine</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Actor: <strong>{user?.name}</strong> ({user?.role?.toUpperCase()})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenCreateTicket}
            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors"
          >
            <Plus className="w-3 h-3" />
            <span>Raise Ticket</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-4 space-y-5">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-3.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-md shadow-blue-500/20 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`relative group max-w-[85%] rounded-3xl p-5 shadow-card leading-relaxed transition-all ${
                m.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium rounded-tr-sm'
                  : 'bg-white border border-slate-200/80 text-slate-900 rounded-tl-sm'
              }`}
            >
              {m.sender === 'assistant' ? (
                <div>
                  {renderFormattedMarkdown(m.text)}

                  {/* Rich Contextual Actions if present */}
                  {m.actionType === 'RISK_REPORT' && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onNavigateTab('risk-analytics')}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        <span>Open Interactive Risk Sliders</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {m.actionType === 'SLA_REPORT' && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onNavigateTab('complaints')}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <ClipboardList className="w-3.5 h-3.5" />
                        <span>View Ticket Registry</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {m.actionType === 'DRAFT_NOTICE' && (
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => onNavigateTab('notices')}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Publish to Society Bulletin Board</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-sm">{m.text}</span>
              )}

              {/* Copy button */}
              {m.sender === 'assistant' && (
                <button
                  onClick={() => handleCopy(m.text, m.id)}
                  className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-slate-700 rounded-xl bg-slate-50 border border-slate-100 opacity-0 group-hover:opacity-100 transition-all"
                  title="Copy message"
                >
                  {copiedId === m.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              )}
            </div>

            {m.sender === 'user' && (
              <div className="w-8 h-8 rounded-2xl bg-slate-900 text-white flex items-center justify-center flex-shrink-0 shadow-md mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3 p-4 bg-white border border-slate-200/80 rounded-3xl w-fit shadow-card">
            <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-xs font-semibold text-slate-500">
              Querying database risk engine & aggregating metrics...
            </span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div className="py-2 flex items-center gap-2 overflow-x-auto no-scrollbar">
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s.prompt)}
            disabled={loading}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200/80 hover:border-blue-400 text-slate-700 hover:text-blue-700 text-xs font-bold rounded-full shadow-2xs whitespace-nowrap transition-all duration-150 active:scale-95"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="relative mt-1"
      >
        <div className="relative flex items-center bg-white border border-slate-200/80 focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 rounded-3xl shadow-card p-1.5 transition-all">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI Copilot (e.g. 'Analyze top risk units', 'Show SLA breaches', 'Draft notice')..."
            className="flex-1 pl-4 pr-12 py-3 bg-transparent text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-30 text-white rounded-2xl shadow-md shadow-blue-500/20 transition-all active:scale-95 flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
