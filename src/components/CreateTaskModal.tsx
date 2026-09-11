import React, { useState } from 'react';
import { X, Send, Flag, Calendar, Hash, Paperclip, Layout } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RichEditor from './Editor/RichEditor';
import { Priority } from '../types';
import { cn } from '../lib/utils';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function CreateTaskModal({ isOpen, onClose, onSubmit }: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px]">
      <div className="bg-[#C0C0C0] bevel-outset w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Win95 Title Bar */}
        <div className="win-title-bar">
          <div className="flex items-center gap-2">
            <Layout className="w-3 h-3 text-white" />
            <span>TASK_ENTRY_WIZARD.EXE</span>
          </div>
          <div className="flex gap-1">
            <button className="w-4 h-4 bevel-outset bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center">-</button>
            <button className="w-4 h-4 bevel-outset bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center">□</button>
            <button onClick={onClose} className="w-4 h-4 bevel-outset bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center hover:bg-secondary hover:text-white">x</button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-2 py-1 flex gap-2 border-b-2 border-muted bg-[#C0C0C0]">
           <button className="px-2 py-0.5 font-heading text-[10px] hover:bg-[#d0d0d0] active:bevel-inset">File</button>
           <button className="px-2 py-0.5 font-heading text-[10px] hover:bg-[#d0d0d0] active:bevel-inset">Edit</button>
           <button className="px-2 py-0.5 font-heading text-[10px] hover:bg-[#d0d0d0] active:bevel-inset">Help</button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-[#C0C0C0] scrollbar-hide">
          <div className="bevel-inset bg-white p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <label className="font-heading text-[10px] text-win-navy uppercase tracking-widest">Entry_Point: Subject</label>
              <input 
                autoFocus
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="DEFINE_NEW_RECORD..."
                className="bevel-inset bg-white px-4 py-2 font-bold focus:ring-2 focus:ring-accent outline-none placeholder:text-muted/30 uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-heading text-[10px] text-win-navy uppercase tracking-widest">Priority_Level</label>
                <div className="grid grid-cols-2 gap-1">
                  {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={cn(
                        "py-2 font-heading text-[9px] uppercase tracking-tighter",
                        priority === p 
                          ? "bg-win-navy text-white bevel-inset" 
                          : "bg-[#C0C0C0] bevel-outset hover:bg-[#d0d0d0]"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1">
                  <label className="font-heading text-[10px] text-win-navy uppercase tracking-widest">Date_Start</label>
                  <input 
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bevel-inset bg-white px-2 py-1 font-mono text-[10px] focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-heading text-[10px] text-win-navy uppercase tracking-widest">Date_Finish</label>
                  <input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bevel-inset bg-white px-2 py-1 font-mono text-[10px] focus:ring-2 focus:ring-accent outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-heading text-[10px] text-win-navy uppercase tracking-widest">Description_Blob</label>
              <div className="bevel-inset bg-[#f9f9f9] p-2">
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Input technical documentation here..."
                  className="w-full bg-transparent border-none text-xs focus:ring-0 outline-none resize-none font-primary"
                />
              </div>
            </div>

            <div className="bg-construction h-1 bevel-inset" />

            <div className="flex items-center gap-4 p-4 bevel-inset bg-[#E8E8E8]/50 border-2 border-dashed border-muted">
              <Paperclip size={24} className="text-muted" />
              <div className="flex-1">
                <p className="font-heading text-[10px] uppercase tracking-widest">Attach_Binary_Assets</p>
                <p className="font-mono text-[8px] opacity-40">DISK_STORAGE: PDF, DWG, BIN</p>
              </div>
              <button className="bg-[#C0C0C0] bevel-outset px-4 py-1 font-heading text-[9px] uppercase hover:bg-[#d0d0d0]">BROWSE</button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#C0C0C0] border-t-2 border-muted flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bevel-outset bg-[#C0C0C0] font-heading text-[10px] uppercase hover:bg-[#d0d0d0] active:bevel-inset">Cancel</button>
          <button 
            disabled={!title}
            onClick={() => onSubmit({ title, description, priority, startDate, dueDate })}
            className="px-10 py-2 bevel-outset bg-win-navy text-white font-heading text-[10px] uppercase hover:bg-[#0000a0] active:bevel-inset disabled:opacity-30"
          >
            Commit_Record
          </button>
        </div>
      </div>
    </div>
  );
}

const ChevronDown = ({ className }: { className?: string }) => (
  <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);
