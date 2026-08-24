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
    const newMessages = [
      ...messages,
      { id: userMsgId, sender: 'user', text: query }
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      // Simulate intelligent operations AI response
      setTimeout(() => {
        let reply = '';
        if (query.toLowerCase().includes('risk') || query.toLowerCase().includes('unit')) {
          reply = `### ⚡ Facility Risk & Cluster Analysis\n\nBased on the **Exponential Half-Life Decay Engine (t½ = 30d)**:\n\n1. **Tower B - 101**: Critical Risk Score **4.2 pts** (3 recurring plumbing tickets in 45 days). Probable root cause: *Main riser pressure surge failure*.\n2. **Passenger Lift B2**: High Alert **3.8 pts** (2 motor vibration reports). Contractor *Otis AMC* dispatched.\n3. **Tower A - 402**: Elevated **2.9 pts** (Seepage near pipe shaft).\n\n**Recommended Next Step:** Issue preventative work order for Tower B plumbing riser inspection.`;
        } else if (query.toLowerCase().includes('overdue') || query.toLowerCase().includes('sla')) {
          reply = `### 📋 Overdue SLA Audit\n\nCurrently, **1 ticket is breaching configured SLA limits**:\n\n* **#CMP-004**: *Lift B2 intermittent power fault* — Overdue by **6 hours** (24h SLA breached).\n* Status: \`In Progress\` · Assigned to: *Technician Marcus Cole*\n\n**Action Triggered:** Automated notification queued in Transactional Outbox for executive escalation.`;
        } else if (query.toLowerCase().includes('draft') || query.toLowerCase().includes('notice')) {
          reply = `### 📢 Draft Notice: Plumbing Maintenance Circular\n\n**Title:** Scheduled Plumbing Riser Inspection - Tower B\n\n**Dear Residents of Tower B,**\n\nPlease be informed that preventative maintenance and valve replacement on the main water supply riser will take place on **Wednesday, August 26 from 10:00 AM to 2:00 PM**.\n\nWater supply may experience temporary low pressure during this window. We apologize for any inconvenience.\n\n*— Facility Management Office*`;
        } else {
          reply = `### Operations Telemetry Intelligence\n\nCampus operations are running at **99.4% equipment uptime** with 24 monitored flats. 3 active maintenance work orders are currently tracked across Towers A & B.\n\nFeel free to ask me to analyze defects, check SLA statuses, or draft society notices!`;
        }

        setMessages([
          ...newMessages,
          { id: 'a-' + Date.now(), sender: 'assistant', text: reply }
        ]);
        setLoading(false);
      }, 700);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success('Copied to clipboard');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 pb-16 font-sans text-slate-100 max-w-4xl mx-auto">
      {/* Header Card */}
      <div className="p-6 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_16px_rgba(6,182,212,0.4)]">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-sans flex items-center gap-2">
              AI Operations Copilot
              <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border border-cyan-500/30 text-cyan-300 bg-cyan-950/60">
                PRO
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Interactive facility intelligence powered by live telemetry and defect math.
            </p>
          </div>
        </div>
      </div>

      {/* Suggestion Chips (CareSync AI Style) */}
      <div className="flex items-center gap-2 flex-wrap text-xs">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mr-1">SUGGESTED PROMPTS:</span>
        {SUGGESTIONS.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(s.prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-semibold transition-all cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="p-6 bg-[#0B1220]/90 border border-slate-800 rounded-3xl backdrop-blur-xl shadow-xl min-h-[420px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0 mt-1 shadow-sm">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`p-4 rounded-2xl text-xs max-w-xl leading-relaxed relative group ${
                  isUser
                    ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)] rounded-br-none'
                    : 'bg-slate-950/80 border border-slate-800/90 text-slate-200 rounded-bl-none shadow-md'
                }`}
              >
                <div className="prose prose-invert prose-xs max-w-none space-y-2">
                  {renderFormattedMarkdown(m.text)}
                </div>

                {!isUser && (
                  <button
                    onClick={() => handleCopy(m.text, m.id)}
                    className="absolute top-2.5 right-2.5 p-1 rounded-lg bg-slate-900/80 text-slate-400 hover:text-white transition-opacity opacity-0 group-hover:opacity-100"
                    title="Copy response"
                  >
                    {copiedId === m.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center shrink-0 mt-1 font-bold text-xs">
                  {user?.name ? user.name[0] : 'U'}
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex gap-3 justify-start items-center">
            <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs text-cyan-300 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
              <span>Analyzing facility telemetry...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Prompt Box */}
      <div className="p-2 bg-[#0B1220]/90 border border-slate-800 rounded-2xl backdrop-blur-xl shadow-xl flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask Copilot about building telemetry, recurring faults, SLA breaches, or draft a circular..."
          className="flex-1 px-4 py-2.5 bg-slate-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading || !input.trim()}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(37,99,235,0.4)] flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </div>
    </div>
  );
};
