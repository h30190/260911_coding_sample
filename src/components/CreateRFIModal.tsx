import React, { useState } from 'react';
import { X, Send, Flag, Calendar, Hash, Paperclip, MessageCircleQuestion, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import RichEditor from './Editor/RichEditor';
import { Priority } from '../types';
import { cn } from '../lib/utils';

interface CreateRFIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export default function CreateRFIModal({ isOpen, onClose, onSubmit }: CreateRFIModalProps) {
  const [title, setTitle] = useState('');
  const [question, setQuestion] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [impact, setImpact] = useState({ schedule: false, cost: false, quality: false });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[1px]">
      <div className="bg-[#C0C0C0] bevel-outset w-full max-w-2xl flex flex-col max-h-[90vh]">
        {/* Win95 Title Bar */}
        <div className="win-title-bar">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-3 h-3 text-white" />
            <span>RFI_CLARIFICATION_WIZARD.EXE</span>
          </div>
          <div className="flex gap-1">
            <button className="w-4 h-4 bevel-outset bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center">-</button>
            <button className="w-4 h-4 bevel-outset bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center">□</button>
            <button onClick={onClose} className="w-4 h-4 bevel-outset bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center hover:bg-secondary hover:text-white">x</button>
          </div>
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
                placeholder="STATE_THE_CONFLICT..."
                className="bevel-inset bg-white px-4 py-2 font-bold focus:ring-2 focus:ring-accent outline-none placeholder:text-muted/30 uppercase"
              />
            </div>

            <div className="grid grid-cols-2 gap-8">
               <div className="flex flex-col gap-3">
                  <label className="font-heading text-[10px] text-win-navy uppercase tracking-widest">Impact_Vector</label>
                  <div className="flex flex-col gap-2">
                    {(['schedule', 'cost', 'quality'] as const).map((key) => (
                      <div
                        key={key}
                        onClick={() => setImpact(prev => ({ ...prev, [key]: !prev[key] }))}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div className={cn(
                          "w-4 h-4 bevel-inset bg-white flex items-center justify-center",
                          impact[key] ? "before:content-['✓'] before:text-[10px] before:font-bold" : ""
                        )} />
                        <span className="font-heading text-[10px] uppercase group-hover:text-win-navy">{key}</span>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="flex flex-col gap-3">
                  <label className="font-heading text-[10px] text-win-navy uppercase tracking-widest">Criticality</label>
                  <div className="flex flex-col gap-1">
                     {(['LOW', 'MEDIUM', 'HIGH', 'URGENT'] as Priority[]).map((p) => (
                       <div 
                         key={p} 
                         onClick={() => setPriority(p)}
                         className="flex items-center gap-3 cursor-pointer group"
                       >
                         <div className={cn(
                           "w-4 h-4 rounded-full border-2 border-muted bg-white flex items-center justify-center",
                           priority === p ? "before:content-[''] before:w-2 before:h-2 before:rounded-full before:bg-black" : ""
                         )} />
                         <span className="font-heading text-[10px] uppercase group-hover:text-win-navy">{p}</span>
                       </div>
                     ))}
                  </div>
               </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="font-heading text-[10px] text-win-navy uppercase tracking-widest">Technical_Statement</label>
              <div className="bevel-inset bg-[#f9f9f9] p-2">
                <textarea 
                  rows={6}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Insert technical evidence here..."
                  className="w-full bg-transparent border-none text-xs focus:ring-0 outline-none resize-none font-primary"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-[#C0C0C0] border-t-2 border-muted flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-6 py-2 bevel-outset bg-[#C0C0C0] font-heading text-[10px] uppercase hover:bg-[#d0d0d0] active:bevel-inset">Save_Draft</button>
          <button 
            disabled={!title || !question}
            onClick={() => onSubmit({ title, question, priority, impact })}
            className="px-10 py-2 bevel-outset bg-win-navy text-white font-heading text-[10px] uppercase hover:bg-[#0000a0] active:bevel-inset disabled:opacity-30"
          >
            Submit_RFI
          </button>
        </div>
      </div>
    </div>
  );
}
