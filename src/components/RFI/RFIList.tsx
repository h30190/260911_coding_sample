import React from 'react';
import { useStore } from '../../store/useStore';
import { Search, Filter, Plus, Clock, AlertTriangle, CheckCircle2, ChevronRight, MessageSquare, ClipboardList } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { RFIStatus } from '../../types';

const StatusBadge = ({ status }: { status: RFIStatus }) => {
  const labels = {
    DRAFT: 'DRAFT_01',
    SUBMITTED: 'SUBMIT_OK',
    UNDER_REVIEW: 'REVIEW_ING',
    ANSWERED: 'REPLY_RCVD',
    CLOSED: 'SYS_CLOSED',
  };

  const colors = {
    DRAFT: 'bg-[#C0C0C0]',
    SUBMITTED: 'bg-win-blue text-white',
    UNDER_REVIEW: 'bg-tertiary text-black',
    ANSWERED: 'bg-success text-black',
    CLOSED: 'bg-muted text-white',
  };

  return (
    <span className={cn(
      "font-heading text-[9px] uppercase tracking-widest px-2 py-0.5 bevel-outset",
      colors[status]
    )}>
      {labels[status]}
    </span>
  );
};

export default function RFIList() {
  const { rfis } = useStore();

  const displayRfis = rfis.length > 0 ? rfis : [
    {
      id: 'r1',
      rfiCode: 'RFI-2026-001',
      title: '結構鋼規格澄清',
      question: '目前的圖面顯示樑採用 ASTM A36，但明細表指定為 A992。',
      status: 'UNDER_REVIEW' as RFIStatus,
      priority: 'HIGH',
      createdAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    },
    {
      id: 'r2',
      rfiCode: 'RFI-2026-002',
      title: 'HVAC 風管空間淨空問題',
      question: 'Zone B 區域的風管與天花板骨架間的淨空高度不足。',
      status: 'ANSWERED' as RFIStatus,
      priority: 'URGENT',
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      dueDate: new Date(Date.now() + 86400000).toISOString(),
    }
  ];

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="bevel-outset bg-[#C0C0C0] p-6 flex flex-col gap-4">
        <h2 className="text-4xl text-win-navy">Inquiry_Database_v2.0</h2>
        <div className="flex items-center justify-between">
           <p className="font-mono text-xs text-muted max-w-2xl leading-relaxed">Systematic logging of technical clarifications. All entries are archived in the global master record. Please verify priority levels before submission.</p>
           <button className="bg-[#C0C0C0] bevel-outset px-8 py-3 font-heading text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#d0d0d0] active:bevel-inset">
             <Filter size={14} strokeWidth={2} />
             <span>Filter_Archives</span>
           </button>
        </div>
      </div>

      <div className="bevel-inset bg-white overflow-hidden flex flex-col flex-1">
        <div className="overflow-auto flex-1 scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead className="sticky top-0 z-20 bg-[#E8E8E8] border-b-2 border-muted shadow-[0_2px_0_#808080]">
              <tr>
                <th className="px-6 py-4 font-heading text-[10px] uppercase tracking-widest border-r-2 border-muted">Record_Code & Topic</th>
                <th className="px-6 py-4 font-heading text-[10px] uppercase tracking-widest border-r-2 border-muted">Status_Flag</th>
                <th className="px-6 py-4 font-heading text-[10px] uppercase tracking-widest border-r-2 border-muted">Impact_Tags</th>
                <th className="px-6 py-4 font-heading text-[10px] uppercase tracking-widest">Target_Date</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-[#E8E8E8]">
              {displayRfis.map((rfi, idx) => (
                <tr key={rfi.id} className={cn(
                  "hover:bg-win-yellow/20 cursor-pointer group transition-none",
                  idx % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"
                )}>
                  <td className="px-6 py-6 border-r-2 border-[#E8E8E8]">
                    <div className="flex flex-col gap-1">
                      <span className="font-mono text-[9px] font-bold text-muted uppercase">[{rfi.rfiCode}]</span>
                      <span className="font-heading text-sm text-win-navy underline hover:text-secondary">{rfi.title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 border-r-2 border-[#E8E8E8]">
                    <StatusBadge status={rfi.status} />
                  </td>
                  <td className="px-6 py-6 border-r-2 border-[#E8E8E8]">
                    <div className="flex gap-2">
                       <span className="font-mono text-[8px] font-bold bg-[#E8E8E8] px-2 py-0.5 bevel-outset">SCHEDULE</span>
                       <span className="font-mono text-[8px] font-bold bg-[#E8E8E8] px-2 py-0.5 bevel-outset">COST_LVL_1</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 font-mono text-[10px] font-bold text-secondary">
                        <Clock size={12} strokeWidth={2} />
                        <span>DUE_{format(new Date(rfi.dueDate), 'MM-dd-yy')}</span>
                      </div>
                      <span className="text-[9px] font-bold opacity-30 italic">LOGGED_BY: ADMIN_ALEX</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-[#C0C0C0] border-t-2 border-muted px-6 py-3 flex items-center justify-between">
          <span className="font-mono text-[9px] font-bold uppercase">System_Total: {displayRfis.length} Records_Found</span>
          <div className="flex gap-1">
            <button className="px-4 py-1 bg-[#C0C0C0] bevel-outset font-heading text-[8px] uppercase tracking-widest hover:bg-[#d0d0d0] active:bevel-inset disabled:opacity-30">Previous</button>
            <button className="px-4 py-1 bg-[#C0C0C0] bevel-outset font-heading text-[8px] uppercase tracking-widest hover:bg-[#d0d0d0] active:bevel-inset disabled:opacity-30">Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
