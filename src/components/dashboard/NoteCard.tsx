import { useState, useEffect, useRef } from 'react';
import { Card } from '../ui/Card';
import { api } from '../../lib/api';
import { FilePlus, Edit3, Trash2, Check, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export function NoteCard() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchNotes = async () => {
    try {
      const data = await api.getNotes();
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if ((isEditing || isAdding) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing, isAdding]);

  const handleAddClick = () => {
    setIsAdding(true);
    setIsEditing(false);
    setSelectedId(null);
    setInputValue('');
  };

  const handleEditClick = () => {
    if (!selectedId) return alert('Vui lòng chọn một ghi chú để sửa');
    const note = notes.find(n => n.id === selectedId);
    if (note) {
      setInputValue(note.content);
      setIsEditing(true);
      setIsAdding(false);
    }
  };

  const handleDeleteClick = async () => {
    if (!selectedId) return alert('Vui lòng chọn một ghi chú để xóa');
    if (window.confirm('Bạn có chắc muốn xóa ghi chú này?')) {
      try {
        await api.deleteNote(selectedId);
        setSelectedId(null);
        fetchNotes();
      } catch (error) {
        console.error('Failed to delete note', error);
      }
    }
  };

  const handleSave = async () => {
    if (!inputValue.trim()) {
      handleCancel();
      return;
    }
    
    try {
      if (isAdding) {
        await api.createNote(inputValue.trim());
      } else if (isEditing && selectedId) {
        await api.updateNote(selectedId, inputValue.trim());
      }
      setIsAdding(false);
      setIsEditing(false);
      setInputValue('');
      fetchNotes();
    } catch (error) {
      console.error('Failed to save note', error);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') handleCancel();
  };

  return (
    <Card className="relative p-6 rounded-[20px] shadow-sm border-none mt-6 bg-white overflow-hidden min-h-[320px]">
      {/* Pushpin styling */}
      <div className="absolute -top-1 left-[60%] -translate-x-1/2 z-10 w-12 h-12 opacity-95 drop-shadow-lg">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-[#8baaf8] fill-[#8baaf8] transform rotate-45 scale-125">
          <line x1="12" y1="17" x2="12" y2="22"></line>
          <path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.68V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3v4.68a2 2 0 0 1-1.11 1.87l-1.78.9A2 2 0 0 0 5 15.24Z"></path>
        </svg>
      </div>

      {/* Lined paper effect */}
      <div 
        className="absolute inset-0 top-[70px] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(transparent 96%, #e2e8f0 96%)',
          backgroundSize: '100% 2.8rem'
        }}
      ></div>

      <div className="relative z-0 px-2">
        <div className="flex justify-between items-end border-b-2 border-red-300/60 pb-2 mb-2 pt-2">
          <h2 className="text-4xl font-bold italic text-slate-700 tracking-wide" style={{ fontFamily: '"Caveat", cursive' }}>Note!</h2>
          
          <div className="flex gap-3 mb-2 text-slate-500">
            {isAdding || isEditing ? (
              <>
                <button onClick={handleSave} className="hover:text-emerald-500 transition-colors" title="Lưu (Enter)">
                  <Check className="w-[18px] h-[18px]" />
                </button>
                <button onClick={handleCancel} className="hover:text-red-500 transition-colors" title="Hủy (Esc)">
                  <X className="w-[18px] h-[18px]" />
                </button>
              </>
            ) : (
              <>
                <button onClick={handleAddClick} className="hover:text-slate-800 transition-colors" title="Thêm ghi chú">
                  <FilePlus className="w-[18px] h-[18px]" />
                </button>
                <button onClick={handleEditClick} className={cn("transition-colors", selectedId ? "hover:text-slate-800" : "opacity-40 cursor-not-allowed")} title="Sửa ghi chú đã chọn">
                  <Edit3 className="w-[18px] h-[18px]" />
                </button>
                <button onClick={handleDeleteClick} className={cn("transition-colors", selectedId ? "hover:text-red-500" : "opacity-40 cursor-not-allowed")} title="Xóa ghi chú đã chọn">
                  <Trash2 className="w-[18px] h-[18px]" />
                </button>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-0 pt-2">
          {loading ? (
            <p className="text-[22px] text-slate-400 italic" style={{ fontFamily: '"Caveat", cursive', lineHeight: '2.8rem' }}>Đang tải...</p>
          ) : notes.length === 0 && !isAdding ? (
            <p className="text-[22px] text-slate-400 italic" style={{ fontFamily: '"Caveat", cursive', lineHeight: '2.8rem' }}>Chưa có ghi chú nào...</p>
          ) : (
            notes.map((note) => (
              <div 
                key={note.id} 
                onClick={() => !isEditing && !isAdding && setSelectedId(note.id)}
                className={cn(
                  "px-2 -mx-2 cursor-pointer transition-colors border border-transparent rounded",
                  selectedId === note.id && !isEditing ? "bg-blue-50/50 border-blue-100" : "hover:bg-slate-50/50"
                )}
              >
                {isEditing && selectedId === note.id ? (
                  <input
                    ref={inputRef}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleSave}
                    className="w-full bg-transparent text-[22px] text-blue-600 focus:outline-none"
                    style={{ fontFamily: '"Caveat", cursive', height: '2.8rem', lineHeight: '2.8rem' }}
                  />
                ) : (
                  <p className="text-[22px] text-slate-700 truncate" style={{ fontFamily: '"Caveat", cursive', height: '2.8rem', lineHeight: '2.8rem' }}>
                    {note.content}
                  </p>
                )}
              </div>
            ))
          )}

          {isAdding && (
            <div className="px-2 -mx-2 bg-blue-50/30">
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                placeholder="Nhập ghi chú mới..."
                className="w-full bg-transparent text-[22px] text-blue-600 focus:outline-none placeholder:text-slate-300"
                style={{ fontFamily: '"Caveat", cursive', height: '2.8rem', lineHeight: '2.8rem' }}
              />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
