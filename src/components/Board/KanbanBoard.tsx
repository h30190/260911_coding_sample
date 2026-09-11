import React, { useState } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { useStore } from '../../store/useStore';
import Column from './Column';
import GanttChart from './GanttChart';
import { LayoutGrid, BarChart2, List, Filter, Search } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function KanbanBoard() {
  const { columns, tasks, moveTask } = useStore();
  const [view, setView] = useState<'kanban' | 'gantt'>('kanban');

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;
    moveTask(draggableId, destination.droppableId, destination.index);
  };

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl text-win-navy mb-2">Architectural_Workflow</h2>
          <div className="flex items-center gap-4">
             <div className="bg-construction h-4 w-12 bevel-inset" />
             <p className="font-mono text-[10px] text-muted uppercase tracking-widest">Version 2.0.4 - Release_Stable</p>
          </div>
        </div>
        
        <div className="flex gap-2 p-1 bevel-inset bg-[#E8E8E8]">
          <button 
            onClick={() => setView('kanban')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 font-heading text-[10px] uppercase tracking-widest",
              view === 'kanban' ? "bg-white bevel-inset" : "bg-[#C0C0C0] bevel-outset hover:bg-[#d0d0d0]"
            )}
          >
            <LayoutGrid size={14} strokeWidth={2} />
            <span>Classic Board</span>
          </button>
          <button 
            onClick={() => setView('gantt')}
            className={cn(
              "flex items-center gap-2 px-6 py-2 font-heading text-[10px] uppercase tracking-widest",
              view === 'gantt' ? "bg-white bevel-inset" : "bg-[#C0C0C0] bevel-outset hover:bg-[#d0d0d0]"
            )}
          >
            <BarChart2 size={14} strokeWidth={2} className="rotate-90" />
            <span>Timeline_v97</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {view === 'kanban' ? (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="h-full flex overflow-x-auto pb-4 scrollbar-hide">
              {columns.length > 0 ? (
                <div className="flex h-full gap-4 pr-4">
                  {columns.map((column) => (
                    <Column 
                      key={column.id} 
                      column={column} 
                      tasks={tasks.filter(t => t.columnId === column.id).sort((a, b) => a.position - b.position)} 
                    />
                  ))}
                </div>
              ) : (
                <div className="flex h-full gap-4">
                  {['待處理', '進行中', '審核中', '已完成'].map((name, i) => (
                    <div key={i} className="flex-shrink-0 w-80 bevel-outset bg-[#C0C0C0] flex flex-col p-4 gap-4">
                      <div className="w-full h-6 bevel-inset bg-win-navy animate-pulse" />
                      <div className="flex-1 bevel-inset bg-white/50 flex items-center justify-center">
                        <p className="font-mono text-[9px] uppercase tracking-tighter opacity-20 italic">BOOTING_FS_{name}...</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </DragDropContext>
        ) : (
          <GanttChart />
        )}
      </div>
    </div>
  );
}
