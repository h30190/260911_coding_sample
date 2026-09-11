import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Project, Column, Task, RFI, User } from '../types';

interface AppState {
  currentProject: Project | null;
  projects: Project[];
  columns: Column[];
  tasks: Task[];
  rfis: RFI[];
  users: User[];
  loading: boolean;
  
  setCurrentProject: (project: Project | null) => void;
  initDemoData: () => void;
  moveTask: (taskId: string, targetColumnId: string, index: number) => void;
  createTask: (task: Partial<Task>) => void;
  createRfi: (rfi: Partial<RFI>) => void;
}

const DEFAULT_COLUMNS: Column[] = [
  { id: 'c1', boardId: 'demo-project', name: '待處理', position: 0, wipLimit: 10, color: '#f1f5f9' },
  { id: 'c2', boardId: 'demo-project', name: '進行中', position: 1, wipLimit: 5, color: '#eff6ff' },
  { id: 'c3', boardId: 'demo-project', name: '審核中', position: 2, wipLimit: 5, color: '#fffbeb' },
  { id: 'c4', boardId: 'demo-project', name: '已完成', position: 3, wipLimit: 0, color: '#f0fdf4' },
];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentProject: null,
      projects: [],
      columns: [],
      tasks: [],
      rfis: [],
      users: [],
      loading: false,

      setCurrentProject: (project) => set({ currentProject: project }),

      initDemoData: () => {
        const state = get();
        if (state.columns.length === 0) {
          set({ columns: DEFAULT_COLUMNS });
        }
        if (state.tasks.length === 0) {
          const now = new Date();
          const demoTasks: Task[] = [
            {
              id: 't1',
              projectId: 'demo-project',
              columnId: 'c2',
              title: '專案規劃與需求收集',
              description: '專案的初始階段，包含各方需求彙整。',
              position: 0,
              priority: 'HIGH',
              startDate: new Date(now.getFullYear(), now.getMonth(), 1).toISOString(),
              dueDate: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
              createdAt: new Date().toISOString(),
              creatorId: 'user-1'
            },
            {
              id: 't2',
              projectId: 'demo-project',
              columnId: 'c2',
              title: '前端開發 - UI 組件庫建置',
              description: '為儀表板開發基礎 UI 組件。',
              position: 1,
              priority: 'MEDIUM',
              startDate: new Date(now.getFullYear(), now.getMonth(), 10).toISOString(),
              dueDate: new Date(now.getFullYear(), now.getMonth(), 25).toISOString(),
              createdAt: new Date().toISOString(),
              creatorId: 'user-1'
            },
            {
              id: 't3',
              projectId: 'demo-project',
              columnId: 'c1',
              title: '後端 API 整合測試',
              description: '將前端與後端服務進行連線測試。',
              position: 2,
              priority: 'HIGH',
              startDate: new Date(now.getFullYear(), now.getMonth(), 15).toISOString(),
              dueDate: new Date(now.getFullYear(), now.getMonth(), 28).toISOString(),
              createdAt: new Date().toISOString(),
              creatorId: 'user-1'
            }
          ];
          set({ tasks: demoTasks });
        }
        if (!state.currentProject) {
          set({
            currentProject: {
              id: 'demo-project',
              name: '基礎設施擴展專案 - 第七區',
              description: '大型民用工程與基礎設施開發專案。',
              createdAt: new Date().toISOString()
            }
          });
        }
      },

      moveTask: (taskId, targetColumnId, index) => {
        const tasks = [...get().tasks];
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        // Simple position update
        const columnTasks = tasks
          .filter(t => t.columnId === targetColumnId)
          .sort((a, b) => a.position - b.position);
        
        const [movedTask] = tasks.splice(taskIndex, 1);
        movedTask.columnId = targetColumnId;
        
        // Basic positioning logic for demo
        movedTask.position = index;
        
        set({ tasks: [...tasks, movedTask] });
      },

      createTask: (taskData) => {
        const newTask: Task = {
          id: Math.random().toString(36).substr(2, 9),
          projectId: get().currentProject?.id || 'demo-project',
          columnId: taskData.columnId || 'c1',
          title: taskData.title || 'Untitled Task',
          description: taskData.description,
          position: get().tasks.length,
          priority: taskData.priority || 'MEDIUM',
          startDate: taskData.startDate || new Date().toISOString(),
          dueDate: taskData.dueDate,
          createdAt: new Date().toISOString(),
          creatorId: 'user-1'
        };
        set({ tasks: [...get().tasks, newTask] });
      },

      createRfi: (rfiData) => {
        const newRfi: RFI = {
          id: Math.random().toString(36).substr(2, 9),
          projectId: get().currentProject?.id || 'demo-project',
          rfiCode: `RFI-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(get().rfis.length + 1).padStart(3, '0')}`,
          title: rfiData.title || 'Untitled RFI',
          question: rfiData.question || '',
          status: 'SUBMITTED',
          priority: rfiData.priority || 'MEDIUM',
          costImpact: !!rfiData.costImpact,
          scheduleImpact: !!rfiData.scheduleImpact,
          createdAt: new Date().toISOString(),
          creatorId: 'user-1'
        };
        set({ rfis: [...get().rfis, newRfi] });
      }
    }),
    {
      name: 'protrack-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

