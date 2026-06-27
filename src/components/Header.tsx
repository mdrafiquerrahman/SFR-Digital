import React from 'react';
import { motion } from 'motion/react';
import Icon from './Icon';

interface HeaderProps {
  currentView: 'home' | 'portal';
  setView: (view: 'home' | 'portal') => void;
  portalTab: string;
  setPortalTab: (tab: string) => void;
}

export default function Header({ currentView, setView, portalTab, setPortalTab }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo / Brand */}
        <div 
          onClick={() => setView('home')} 
          className="flex cursor-pointer items-center space-x-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-100">
            <Icon name="Cpu" className="h-5 w-5" />
          </div>
          <div>
            <span className="font-sans text-lg font-bold tracking-tight text-gray-900 sm:text-xl">
              SFR<span className="text-indigo-600">DIGITAL</span>
            </span>
            <div className="font-mono text-[9px] font-medium tracking-wider text-gray-400 uppercase leading-none">
              Systems & Solutions
            </div>
          </div>
        </div>

        {/* Public Navigation / View Switcher */}
        <div className="flex items-center space-x-3 sm:space-x-6">
          <button
            onClick={() => setView('home')}
            className={`font-sans text-sm font-medium transition-colors hover:text-indigo-600 ${
              currentView === 'home' ? 'text-indigo-600' : 'text-gray-500'
            }`}
          >
            Showcase
          </button>
          
          <button
            onClick={() => {
              setView('portal');
              setPortalTab('dashboard');
            }}
            className={`relative flex items-center space-x-1.5 rounded-full px-4 py-2 font-sans text-sm font-semibold transition-all ${
              currentView === 'portal'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200/50'
            }`}
          >
            <Icon name="Briefcase" className="h-3.5 w-3.5" />
            <span>Client Portal</span>
            {currentView !== 'portal' && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500"></span>
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
