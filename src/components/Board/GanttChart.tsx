import React, { useMemo, useState } from 'react';
import { useStore } from '../../store/useStore';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addDays, differenceInDays } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { cn } from '../../lib/utils';
import { ChevronLeft, ChevronRight, Filter, Settings2, Maximize2 } from 'lucide-react';

export default function GanttChart() {
  const { tasks } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const timelineTasks = useMemo(() => {
    return tasks.filter(t => t.startDate || t.dueDate).map(task => {
      const start = task.startDate ? new Date(task.startDate) : new Date(task.createdAt);
      const end = task.dueDate ? new Date(task.dueDate) : addDays(start, 2);
      
      return {
        ...task,
        start,
        end,
        duration: Math.max(1, differenceInDays(end, start) + 1)
      };
    }).sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [tasks]);

  return (
    <div className="h-full flex flex-col bg-[#C0C0C0] bevel-outset overflow-hidden p-1">
      {/* Gantt Toolbar */}
      <div className="px-4 py-3 bevel-inset bg-[#C0C0C0] flex items-center justify-between mb-2">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentDate(addDays(currentDate, -30))}
              className="w-8 h-8 bevel-outset bg-[#C0C0C0] flex items-center justify-center hover:bg-[#d0d0d0] active:bevel-inset"
            >
              <ChevronLeft size={14} strokeWidth={3} />
            </button>
            <div className="bevel-inset bg-white px-6 py-1 min-w-[180px] text-center font-heading text-sm text-win-navy">
              {format(currentDate, 'yyyy / MM', { locale: zhTW })}
            </div>
            <button 
              onClick={() => setCurrentDate(addDays(currentDate, 30))}
              className="w-8 h-8 bevel-outset bg-[#C0C0C0] flex items-center justify-center hover:bg-[#d0d0d0] active:bevel-inset"
            >
              <ChevronRight size={14} strokeWidth={3} />
            </button>
          </div>
          
          <div className="flex gap-1">
             <button className="px-4 py-1 bevel-outset bg-[#C0C0C0] font-heading text-[9px] uppercase hover:bg-[#d0d0d0] active:bevel-inset">Today</button>
             <div className="flex p-0.5 bevel-inset bg-[#808080]/10">
                <button className="px-4 py-0.5 font-heading text-[9px] uppercase hover:bg-white active:bevel-inset">Week</button>
                <button className="px-4 py-0.5 bg-win-navy text-white font-heading text-[9px] uppercase">Month</button>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-8 h-8 bevel-outset bg-[#C0C0C0] flex items-center justify-center hover:bg-[#d0d0d0]">
            <Filter size={14} strokeWidth={2} />
          </button>
          <button className="w-8 h-8 bevel-outset bg-[#C0C0C0] flex items-center justify-center hover:bg-[#d0d0d0]">
            <Maximize2 size={14} strokeWidth={2} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex gap-1">
        {/* Left Side: Task List */}
        <div className="w-[300px] bevel-inset bg-white flex flex-col">
          <div className="h-10 bg-[#E8E8E8] border-b-2 border-muted flex items-center px-4">
            <div className="grid grid-cols-[50px_1fr] w-full gap-2">
               <span className="font-heading text-[9px] uppercase text-muted">ID</span>
               <span className="font-heading text-[9px] uppercase text-muted">Task_Identifier</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {timelineTasks.map((task, idx) => (
              <div 
                key={task.id} 
                className={cn(
                  "h-10 border-b border-[#E8E8E8] flex items-center px-4 hover:bg-win-yellow/20 cursor-pointer group transition-none",
                  idx % 2 === 0 ? "bg-white" : "bg-[#f9f9f9]"
                )}
              >
                <div className="grid grid-cols-[50px_1fr] w-full gap-2 items-center">
                  <span className="font-mono text-[9px] font-bold text-muted">#{task.id.slice(0, 3)}</span>
                  <span className="font-bold text-xs truncate group-hover:text-win-navy group-hover:underline uppercase tracking-tight">{task.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Timeline Grid */}
        <div className="flex-1 bevel-inset bg-white overflow-auto relative scrollbar-hide">
          <div className="sticky top-0 z-20 flex bg-[#E8E8E8] border-b-2 border-muted shadow-sm">
            {days.map((day) => (
              <div 
                key={day.toISOString()} 
                className={cn(
                  "flex-shrink-0 w-[40px] h-10 flex flex-col items-center justify-center border-r border-muted/30",
                  isSameDay(day, new Date()) ? "bg-win-blue text-white" : ""
                )}
              >
                <span className="font-mono text-[8px] font-bold uppercase opacity-60">{format(day, 'EE', { locale: zhTW })}</span>
                <span className="font-heading text-[10px]">{format(day, 'd')}</span>
              </div>
            ))}
          </div>

          <div className="relative min-h-full" style={{ width: `${days.length * 40}px` }}>
            <div className="absolute inset-0 flex pointer-events-none">
              {days.map((day) => (
                <div 
                  key={`line-${day.toISOString()}`} 
                  className={cn(
                    "w-[40px] h-full border-r border-[#E8E8E8]",
                    isSameDay(day, new Date()) ? "bg-win-blue/5" : ""
                  )} 
                />
              ))}
            </div>

            <div className="relative">
              {timelineTasks.map((task, idx) => (
                <div key={`row-${task.id}`} className={cn(
                  "h-10 border-b border-[#E8E8E8] relative flex items-center transition-none",
                  idx % 2 === 0 ? "bg-transparent" : "bg-[#f9f9f9]/30"
                )}>
                  <div 
                    className={cn(
                      "absolute h-6 bevel-outset transition-none cursor-pointer group flex items-center px-2 overflow-hidden",
                      task.priority === 'URGENT' ? "bg-secondary text-white [border-color:#ff5555_#800000_#800000_#ff5555]" : 
                      task.priority === 'HIGH' ? "bg-win-blue text-white [border-color:#5555ff_#000080_#000080_#5555ff]" :
                      "bg-[#C0C0C0] text-black"
                    )}
                    style={{
                      left: `${differenceInDays(task.start, monthStart) * 40}px`,
                      width: `${task.duration * 40}px`
                    }}
                  >
                    <span className="font-mono text-[8px] font-bold uppercase truncate">
                      {task.duration}D
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
