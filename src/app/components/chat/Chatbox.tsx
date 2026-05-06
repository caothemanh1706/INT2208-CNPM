import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Send, User, Loader2, MessageSquare } from 'lucide-react';
import { auth } from '../../../lib/auth';
import { useTheme } from '../../contexts/ThemeContext';
import { useLanguage } from '../../contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: string;
}

export function Chatbox() {
  const { c, isDark } = useTheme();
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Localization strings
  const tTitle = language === 'en' ? 'AI Financial Assistant' : language === 'zh' ? 'AI 财务助手' : 'Trợ lý tài chính AI';
  const tPlaceholder = language === 'en' ? 'Ask me anything...' : language === 'zh' ? '问我任何问题...' : 'Hỏi tôi bất cứ điều gì...';
  const tTyping = language === 'en' ? 'Replying...' : language === 'zh' ? '正在回复...' : 'Đang trả lời...';
  const tInitial = language === 'en' 
    ? 'Hello! I am your AI financial assistant. How can I help you today?' 
    : language === 'zh'
    ? '您好！我是您的 AI 财务助手。今天有什么我可以帮您的吗？'
    : 'Xin chào! Tôi là Trợ lý tài chính ảo của bạn. Bạn cần tôi giúp gì?';

  // Load initial greeting based on selected language
  useEffect(() => {
    setMessages([
      {
        id: '1',
        text: tInitial,
        sender: 'bot',
        timestamp: new Date().toISOString()
      }
    ]);
  }, [language]);

  // Drag and Resize States
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: 360, height: 480 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<'both' | 'width' | 'height' | null>(null);

  const dragStart = useRef({ x: 0, y: 0 });
  const dragPosStart = useRef({ x: 0, y: 0 });
  const resizeStart = useRef({ x: 0, y: 0 });
  const resizeSizeStart = useRef({ width: 0, height: 0 });

  const handleDragStart = (e: React.MouseEvent) => {
    // Avoid dragging if clicking buttons/inputs
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
    if (e.button !== 0) return; // Only drag with left click
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    dragPosStart.current = { ...position };
    e.preventDefault();
  };

  const handleResizeStart = (type: 'both' | 'width' | 'height') => (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsResizing(true);
    setResizeType(type);
    resizeStart.current = { x: e.clientX, y: e.clientY };
    resizeSizeStart.current = { ...size };
    e.preventDefault();
    e.stopPropagation(); // Avoid triggering header drag
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;
        setPosition({
          x: dragPosStart.current.x + dx,
          y: dragPosStart.current.y + dy
        });
      }

      if (isResizing && resizeType) {
        const dx = resizeStart.current.x - e.clientX; // moving left increases width
        const dy = resizeStart.current.y - e.clientY; // moving up increases height
        
        setSize(prev => ({
          width: (resizeType === 'both' || resizeType === 'width') 
            ? Math.max(280, Math.min(800, resizeSizeStart.current.width + dx)) 
            : prev.width,
          height: (resizeType === 'both' || resizeType === 'height') 
            ? Math.max(320, Math.min(800, resizeSizeStart.current.height + dy)) 
            : prev.height
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeType(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, isResizing, resizeType]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await auth.fetch('/assistant', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage.text })
      });

      if (!response.ok) {
        let errorMsg = 'Network response was not ok';
        try {
          const errData = await response.json();
          if (errData && errData.error) errorMsg = errData.error;
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'bot',
        timestamp: data.timestamp || new Date().toISOString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error: any) {
      console.error("Chat error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: language === 'en' 
          ? `Error: ${error.message || 'Unknown error occurred.'}`
          : language === 'zh'
          ? `错误: ${error.message || '发生未知错误。'}`
          : `Lỗi: ${error.message || 'Không thể kết nối với máy chủ.'}`,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Safe client-side check for Portal
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const chatWindow = isOpen && (
    <div 
      style={{
        width: `${size.width}px`,
        height: `${size.height}px`,
        maxHeight: 'calc(100vh - 140px)',
        transform: `translate(${position.x}px, ${position.y}px)`,
        backgroundColor: c.card,
        borderColor: c.cardBorder,
        boxShadow: isDark ? '0 20px 45px rgba(0,0,0,0.45)' : '0 20px 45px rgba(0,0,0,0.18)',
      }}
      className="fixed bottom-24 right-8 z-[9999] rounded-2xl border overflow-hidden flex flex-col transition-shadow duration-300"
    >
      {/* Left Edge Resizer (Width only) */}
      <div 
        onMouseDown={handleResizeStart('width')}
        className="absolute top-0 left-0 bottom-0 w-2 cursor-w-resize z-40 transition-colors"
        style={{ hover: { backgroundColor: `${c.green}10` } } as any}
        title="Kéo sang trái để thay đổi chiều rộng"
      />

      {/* Top Edge Resizer (Height only) */}
      <div 
        onMouseDown={handleResizeStart('height')}
        className="absolute top-0 left-0 right-0 h-2 cursor-n-resize z-40 transition-colors"
        style={{ hover: { backgroundColor: `${c.green}10` } } as any}
        title="Kéo lên trên để thay đổi chiều cao"
      />

      {/* Top-Left Corner Resizer (Both) */}
      <div 
        onMouseDown={handleResizeStart('both')}
        className="absolute top-0 left-0 w-5 h-5 cursor-nw-resize z-50 flex items-center justify-center group"
        title="Kéo để đổi cả chiều rộng và chiều cao"
      >
        <div 
          className="absolute top-1.5 left-1.5 w-3.5 h-3.5 border-t-2 border-l-2 rounded-tl transition-colors" 
          style={{ borderColor: c.textMuted }}
        />
      </div>

      {/* Header (Draggable) */}
      <div 
        onMouseDown={handleDragStart}
        style={{ background: `linear-gradient(135deg, ${c.green} 0%, #00A87A 100%)` }}
        className="p-4 flex justify-between items-center text-white flex-shrink-0 cursor-grab active:cursor-grabbing select-none"
      >
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="animate-pulse" />
          <h3 style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }} className="font-bold text-sm tracking-wide">
            {tTitle}
          </h3>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          onMouseDown={(e) => e.stopPropagation()}
          className="text-white/85 hover:text-white hover:scale-110 transition-all cursor-pointer p-1 rounded-lg hover:bg-white/10"
        >
          <X size={16} />
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        style={{ backgroundColor: c.bg }}
        className="flex-1 p-4 overflow-y-auto flex flex-col gap-4"
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-2.5 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
          >
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px]"
              style={{ backgroundColor: msg.sender === 'user' ? c.green : '#3B82F6' }}
            >
              {msg.sender === 'user' ? <User size={12} /> : <Sparkles size={12} />}
            </div>
            <div 
              style={{
                backgroundColor: msg.sender === 'user' ? c.green : c.card,
                borderColor: msg.sender === 'user' ? 'transparent' : c.cardBorder,
                color: msg.sender === 'user' ? 'white' : c.text
              }}
              className={`py-2.5 px-3.5 rounded-2xl text-[12px] shadow-sm leading-relaxed whitespace-pre-line border ${
                msg.sender === 'user' 
                  ? 'rounded-tr-none' 
                  : 'rounded-tl-none'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-2.5 max-w-[85%] self-start">
            <div 
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-[10px] bg-blue-500"
            >
              <Sparkles size={12} />
            </div>
            <div 
              style={{
                backgroundColor: c.card,
                borderColor: c.cardBorder,
                color: c.textMuted
              }}
              className="py-2.5 px-3.5 rounded-2xl text-[12px] shadow-sm rounded-tl-none border flex items-center gap-2"
            >
              <Loader2 size={12} className="animate-spin text-blue-500" />
              <span>{tTyping}</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div 
        style={{ backgroundColor: c.card, borderTop: `1px solid ${c.cardBorder}` }}
        className="p-3 flex items-center gap-2 flex-shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tPlaceholder}
          style={{ backgroundColor: c.input, border: `1px solid ${c.inputBorder}`, color: c.text }}
          className="flex-1 px-4 py-2.5 rounded-full text-[12px] focus:outline-none transition-all duration-200"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          style={{ backgroundColor: c.green }}
          className="p-2.5 rounded-full text-white hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center justify-center shadow-md"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {mounted && chatWindow ? createPortal(chatWindow, document.body) : null}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          backgroundColor: c.green, 
          boxShadow: '0 8px 24px rgba(0,200,150,0.35)',
          bottom: '100px' // perfectly offsets above the '+' FAB at bottom-8 (32px)
        }}
        className={`fixed right-8 w-14 h-14 rounded-full text-white flex items-center justify-center hover:scale-110 transition-all duration-300 z-50 cursor-pointer ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 pointer-events-auto'
        }`}
        aria-label="Open financial assistant"
      >
        <MessageSquare size={22} color="white" />
      </button>
    </>
  );
}
