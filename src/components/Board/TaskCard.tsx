import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Task } from '../../types';
import { Calendar, MessageSquare, Paperclip, MessageCircleQuestion } from 'lucide-react';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

interface TaskCardProps {
  task: Task;
  index: number;
}

const PriorityBadge = ({ priority }: { priority: Task['priority'] }) => {
  const isUrgent = priority === 'URGENT';
  const isHigh = priority === 'HIGH';
  
  return (
    <span className={cn(
      "text-[8px] font-heading px-2 py-0.5 uppercase tracking-widest bevel-outset",
      isUrgent ? "bg-secondary text-white [border-color:#ff5555_#800000_#800000_#ff5555] animate-pulse-glow" :
      isHigh ? "bg-accent text-white [border-color:#5555ff_#000080_#000080_#5555ff]" :
      "bg-success-dark text-white [border-color:#00ff00_#006600_#006600_#00ff00]"
    )}>
      {priority}
    </span>
  );
};

export default function TaskCard({ task, index }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cn(
            "bg-[#C0C0C0] bevel-outset p-4 transition-none cursor-pointer group active:bevel-inset active:translate-x-[1px] active:translate-y-[1px]",
            snapshot.isDragging ? "z-50 opacity-90 scale-105" : ""
          )}
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <PriorityBadge priority={task.priority} />
              <span className="font-mono text-[9px] font-bold opacity-40">0x{task.id.slice(0, 4)}</span>
            </div>

            <div className="flex flex-col gap-1">
              <h4 className={cn(
                "font-heading text-sm leading-tight tracking-tight uppercase group-hover:text-win-navy",
                task.priority === 'URGENT' && "text-rainbow"
              )}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-[10px] leading-tight text-muted font-bold line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            <div className="hr-groove !my-1" />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {task.dueDate && (
                  <div className="flex items-center gap-1 font-mono text-[8px] font-bold text-win-navy underline">
                    <Calendar size={10} strokeWidth={2} />
                    <span>{format(new Date(task.dueDate), 'MM-dd-yy')}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 opacity-60">
                <div className="flex items-center gap-1 font-mono text-[8px] font-bold">
                  <MessageSquare size={10} strokeWidth={2} />
                  <span>3</span>
                </div>
                <div className="flex items-center gap-1 font-mono text-[8px] font-bold">
                  <Paperclip size={10} strokeWidth={2} />
                  <span>1</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
