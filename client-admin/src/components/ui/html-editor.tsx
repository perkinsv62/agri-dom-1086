import React from 'react';
import { Textarea } from './textarea';
import { cn } from '@/lib/utils';

interface HtmlEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
  error?: boolean;
}

const HtmlEditor: React.FC<HtmlEditorProps> = ({
  value,
  onChange,
  placeholder = "Nhập HTML code...",
  rows = 15,
  className,
  error = false
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Add auto-indentation for HTML tags
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      // Insert tab character
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Move cursor to correct position
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
    }
    
    // Auto-close HTML tags
    if (e.key === 'Enter') {
      const textarea = e.target as HTMLTextAreaElement;
      const start = textarea.selectionStart;
      const beforeCursor = value.substring(0, start);
      const afterCursor = value.substring(start);
      
      // Check if we're inside a tag that needs closing
      const openTagMatch = beforeCursor.match(/<(\w+)[^>]*>$/);
      if (openTagMatch && !beforeCursor.includes(`</${openTagMatch[1]}>`)) {
        const tagName = openTagMatch[1];
        e.preventDefault();
        
        const newValue = beforeCursor + '\n  \n' + afterCursor;
        onChange(newValue);
        
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 3;
        }, 0);
      }
    }
  };

  return (
    <div className="relative">
      <Textarea
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        className={cn(
          "html-editor resize-none pl-14",
          error && "border-destructive",
          className
        )}
        spellCheck={false}
      />
      
      {/* Line numbers */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-muted/30 border-r border-border pointer-events-none rounded-l-md">
        <div className="p-3 text-xs text-muted-foreground font-mono leading-6">
          {Array.from({ length: Math.max(1, value.split('\n').length) }, (_, i) => (
            <div key={i + 1} className="text-right pr-2">
              {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HtmlEditor;