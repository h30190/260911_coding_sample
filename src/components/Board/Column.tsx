import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Column as ColumnType, Task as TaskType } from '../../types';
import TaskCard from './TaskCard';
import { MoreHorizontal, Plus } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ColumnProps {
  column: ColumnType;
  tasks: TaskType[];
}

export default function Column({ column, tasks }: ColumnProps) {
  return (
    <div className="flex-shrink-0 w-80 flex flex-col bevel-outset bg-[#C0C0C0] p-1">
      <div className="win-title-bar mb-2">
        <div className="flex items-center gap-2">
          <span className="truncate">{column.name}</span>
          <span className="font-mono text-[9px] bg-black text-tertiary px-1">[{tasks.length}]</span>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-4 h-4 bevel-outset bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center hover:bg-[#d0d0d0]">+</button>
          <button className="w-4 h-4 bevel-outset bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center hover:bg-[#d0d0d0]">×</button>
        </div>
      </div>

      <Droppable droppableId={column.id}>
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "flex-1 flex flex-col gap-2 min-h-[150px] p-2 bevel-inset bg-[#808080]/5 transition-colors overflow-y-auto scrollbar-hide",
              snapshot.isDraggingOver ? "bg-win-yellow/10" : ""
            )}
          >
            {tasks.map((task, index) => (
              <TaskCard key={task.id} task={task} index={index} />
            ))}
            {provided.placeholder}
            
            {/* Empty state texture */}
            {tasks.length === 0 && (
               <div className="flex-1 flex flex-col items-center justify-center gap-4 opacity-20 py-12">
                 <div className="w-12 h-12 bevel-inset bg-white/20 border-2 border-dashed border-muted flex items-center justify-center">
                    <Plus size={24} className="text-muted" />
                 </div>
                 <span className="font-mono text-[9px] uppercase tracking-widest text-center px-8">No records found in this partition.</span>
               </div>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
