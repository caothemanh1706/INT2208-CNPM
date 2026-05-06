import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import { auth } from '../../lib/auth';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: string;
}

export function Chat() {
  const { c, isDark } = useTheme();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Xin chào! Tôi là Trợ lý tài chính ảo của bạn. Hãy gửi cho tôi bất kỳ câu hỏi nào về chi tiêu, ngân sách, hoặc lời khuyên quản lý tiền bạc của bạn nhé!',
      sender: 'bot',
      timestamp: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
        text: `Lỗi: ${error.message || 'Không rõ'}. Hãy kiểm tra kết nối mạng và thử lại sau.`,
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

  const clearChat = () => {
    if (window.confirm('Bạn có muốn xóa toàn bộ lịch sử trò chuyện này không?')) {
      setMessages([
        {
          id: '1',
          text: 'Đã làm sạch lịch sử trò chuyện. Tôi là Trợ lý tài chính ảo của bạn. Hãy gửi cho tôi câu hỏi tiếp theo nhé!',
          sender: 'bot',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  };

  return (
    <div 
      className="fixed top-16 left-0 md:left-[240px] right-0 bottom-0 z-10 flex flex-col overflow-hidden select-none"
      style={{ backgroundColor: c.bg }}
    >
      {/* Top Welcome Panel */}
      <div className="flex-shrink-0 px-8 py-4 bg-gradient-to-r from-blue-600/10 via-indigo-600/5 to-transparent border-b border-gray-200/50 dark:border-gray-800/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles size={20} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
              FinWise AI Assistant
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                Live
              </span>
            </h2>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              Phân tích chi tiêu, quản lý ngân sách và tư vấn kế hoạch tiết kiệm
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <RefreshCw size={13} />
          Xóa lịch sử
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 px-8 py-6 overflow-y-auto flex flex-col gap-5 bg-gray-50/50 dark:bg-gray-950/20"
      >
        <div className="max-w-4xl mx-auto w-full flex flex-col gap-5">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-4 max-w-[85%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.sender === 'user' 
                  ? 'bg-gradient-to-tr from-blue-500 to-indigo-500 text-white' 
                  : 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-gray-100 dark:border-gray-700'
              }`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>

              {/* Text Bubble */}
              <div 
                className={`py-3 px-4 rounded-3xl text-sm leading-relaxed shadow-sm transition-all ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-none whitespace-pre-line'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 max-w-[85%] self-start">
              <div className="w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 border border-gray-100 dark:border-gray-700">
                <Bot size={16} />
              </div>
              <div className="py-3 px-4 rounded-3xl text-sm shadow-sm bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-tl-none flex items-center gap-2 text-gray-500">
                <Loader2 size={14} className="animate-spin text-indigo-600" />
                <span>FinWise đang phân tích dữ liệu tài chính của bạn...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input Action Panel (Full width, responsive) */}
      <div 
        className="flex-shrink-0 px-8 py-5 border-t border-gray-200/60 dark:border-gray-800/60"
        style={{ backgroundColor: c.bg }}
      >
        <div className="max-w-4xl mx-auto w-full flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Đặt câu hỏi, e.g., 'Phân tích chi tiêu của tôi tháng này', 'Tôi có nên mua ip17 không?'..."
            className="flex-1 px-5 py-3.5 bg-gray-100 dark:bg-gray-800 dark:text-white rounded-2xl text-sm border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-inner transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="px-5 py-3.5 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <span className="hidden sm:inline text-sm font-semibold">Gửi tin</span>
            <Send size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
