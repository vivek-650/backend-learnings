'use client';

import { useState } from 'react';
import TopNav from './TopNav';
import Sidebar from './Sidebar';

export default function YouTubeLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <TopNav onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex pt-14">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
