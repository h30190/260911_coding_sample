import React, { useEffect, useState } from 'react';
import { Layout, LayoutDashboard, ClipboardList, Settings, Bell, Search, Plus, User as UserIcon, LogOut, ChevronRight, HardDrive, Info } from 'lucide-react';
import { cn } from '../lib/utils';
import { useStore } from '../store/useStore';
import KanbanBoard from './Board/KanbanBoard';
import RFIList from './RFI/RFIList';
import CreateTaskModal from './CreateTaskModal';
import CreateRFIModal from './CreateRFIModal';
import Marquee from 'react-fast-marquee';

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-4 w-full px-4 py-3 mb-2 font-heading text-xs tracking-wide uppercase group relative",
      active 
        ? "bg-white text-black bevel-inset" 
        : "bg-[#C0C0C0] text-black bevel-outset hover:bg-[#d0d0d0] active:bevel-inset active:translate-x-[1px] active:translate-y-[1px]"
    )}
  >
    <Icon className={cn("w-4 h-4", active ? "text-win-navy" : "text-black")} strokeWidth={2} />
    <span>{label}</span>
    {active && <div className="absolute right-2 w-2 h-2 bg-win-navy animate-pulse" />}
  </button>
);

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState<'board' | 'rfi' | 'settings'>('board');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isRfiModalOpen, setIsRfiModalOpen] = useState(false);
  const { currentProject, initDemoData, createTask, createRfi } = useStore();

  useEffect(() => {
    initDemoData();
  }, [initDemoData]);

  return (
    <div className="flex h-screen bg-[#C0C0C0] text-black font-primary selection:bg-[#000080] selection:text-white overflow-hidden p-2">
      {/* 90s Desktop Environment Simulation */}
      <div className="flex w-full h-full border-2 border-white bevel-inset bg-[#C0C0C0] p-1">
        
        {/* Sidebar as Win95 Panel */}
        <aside className="w-64 flex flex-col gap-2 p-2 bg-[#C0C0C0]">
          <div className="bevel-inset bg-white p-4 mb-4 flex flex-col items-center justify-center gap-2 overflow-hidden bg-construction/5">
             <div className="bevel-outset p-2 bg-win-navy">
                <Layout className="w-8 h-8 text-white" strokeWidth={2} />
             </div>
             <div className="text-center">
                <h1 className="text-2xl font-heading text-win-navy text-rainbow">ProTrack 97</h1>
                <p className="text-[9px] font-mono font-black uppercase tracking-widest opacity-60">Control Center 2.0</p>
             </div>
          </div>

          <nav className="flex-1">
            <SidebarItem 
              icon={LayoutDashboard} 
              label="Task Board" 
              active={activeTab === 'board'} 
              onClick={() => setActiveTab('board')} 
            />
            <SidebarItem 
              icon={ClipboardList} 
              label="RFI Tracking" 
              active={activeTab === 'rfi'} 
              onClick={() => setActiveTab('rfi')} 
            />
            <SidebarItem 
              icon={Settings} 
              label="System Setup" 
              active={activeTab === 'settings'} 
              onClick={() => setActiveTab('settings')} 
            />
          </nav>

          {/* Hit Counter Aesthetic */}
          <div className="bevel-inset bg-black p-4 mt-auto mb-2 font-mono">
             <p className="text-[9px] text-muted mb-1 uppercase tracking-tighter">Visitor Stats</p>
             <div className="text-[#00FF00] text-lg font-black tracking-[0.2em]">
                0004271
             </div>
             <p className="text-[8px] text-[#00FF00] opacity-50 mt-1">EST. 1995-2026</p>
          </div>

          <div className="bevel-outset bg-[#C0C0C0] p-3 flex items-center gap-3">
            <div className="w-8 h-8 bg-win-navy flex items-center justify-center bevel-inset">
              <UserIcon className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-[10px] font-heading leading-none truncate">SYSADMIN_ALEX</p>
              <p className="text-[9px] font-mono opacity-50">LEAD ARCHITECT</p>
            </div>
            <LogOut className="w-3 h-3 cursor-pointer hover:text-secondary" />
          </div>
        </aside>

        <main className="flex-1 flex flex-col gap-2 p-2 min-w-0">
          {/* Announcement Marquee */}
          <div className="h-8 bevel-inset bg-black flex items-center overflow-hidden">
            <Marquee speed={50} gradient={false}>
               <span className="text-tertiary font-heading text-[10px] uppercase tracking-widest mr-24">
                  *** BREAKING NEWS: NEW ARCHITECTURAL SCOPE DEFINED FOR PHASE 02 ***
               </span>
               <span className="text-success font-heading text-[10px] uppercase tracking-widest mr-24">
                  WELCOME TO THE PROTRACK 97 ENTERPRISE EDITION V2.0.4
               </span>
               <span className="text-secondary font-heading text-[10px] uppercase tracking-widest mr-24">
                  !!! CAUTION: UNDER CONSTRUCTION !!! CAUTION: UNDER CONSTRUCTION !!!
               </span>
            </Marquee>
          </div>

          <header className="h-20 bevel-outset bg-[#C0C0C0] flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-4 py-2 bevel-inset bg-white">
                  <HardDrive size={16} className="text-win-navy" />
                  <span className="font-mono text-xs font-bold truncate max-w-[200px]">C:\PROJECTS\{currentProject?.name?.toUpperCase().replace(/\s+/g, '_')}</span>
               </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bevel-inset bg-white flex items-center px-4 py-1 h-10 w-64">
                <Search size={14} className="opacity-50 mr-2" />
                <input 
                  type="text" 
                  placeholder="SEARCH DATABASE..." 
                  className="bg-transparent border-none w-full text-xs font-mono focus:ring-0 outline-none placeholder:text-muted uppercase"
                />
              </div>
              
              <button className="w-10 h-10 bevel-outset bg-[#C0C0C0] flex items-center justify-center hover:bg-[#d0d0d0] active:bevel-inset">
                <Bell size={18} strokeWidth={2} />
              </button>

              <button 
                onClick={() => activeTab === 'rfi' ? setIsRfiModalOpen(true) : setIsTaskModalOpen(true)}
                className="h-10 px-6 bevel-outset bg-win-navy text-white font-heading text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-[#0000a0] active:bevel-inset active:translate-x-[1px] active:translate-y-[1px]"
              >
                <Plus size={16} strokeWidth={3} />
                <span>NEW RECORD</span>
              </button>
            </div>
          </header>

          <div className="flex-1 bevel-inset bg-white overflow-auto p-8 relative">
            {/* Texture Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
                 style={{ backgroundImage: 'linear-gradient(rgba(0,0,128,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,128,0.1) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
            
            <div className="relative z-10">
              {activeTab === 'board' && <KanbanBoard />}
              {activeTab === 'rfi' && <RFIList />}
              {activeTab === 'settings' && <SettingsPage />}
            </div>
          </div>

          {/* Status Bar */}
          <footer className="h-6 flex gap-1 font-mono text-[9px] uppercase font-bold">
             <div className="flex-1 bevel-inset bg-[#C0C0C0] px-2 flex items-center">
                Connected to: SQL_DATABASE_SVR_01 (192.168.1.42)
             </div>
             <div className="w-32 bevel-inset bg-[#C0C0C0] px-2 flex items-center justify-center">
                LATENCY: 54MS
             </div>
             <div className="w-48 bevel-inset bg-[#C0C0C0] px-2 flex items-center justify-center">
                {new Date().toLocaleTimeString()}
             </div>
          </footer>
        </main>
      </div>

      <CreateTaskModal 
        isOpen={isTaskModalOpen} 
        onClose={() => setIsTaskModalOpen(false)} 
        onSubmit={(data) => {
          createTask(data);
          setIsTaskModalOpen(false);
        }} 
      />

      <CreateRFIModal
        isOpen={isRfiModalOpen}
        onClose={() => setIsRfiModalOpen(false)}
        onSubmit={(data) => {
          createRfi(data);
          setIsRfiModalOpen(false);
        }}
      />
    </div>
  );
}

function SettingsPage() {
  const { currentProject } = useStore();

  return (
    <div className="max-w-4xl flex flex-col gap-12 pb-20">
      <div className="bevel-outset bg-[#C0C0C0]">
         <div className="win-title-bar">
            <span>SYSTEM_CONFIG.EXE</span>
            <div className="flex gap-1">
               <div className="w-4 h-4 bevel-outset bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center">-</div>
               <div className="w-4 h-4 bevel-outset bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center">□</div>
               <div className="w-4 h-4 bevel-outset bg-[#C0C0C0] text-black text-[8px] flex items-center justify-center">x</div>
            </div>
         </div>
         <div className="p-8 flex flex-col gap-8">
            <h1 className="text-4xl text-win-navy">Control Panel</h1>
            <p className="font-mono text-xs text-muted leading-relaxed">Customize your ProTrack 97 environment. Please ensure all database connections are stable before committing changes to the central repository.</p>
         </div>
      </div>

      <hr className="hr-groove" />

      {/* Section A: 專案基本設定 */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl text-win-navy">1. Project Metadata / 專案基本設定</h2>
        
        <div className="bevel-outset bg-[#C0C0C0] p-8 flex flex-col gap-6">
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted">Field_Identifier: Project_Name</label>
              <input 
                type="text" 
                defaultValue={currentProject?.name}
                className="bevel-inset bg-white px-4 py-2 text-lg font-bold focus:ring-2 focus:ring-accent outline-none"
              />
           </div>
           <div className="flex flex-col gap-2">
              <label className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted">Field_Description: Project_Scope</label>
              <textarea 
                rows={3}
                defaultValue={currentProject?.description}
                className="bevel-inset bg-white px-4 py-2 text-sm focus:ring-2 focus:ring-accent outline-none resize-none"
              />
           </div>
           <div className="flex justify-start">
              <button className="bg-[#C0C0C0] bevel-outset px-8 py-3 font-heading text-[10px] uppercase tracking-widest hover:bg-[#d0d0d0] active:bevel-inset">Commit Changes</button>
           </div>
        </div>
      </section>

      {/* Section A-1: 看板與工作流設定 */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl text-win-navy">2. Workflow Pipeline / 工作流設定</h2>

        <div className="bevel-inset bg-white overflow-hidden">
           <table className="w-full text-left border-collapse">
              <thead className="bg-[#E8E8E8] border-b-2 border-muted">
                 <tr>
                    <th className="px-6 py-3 font-heading text-[10px] border-r-2 border-muted">ID</th>
                    <th className="px-6 py-3 font-heading text-[10px] border-r-2 border-muted">Label / 欄位名稱</th>
                    <th className="px-6 py-3 font-heading text-[10px]">WIP Limit</th>
                 </tr>
              </thead>
              <tbody className="divide-y-2 divide-muted">
                {['待處理', '進行中', '審核中', '已完成'].map((col, i) => (
                  <tr key={i} className="hover:bg-win-yellow transition-colors group">
                     <td className="px-6 py-3 font-mono text-sm border-r-2 border-muted">0x0{i+1}</td>
                     <td className="px-6 py-3 border-r-2 border-muted">
                        <input type="text" defaultValue={col} className="w-full bg-transparent border-none font-bold outline-none" />
                     </td>
                     <td className="px-6 py-3">
                        <input type="number" defaultValue={5} className="w-16 bevel-inset bg-white px-2 py-1 text-sm font-mono text-center outline-none" />
                     </td>
                  </tr>
                ))}
              </tbody>
           </table>
           <button className="w-full py-4 bg-[#C0C0C0] bevel-outset font-heading text-[10px] uppercase tracking-widest hover:bg-[#d0d0d0] active:bevel-inset">
             [+] Append New Phase Entry
           </button>
        </div>
      </section>

      {/* Section A-2: 團隊權限管理 */}
      <section className="flex flex-col gap-6">
        <h2 className="text-xl text-win-navy">3. Access Protocols / 團隊管理</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
             { name: 'Alex Chen', role: 'SYSADMIN', avatar: 'AC' },
             { name: 'Kevin Wang', role: 'DEVELOPER', avatar: 'KM' },
             { name: 'Sarah Li', role: 'DESIGNER', avatar: 'SH' },
           ].map((user, i) => (
             <div key={i} className="bevel-outset bg-[#C0C0C0] p-4 flex items-center gap-4 hover:bg-win-yellow/20">
                <div className="w-12 h-12 bevel-inset bg-win-navy flex items-center justify-center font-heading text-white text-lg">{user.avatar}</div>
                <div className="flex-1">
                   <p className="font-heading text-sm text-win-navy">{user.name}</p>
                   <p className="font-mono text-[9px] text-muted font-bold tracking-widest">{user.role}</p>
                </div>
                <button className="font-heading text-[8px] text-secondary border-b border-secondary">REVOKE</button>
             </div>
           ))}
        </div>
        <div className="flex justify-center mt-4">
           <button className="bg-[#C0C0C0] bevel-outset px-10 py-4 font-heading text-[10px] uppercase tracking-widest hover:bg-[#d0d0d0] active:bevel-inset">
              Grant New Access Permit
           </button>
        </div>
      </section>

      <div className="bg-construction h-12 bevel-inset mt-12 flex items-center justify-center">
         <span className="bg-tertiary text-black px-4 py-1 bevel-outset font-heading text-[10px] animate-pulse-glow">
            !!! END OF SYSTEM_CONFIG !!!
         </span>
      </div>
    </div>
  );
}

