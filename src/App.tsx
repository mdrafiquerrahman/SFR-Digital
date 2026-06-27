import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomeShowcase from './components/HomeShowcase';
import ClientPortal from './components/ClientPortal';
import { seedDatabaseIfEmpty } from './dbService';
import Icon from './components/Icon';

export default function App() {
  const [currentView, setView] = useState<'home' | 'portal'>('home');
  const [portalTab, setPortalTab] = useState<string>('dashboard');
  const [seedingComplete, setSeedingComplete] = useState<boolean>(false);

  // Seed database with beautiful case-study templates on app startup if Firestore is empty
  useEffect(() => {
    async function initDb() {
      try {
        await seedDatabaseIfEmpty();
        setSeedingComplete(true);
      } catch (err) {
        console.error('Failed to auto-seed database:', err);
        setSeedingComplete(true); // fall through so user isn't stuck
      }
    }
    initDb();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans antialiased text-gray-800">
      
      {/* Dynamic Splash Seeding Screen */}
      {!seedingComplete && (
        <div className="fixed inset-0 bg-gray-950 z-50 flex flex-col items-center justify-center text-white p-6">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-900/40">
            <Icon name="Cpu" className="h-7 w-7 text-white animate-pulse" />
          </div>
          <h2 className="mt-6 font-sans text-lg font-bold tracking-tight">SFR DIGITAL SYSTEMS</h2>
          <p className="mt-2 font-mono text-[11px] text-indigo-400 uppercase tracking-widest animate-pulse">
            Configuring Real-Time Firestore Synchronization...
          </p>
          <div className="mt-8 w-48 bg-gray-900 rounded-full h-1 border border-gray-800">
            <div className="bg-indigo-500 h-1 rounded-full animate-[loading_1.5s_infinite_linear]" style={{ width: '40%' }}></div>
          </div>
        </div>
      )}

      {/* Main App Container */}
      {seedingComplete && (
        <>
          <Header 
            currentView={currentView} 
            setView={setView} 
            portalTab={portalTab}
            setPortalTab={setPortalTab}
          />
          
          <main className="flex-grow">
            <AnimatePresence mode="wait">
              {currentView === 'home' ? (
                <motion.div
                  key="home"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HomeShowcase 
                    onEnterPortal={() => {
                      setView('portal');
                      setPortalTab('dashboard');
                    }} 
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="portal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ClientPortal initialTab={portalTab} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
          
          <Footer />
        </>
      )}
    </div>
  );
}
