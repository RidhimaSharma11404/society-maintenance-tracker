import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { renderFormattedMarkdown } from '../../utils/formatMarkdown';
import {
  Send,
  X,
  Bot,
  User,
  Copy,
  Check,
  RefreshCw,
  Flame,
  AlertTriangle,
  FileText
} from 'lucide-react';

const QUICK_PROMPTS = [
  { label: 'High-Risk Analysis', prompt: 'Analyze top recurring risk units and recommend preventative actions', icon: Flame },
  { label: 'SLA Overdue Summary', prompt: 'Show all overdue SLA tickets and required escalations', icon: AlertTriangle },
  { label: 'Draft Resident Circular', prompt: 'Draft a maintenance circular for common plumbing riser inspection', icon: FileText }
];

export const AssistantDrawer = ({ isOpen, onClose }) => {
  const { success } = useToast();
  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: '### Quick AI Help Desk\n\nI am your instant society assistant for quick queries, complaint status lookups, and facility guidelines.\n\nFor deep telemetry analytics, predictive risk simulations, and notice drafting, visit the full-page **AI Operations Hub** from the sidebar.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (userPrompt) => {
    const query = userPrompt || input;
    if (!query.trim() || loading) return;

    const newMessages = [...messages, { sender: 'user', text: query }];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await api.post('/assistant/chat', { prompt: query });
      setMessages([...newMessages, { sender: 'assistant', text: res.data?.reply || 'Analysis completed.' }]);
    } catch (err) {
      setMessages([
        ...newMessages,
        { sender: 'assistant', text: `⚠️ Unable to process query: ${err.message}` }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    success('Copied to clipboard.');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl flex flex-col justify-between text-slate-800 animate-fade-in">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-600 text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  Quick AI Help Desk
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">Instant Unit Guidance & Help Queries</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Prompts */}
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((qp, idx) => {
              const Icon = qp.icon;
              return (
                <button
                  key={idx}
                  onClick={() => handleSend(qp.prompt)}
                  disabled={loading}
                  className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 hover:border-blue-700 text-[11px] font-bold text-blue-900 hover:bg-blue-50 flex items-center gap-1 shadow-xs transition-all"
                >
                  <Icon className="w-3 h-3 text-blue-700" />
                  <span>{qp.label}</span>
                </button>
              );
            })}
          </div>

          {/* Chat Messages with Formatted Markdown Rendering */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div
                  className={`relative group max-w-[88%] rounded-xl p-3.5 shadow-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-700 text-white font-semibold'
                      : 'bg-white border border-blue-100 text-slate-900'
                  }`}
                >
                  {m.sender === 'assistant' ? (
                    renderFormattedMarkdown(m.text)
                  ) : (
                    <span>{m.text}</span>
                  )}

                  {m.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(m.text, idx)}
                      className="absolute top-2 right-2 p-1 text-slate-400 hover:text-blue-900 rounded bg-white/90 border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Copy response"
                    >
                      {copiedIndex === idx ? (
                        <Check className="w-3 h-3 text-emerald-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  )}
                </div>

                {m.sender === 'user' && (
                  <div className="w-6 h-6 rounded-full bg-slate-800 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-blue-900 font-medium italic p-2 bg-blue-50/50 rounded-lg">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-700" />
                <span>Copilot is analyzing real-time telemetry...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-200 bg-white"
          >
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about defect trends, overdue tickets, or drafting..."
                className="w-full pl-3 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-700 focus:bg-white transition-colors"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 bg-blue-700 disabled:opacity-40 hover:bg-blue-800 text-white rounded-md transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
