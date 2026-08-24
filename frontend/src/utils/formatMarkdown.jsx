import React from 'react';

/**
 * Renders Markdown-like text into bold HTML elements without raw symbols like ### or **.
 */
export const renderFormattedMarkdown = (rawText = '') => {
  if (!rawText) return null;

  const lines = rawText.split('\n');

  return (
    <div className="space-y-2 text-xs text-slate-800 leading-relaxed font-sans">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();

        // Empty line
        if (!trimmed) {
          return <div key={lineIdx} className="h-1.5" />;
        }

        // Heading 3: ### Heading
        if (trimmed.startsWith('### ')) {
          const headingText = trimmed.replace(/^###\s+/, '');
          return (
            <h4
              key={lineIdx}
              className="text-sm font-bold text-blue-900 font-serif border-b border-blue-100 pb-1 mt-2 mb-1"
            >
              {parseBoldInline(headingText)}
            </h4>
          );
        }

        // Heading 2: ## Heading
        if (trimmed.startsWith('## ')) {
          const headingText = trimmed.replace(/^##\s+/, '');
          return (
            <h3
              key={lineIdx}
              className="text-sm font-extrabold text-blue-950 font-serif mt-2 mb-1"
            >
              {parseBoldInline(headingText)}
            </h3>
          );
        }

        // Bullet point: • or - or *
        if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^[•\-\*]\s+/, '');
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1.5 text-xs text-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-700 mt-1.5 flex-shrink-0" />
              <div className="flex-1">{parseBoldInline(bulletText)}</div>
            </div>
          );
        }

        // Numbered list: 1. 2.
        const numMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numMatch) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-1.5 text-xs text-slate-700">
              <span className="font-bold text-blue-900 font-mono text-[11px] mt-0.5">
                {numMatch[1]}.
              </span>
              <div className="flex-1">{parseBoldInline(numMatch[2])}</div>
            </div>
          );
        }

        // Standard paragraph line
        return (
          <p key={lineIdx} className="text-xs text-slate-800">
            {parseBoldInline(line)}
          </p>
        );
      })}
    </div>
  );
};

/**
 * Parses inline **bold text** segments cleanly into <strong className="font-bold text-slate-950">
 */
const parseBoldInline = (text) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      const boldContent = part.slice(2, -2);
      return (
        <strong key={idx} className="font-bold text-slate-950">
          {boldContent}
        </strong>
      );
    }
    return part;
  });
};
