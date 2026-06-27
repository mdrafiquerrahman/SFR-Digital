import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  subscribeToClients, addClient, updateClientStatus, deleteClient,
  subscribeToProjects, addProject, updateProjectProgress, updateProjectStatus, deleteProject,
  subscribeToTickets, addTicket, updateTicketStatus, updateTicketPriority, deleteTicket,
  getUserProfile
} from '../dbService';
import { Client, Project, Ticket, AppUser } from '../types';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../firebase';
import Icon from './Icon';
import PortalAuth from './PortalAuth';

interface ClientPortalProps {
  initialTab: string;
}

export default function ClientPortal({ initialTab }: ClientPortalProps) {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  
  // Real-time Database State
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Form States
  const [showClientForm, setShowClientForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', company: '', email: '', phone: '', status: 'Lead' as Client['status'] });

  const [showProjectForm, setShowProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ 
    name: '', clientId: '', description: '', status: 'Planning' as Project['status'], 
    progress: 0, budget: 10000, startDate: '', endDate: '' 
  });

  const [showTicketForm, setShowTicketForm] = useState(false);
  const [newTicket, setNewTicket] = useState({ 
    title: '', description: '', priority: 'Medium' as Ticket['priority'], clientId: '', projectId: '' 
  });

  // Portal Roles (simulate a perspective toggle for clients/managers to see different actions easily)
  const [portalRole, setPortalRole] = useState<'Client' | 'Manager'>('Manager');
  const [simulatedClientId, setSimulatedClientId] = useState<string>('client_brightbuild');

  // True Firebase Auth states
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<AppUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [bypassAuthForDemo, setBypassAuthForDemo] = useState<boolean>(false);

  // Success Feedbacks
  const [notification, setNotification] = useState<string | null>(null);

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsAuthLoading(true);
      if (user) {
        setFirebaseUser(user);
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
            setPortalRole(profile.role);
            if (profile.role === 'Client' && profile.clientId) {
              setSimulatedClientId(profile.clientId);
            }
          }
        } catch (err) {
          console.error("Error fetching user profile:", err);
        }
      } else {
        setFirebaseUser(null);
        setUserProfile(null);
      }
      setIsAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Subscribe to real-time database updates on mount
  useEffect(() => {
    setIsLoading(true);
    const unsubClients = subscribeToClients((list) => {
      setClients(list);
    });
    const unsubProjects = subscribeToProjects((list) => {
      setProjects(list);
    });
    const unsubTickets = subscribeToTickets((list) => {
      setTickets(list);
      setIsLoading(false);
    });

    return () => {
      unsubClients();
      unsubProjects();
      unsubTickets();
    };
  }, []);

  const triggerToast = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setBypassAuthForDemo(false);
      triggerToast('✓ Successfully signed out of portal workspace');
    } catch (err) {
      console.error(err);
      triggerToast('❌ Error signing out');
    }
  };

  // Form submissions
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.company || !newClient.email) {
      triggerToast('⚠️ Please fill out all required fields');
      return;
    }
    try {
      const id = await addClient(newClient);
      triggerToast(`✓ Client "${newClient.company}" added!`);
      setNewClient({ name: '', company: '', email: '', phone: '', status: 'Lead' });
      setShowClientForm(false);
      // Automatically make this the simulated client
      setSimulatedClientId(id);
    } catch (err) {
      console.error(err);
      triggerToast('❌ Error adding client');
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name || !newProject.clientId) {
      triggerToast('⚠️ Project Title and Client are required');
      return;
    }
    const selectedClient = clients.find(c => c.id === newProject.clientId);
    const clientName = selectedClient ? selectedClient.company : 'Unknown Client';
    
    try {
      await addProject({
        name: newProject.name,
        clientId: newProject.clientId,
        clientName,
        description: newProject.description,
        status: newProject.status,
        progress: Number(newProject.progress),
        budget: Number(newProject.budget),
        startDate: newProject.startDate || new Date().toISOString().split('T')[0],
        endDate: newProject.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
      triggerToast(`✓ Project "${newProject.name}" tracked!`);
      setNewProject({ name: '', clientId: '', description: '', status: 'Planning', progress: 0, budget: 15000, startDate: '', endDate: '' });
      setShowProjectForm(false);
    } catch (err) {
      console.error(err);
      triggerToast('❌ Error adding project');
    }
  };

  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    const activeClientId = portalRole === 'Client' ? simulatedClientId : newTicket.clientId;
    if (!newTicket.title || !newTicket.description || !activeClientId) {
      triggerToast('⚠️ Title, description, and client are required.');
      return;
    }
    
    const clientRef = clients.find(c => c.id === activeClientId);
    const creatorName = portalRole === 'Client' ? (clientRef?.name || 'Client Contact') : 'SFR Support';
    const creatorRole = portalRole === 'Client' ? 'Client' : 'Engineer';

    try {
      await addTicket({
        title: newTicket.title,
        description: newTicket.description,
        status: 'Open',
        priority: newTicket.priority,
        clientId: activeClientId,
        projectId: newTicket.projectId || undefined,
        creatorName,
        creatorRole
      });
      triggerToast(`✓ Real-time Support Ticket Submitted!`);
      setNewTicket({ title: '', description: '', priority: 'Medium', clientId: '', projectId: '' });
      setShowTicketForm(false);
    } catch (err) {
      console.error(err);
      triggerToast('❌ Error submitting ticket');
    }
  };

  // Status Handlers
  const handleProgressChange = async (projectId: string, val: number) => {
    try {
      await updateProjectProgress(projectId, val);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProjectStatusToggle = async (projectId: string, currentStatus: Project['status']) => {
    const statuses: Project['status'][] = ['Planning', 'In Progress', 'Completed', 'On Hold'];
    const nextIdx = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    try {
      await updateProjectStatus(projectId, statuses[nextIdx]);
      triggerToast(`Project status updated to: ${statuses[nextIdx]}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTicketStatusChange = async (ticketId: string, nextStatus: Ticket['status']) => {
    try {
      await updateTicketStatus(ticketId, nextStatus);
      triggerToast(`Support ticket status updated to: ${nextStatus}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleTicketPriorityChange = async (ticketId: string, nextPriority: Ticket['priority']) => {
    try {
      await updateTicketPriority(ticketId, nextPriority);
      triggerToast(`Support ticket priority elevated to: ${nextPriority}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('Are you sure you want to delete this client? It will not delete associated projects, but they will become orphaned.')) {
      try {
        await deleteClient(id);
        triggerToast('Client deleted successfully');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        triggerToast('Project deleted');
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDeleteTicket = async (id: string) => {
    if (confirm('Are you sure you want to close/delete this support ticket?')) {
      try {
        await deleteTicket(id);
        triggerToast('Support ticket deleted from queue');
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Dashboard Aggregates
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const activeProjectsCount = projects.filter(p => p.status === 'In Progress').length;
  const completedProjectsCount = projects.filter(p => p.status === 'Completed').length;
  const openTicketsCount = tickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').length;
  
  // Average Progress
  const avgProgress = projects.length > 0 
    ? Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length) 
    : 0;

  // Filtered lists based on simulated client role
  const displayTickets = portalRole === 'Client'
    ? tickets.filter(t => t.clientId === simulatedClientId)
    : tickets;

  const displayProjects = portalRole === 'Client'
    ? projects.filter(p => p.clientId === simulatedClientId)
    : projects;

  if (isAuthLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-gray-50 font-sans">
        <Icon name="Loader2" className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="mt-3 text-xs text-gray-500 font-medium">Verifying secure database keys...</p>
      </div>
    );
  }

  if (!firebaseUser && !bypassAuthForDemo) {
    return (
      <div className="min-h-[85vh] bg-gray-50 flex flex-col items-center justify-center px-4 py-12 font-sans">
        <PortalAuth 
          onAuthSuccess={(user) => {
            triggerToast(`✓ Authenticated as ${user.email}`);
          }} 
          onSandboxSelect={(role, name, email, company, clientId) => {
            const mockUser: any = {
              uid: role === 'Manager' ? 'sandbox_manager_uid' : 'sandbox_client_uid',
              email: email,
              displayName: name,
            };
            const mockProfile: AppUser = {
              uid: mockUser.uid,
              name: name,
              email: email,
              role: role,
              company: company,
              clientId: clientId,
              createdAt: new Date().toISOString()
            };
            setFirebaseUser(mockUser);
            setUserProfile(mockProfile);
            setPortalRole(role);
            if (role === 'Client' && clientId) {
              setSimulatedClientId(clientId);
            }
            triggerToast(`🚀 Authenticated as Sandbox ${role}: ${name}`);
          }}
        />
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setBypassAuthForDemo(true);
              setPortalRole('Manager');
              triggerToast('🚀 Entered Demo Mode (simulation active)');
            }}
            className="text-xs text-gray-400 hover:text-indigo-600 transition-colors font-mono tracking-wider flex items-center justify-center space-x-1 mx-auto"
          >
            <span>Or bypass authentication & try public demo</span>
            <Icon name="ArrowRight" className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      
      {/* Role & Simulator Selector Utility */}
      <div className="bg-indigo-900 text-white px-4 py-3 sm:px-6 lg:px-8 border-b border-indigo-950 flex flex-col md:flex-row items-center justify-between text-xs gap-3">
        {firebaseUser ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-indigo-700 text-[10px] font-bold text-indigo-200">
                {userProfile?.name?.charAt(0) || 'U'}
              </span>
              <span className="font-semibold text-indigo-100">
                Logged in: <span className="text-white">{userProfile?.name || firebaseUser.email}</span> 
                <span className="ml-2 px-1.5 py-0.5 rounded bg-indigo-800 text-[10px] font-mono font-bold text-indigo-300 uppercase">
                  {userProfile?.role || 'Guest'}
                </span>
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="bg-indigo-950 hover:bg-rose-900 text-white font-bold py-1 px-2.5 rounded text-[10px] transition-colors flex items-center space-x-1 border border-indigo-800"
            >
              <Icon name="LogOut" className="h-3 w-3" />
              <span>Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-indigo-200">Demo Simulation Persona:</span>
            <div className="inline-flex rounded-md bg-indigo-800 p-0.5">
              <button
                onClick={() => {
                  setPortalRole('Manager');
                  triggerToast('Switched to manager perspective: access full clients and project database');
                }}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${portalRole === 'Manager' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-200 hover:text-white'}`}
              >
                System Manager (Full Access)
              </button>
              <button
                onClick={() => {
                  setPortalRole('Client');
                  triggerToast('Switched to client perspective: view self records and submit tickets');
                }}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${portalRole === 'Client' ? 'bg-indigo-600 text-white shadow-sm' : 'text-indigo-200 hover:text-white'}`}
              >
                Partner Client View
              </button>
            </div>
          </div>
        )}

        {portalRole === 'Client' && !firebaseUser && clients.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-indigo-200 font-semibold">Acting Client Company:</span>
            <select
              value={simulatedClientId}
              onChange={(e) => {
                setSimulatedClientId(e.target.value);
                triggerToast(`Acting as client: ${clients.find(c => c.id === e.target.value)?.company}`);
              }}
              className="bg-indigo-800 text-white border-none rounded px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-400"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
              ))}
            </select>
          </div>
        )}

        {firebaseUser && userProfile?.role === 'Client' && (
          <div className="text-indigo-200 text-xs flex items-center space-x-1">
            <Icon name="Building" className="h-3.5 w-3.5 text-indigo-400" />
            <span>Organization: <strong className="text-white">{userProfile.company}</strong></span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-indigo-300 font-mono text-[11px]">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          <span>Firestore Real-Time Engine Active</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Left Sub-Sidebar */}
        <div className="lg:w-64 shrink-0">
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-1 shadow-sm sticky top-24">
            <div className="px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-gray-400 font-bold">
              OPERATIONS PORTAL
            </div>
            
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon name="Activity" className={`h-4.5 w-4.5 ${activeTab === 'dashboard' ? 'text-indigo-600' : 'text-gray-400'}`} />
              <span>Status Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'projects' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon name="FolderGit2" className={`h-4.5 w-4.5 ${activeTab === 'projects' ? 'text-indigo-600' : 'text-gray-400'}`} />
              <span>Project Tracker</span>
              <span className="ml-auto bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {displayProjects.length}
              </span>
            </button>

            {portalRole === 'Manager' && (
              <button
                onClick={() => setActiveTab('clients')}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'clients' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <Icon name="Users" className={`h-4.5 w-4.5 ${activeTab === 'clients' ? 'text-indigo-600' : 'text-gray-400'}`} />
                <span>Client Management</span>
                <span className="ml-auto bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {clients.length}
                </span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('tickets')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'tickets' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <Icon name="TicketCheck" className={`h-4.5 w-4.5 ${activeTab === 'tickets' ? 'text-indigo-600' : 'text-gray-400'}`} />
              <span>Real-time Support Desk</span>
              <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-bold ${openTicketsCount > 0 ? 'bg-rose-100 text-rose-600 animate-pulse' : 'bg-gray-100 text-gray-600'}`}>
                {displayTickets.length}
              </span>
            </button>
            
            <div className="pt-4 border-t border-gray-100 mt-4 text-[11px] text-gray-400 px-3 font-sans leading-relaxed">
              Perspective: <strong className="text-gray-700 font-semibold">{portalRole === 'Manager' ? 'Administrator' : 'Partner Client'}</strong>. Actions below write straight to Firestore.
            </div>
          </div>
        </div>

        {/* Right Dynamic Workspace */}
        <div className="flex-1 min-w-0">
          
          {/* Loading Indicator */}
          {isLoading && (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm">
              <Icon name="Loader2" className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
              <p className="mt-3 font-sans text-sm text-gray-500">Listening for real-time Firestore database synchronization...</p>
            </div>
          )}

          {!isLoading && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                
                {/* --------------------- A. TAB: DASHBOARD --------------------- */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6">
                    
                    {/* Welcome banner */}
                    <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-xl p-6 text-white shadow-md relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_300px_at_right_bottom,rgba(255,255,255,0.05),transparent)]"></div>
                      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                          <h1 className="font-sans text-2xl font-bold tracking-tight">
                            {portalRole === 'Manager' ? 'SFR Digital Operations Center' : `Welcome Back, ${clients.find(c => c.id === simulatedClientId)?.company || 'Valued Partner'}`}
                          </h1>
                          <p className="mt-1 font-sans text-sm text-indigo-200">
                            {portalRole === 'Manager' ? 'Real-time aggregated view of your IT firm metrics, contract values, and outstanding engineering tickets.' : 'Monitor your active development progress and coordinate technical ticket queues directly.'}
                          </p>
                        </div>
                        <div className="font-sans text-xs bg-indigo-750/50 border border-indigo-500/30 px-3 py-1.5 rounded-lg flex items-center space-x-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                          <span className="text-indigo-200">Database Active</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs text-gray-500 uppercase tracking-wider font-semibold">Active Projects</span>
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Icon name="FolderGit2" className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-3 flex items-baseline space-x-1.5">
                          <span className="font-sans text-2xl font-black text-gray-900">{activeProjectsCount}</span>
                          <span className="font-sans text-xs text-gray-500">of {projects.length} total</span>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs text-gray-500 uppercase tracking-wider font-semibold">Average Progress</span>
                          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Icon name="TrendingUp" className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="font-sans text-2xl font-black text-gray-900">{avgProgress}%</span>
                          <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${avgProgress}%` }}></div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs text-gray-500 uppercase tracking-wider font-semibold">Support Queue</span>
                          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                            <Icon name="TicketCheck" className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-3 flex items-baseline space-x-1.5">
                          <span className="font-sans text-2xl font-black text-gray-900">{openTicketsCount}</span>
                          <span className="font-sans text-xs text-gray-500">open tickets</span>
                        </div>
                      </div>

                      <div className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm">
                        <div className="flex items-center justify-between">
                          <span className="font-sans text-xs text-gray-500 uppercase tracking-wider font-semibold">Project Valuation</span>
                          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <Icon name="DollarSign" className="h-4 w-4" />
                          </div>
                        </div>
                        <div className="mt-3 flex items-baseline space-x-1.5">
                          <span className="font-sans text-2xl font-black text-gray-900">
                            ${(portalRole === 'Client' ? displayProjects : projects).reduce((sum, p) => sum + p.budget, 0).toLocaleString()}
                          </span>
                          <span className="font-sans text-xs text-gray-500">USD</span>
                        </div>
                      </div>

                    </div>

                    {/* Main Dashboard Section Split */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Projects Overview List */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-gray-900">Active Project Timelines</h2>
                          <button onClick={() => setActiveTab('projects')} className="text-xs text-indigo-600 font-semibold hover:underline">
                            View All Tracker
                          </button>
                        </div>
                        
                        <div className="space-y-4">
                          {displayProjects.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">No projects currently logged.</div>
                          ) : (
                            displayProjects.slice(0, 3).map(p => (
                              <div key={p.id} className="border-b border-gray-100 last:border-none pb-4 last:pb-0">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <h4 className="font-sans text-sm font-bold text-gray-900">{p.name}</h4>
                                    <p className="font-sans text-xs text-gray-500 mt-0.5">{p.clientName}</p>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                                    p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' :
                                    p.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700' :
                                    p.status === 'On Hold' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'
                                  }`}>
                                    {p.status}
                                  </span>
                                </div>
                                <div className="mt-3 flex items-center space-x-4">
                                  <div className="flex-1">
                                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                      <span>Engineering Progress</span>
                                      <span>{p.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                                      <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${p.progress}%` }}></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Hot Real-time Tickets List */}
                      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="font-sans text-sm font-bold uppercase tracking-wider text-gray-900">Hot Tickets Support Feed</h2>
                          <button onClick={() => setActiveTab('tickets')} className="text-xs text-indigo-600 font-semibold hover:underline">
                            Open Support Desk
                          </button>
                        </div>

                        <div className="space-y-4">
                          {displayTickets.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">No support tickets currently.</div>
                          ) : (
                            displayTickets.slice(0, 3).map(t => (
                              <div key={t.id} className="flex items-start justify-between border-b border-gray-100 last:border-none pb-4 last:pb-0">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-sans text-sm font-bold text-gray-900 truncate max-w-[180px]">{t.title}</h4>
                                    <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold uppercase ${
                                      t.priority === 'Critical' ? 'bg-rose-100 text-rose-700 animate-pulse' :
                                      t.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                                      t.priority === 'Medium' ? 'bg-amber-50 text-amber-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                      {t.priority}
                                    </span>
                                  </div>
                                  <p className="font-sans text-xs text-gray-500 line-clamp-1">{t.description}</p>
                                  <span className="inline-block font-sans text-[10px] text-gray-400">Created by {t.creatorName}</span>
                                </div>
                                
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                                  t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700' :
                                  t.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700' :
                                  t.status === 'Open' ? 'bg-sky-50 text-sky-700' : 'bg-gray-100 text-gray-700'
                                }`}>
                                  {t.status}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* --------------------- B. TAB: PROJECTS --------------------- */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="font-sans text-xl font-bold text-gray-900">Project Strategy Tracking</h2>
                        <p className="font-sans text-sm text-gray-500">Live tracker connecting contract budgets and milestones back to clients.</p>
                      </div>
                      
                      {portalRole === 'Manager' && (
                        <button
                          onClick={() => {
                            if (clients.length === 0) {
                              triggerToast('⚠️ You need to add at least one client first before mapping projects!');
                              return;
                            }
                            setShowProjectForm(!showProjectForm);
                          }}
                          className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition"
                        >
                          <Icon name="Plus" className="h-4 w-4" />
                          <span>Log Project</span>
                        </button>
                      )}
                    </div>

                    {/* Add Project Form Collapsible */}
                    {showProjectForm && (
                      <motion.form 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        onSubmit={handleAddProject}
                        className="bg-white border border-indigo-100 p-6 rounded-xl shadow-md space-y-4 overflow-hidden"
                      >
                        <h3 className="font-sans text-sm font-bold uppercase text-indigo-700">Add New Contract Project</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Project Name *</label>
                            <input
                              type="text"
                              required
                              value={newProject.name}
                              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                              placeholder="e.g. ERP Redesign"
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Assigned Partner Client *</label>
                            <select
                              required
                              value={newProject.clientId}
                              onChange={(e) => setNewProject({ ...newProject, clientId: e.target.value })}
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="">-- Choose Client Company --</option>
                              {clients.map(c => (
                                <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                              ))}
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600">Scope Description</label>
                            <textarea
                              rows={2}
                              value={newProject.description}
                              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                              placeholder="Define the sprint milestones, features, and key delivery pipelines..."
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Project Stage</label>
                            <select
                              value={newProject.status}
                              onChange={(e) => setNewProject({ ...newProject, status: e.target.value as Project['status'] })}
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="Planning">Planning</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                              <option value="On Hold">On Hold</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Initial Progress ({newProject.progress}%)</label>
                            <input
                              type="range"
                              min="0"
                              max="100"
                              value={newProject.progress}
                              onChange={(e) => setNewProject({ ...newProject, progress: Number(e.target.value) })}
                              className="mt-2.5 w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Budget Estimate (USD) *</label>
                            <input
                              type="number"
                              required
                              value={newProject.budget}
                              onChange={(e) => setNewProject({ ...newProject, budget: Number(e.target.value) })}
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Start / End Dates</label>
                            <div className="flex gap-2">
                              <input
                                type="date"
                                value={newProject.startDate}
                                onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                                className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
                              />
                              <input
                                type="date"
                                value={newProject.endDate}
                                onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                                className="mt-1 w-full bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowProjectForm(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            Save Contract Project
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* Projects Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {displayProjects.length === 0 ? (
                        <div className="md:col-span-2 text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-400">
                          <Icon name="FolderGit2" className="h-8 w-8 mx-auto text-gray-300" />
                          <p className="mt-2 text-sm">No contract projects matching this persona.</p>
                        </div>
                      ) : (
                        displayProjects.map(p => (
                          <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h3 className="font-sans text-md font-bold text-gray-900 leading-tight">{p.name}</h3>
                                <p className="font-sans text-xs text-indigo-600 font-medium mt-0.5">{p.clientName}</p>
                              </div>
                              
                              <div className="flex items-center space-x-1.5">
                                <button
                                  onClick={() => handleProjectStatusToggle(p.id, p.status)}
                                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all border ${
                                    p.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                    p.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                    p.status === 'On Hold' ? 'bg-amber-50 text-amber-700 border-amber-100' : 
                                    'bg-gray-100 text-gray-700 border-gray-200'
                                  }`}
                                  title="Click to cycle status"
                                >
                                  {p.status}
                                </button>
                                
                                {portalRole === 'Manager' && (
                                  <button
                                    onClick={() => handleDeleteProject(p.id)}
                                    className="text-gray-400 hover:text-rose-600 p-1"
                                    title="Delete Project"
                                  >
                                    <Icon name="Trash2" className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </div>

                            <p className="font-sans text-xs text-gray-600 leading-relaxed min-h-[40px]">
                              {p.description || 'No detailed scope written yet. Use the system logger to populate sprints.'}
                            </p>

                            {/* Slider for Progress */}
                            <div className="space-y-1 bg-gray-50 p-3.5 rounded-lg border border-gray-150">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-sans text-gray-500 font-medium">Sprint Completion:</span>
                                <span className="font-mono font-bold text-gray-800">{p.progress}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={p.progress}
                                onChange={(e) => handleProgressChange(p.id, Number(e.target.value))}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                title="Drag to adjust real-time progress"
                              />
                            </div>

                            <div className="flex items-center justify-between font-sans text-xs text-gray-500 pt-2 border-t border-gray-100">
                              <span className="flex items-center">
                                <Icon name="DollarSign" className="h-3.5 w-3.5 text-gray-400 mr-0.5" />
                                <strong className="text-gray-700 font-semibold">${p.budget.toLocaleString()}</strong>
                              </span>
                              <span className="flex items-center">
                                <Icon name="Calendar" className="h-3.5 w-3.5 text-gray-400 mr-1" />
                                <span>Due {p.endDate}</span>
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* --------------------- C. TAB: CLIENTS --------------------- */}
                {activeTab === 'clients' && portalRole === 'Manager' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="font-sans text-xl font-bold text-gray-900">Partner Client Directory</h2>
                        <p className="font-sans text-sm text-gray-500">Track and manage active client relationships and support permissions.</p>
                      </div>
                      
                      <button
                        onClick={() => setShowClientForm(!showClientForm)}
                        className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition"
                      >
                        <Icon name="Plus" className="h-4 w-4" />
                        <span>Register Client</span>
                      </button>
                    </div>

                    {/* Add Client Form Collapsible */}
                    {showClientForm && (
                      <motion.form 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        onSubmit={handleAddClient}
                        className="bg-white border border-indigo-100 p-6 rounded-xl shadow-md space-y-4 overflow-hidden"
                      >
                        <h3 className="font-sans text-sm font-bold uppercase text-indigo-700">Add New Client Partner</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Company Name *</label>
                            <input
                              type="text"
                              required
                              value={newClient.company}
                              onChange={(e) => setNewClient({ ...newClient, company: e.target.value })}
                              placeholder="e.g. Nexus Corp"
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Contact Person *</label>
                            <input
                              type="text"
                              required
                              value={newClient.name}
                              onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                              placeholder="e.g. Rachel Green"
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Work Email *</label>
                            <input
                              type="email"
                              required
                              value={newClient.email}
                              onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                              placeholder="rachel@nexus.com"
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Contact Phone</label>
                            <input
                              type="tel"
                              value={newClient.phone}
                              onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                              placeholder="+1 (555) 123-4567"
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Lead Status</label>
                            <select
                              value={newClient.status}
                              onChange={(e) => setNewClient({ ...newClient, status: e.target.value as Client['status'] })}
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="Active">Active Relationship</option>
                              <option value="Lead">Lead Target</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowClientForm(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            Register Partner
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* Clients Directory Table / Cards */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 font-sans text-xs uppercase text-gray-500 tracking-wider">
                              <th className="p-4 font-bold">Client / Company</th>
                              <th className="p-4 font-bold">Contact Email</th>
                              <th className="p-4 font-bold">Phone Number</th>
                              <th className="p-4 font-bold">Status</th>
                              <th className="p-4 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clients.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="text-center p-8 text-gray-400 text-sm">
                                  No client partners mapped. Register your first relationship!
                                </td>
                              </tr>
                            ) : (
                              clients.map(c => (
                                <tr key={c.id} className="border-b border-gray-100 last:border-none hover:bg-gray-50/50 transition-colors">
                                  <td className="p-4">
                                    <div className="font-sans text-sm font-bold text-gray-900">{c.company}</div>
                                    <div className="font-sans text-xs text-gray-500">{c.name}</div>
                                  </td>
                                  <td className="p-4 font-sans text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Icon name="Mail" className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                      <span>{c.email}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 font-sans text-sm text-gray-500">
                                    {c.phone ? (
                                      <div className="flex items-center space-x-1">
                                        <Icon name="Phone" className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                        <span>{c.phone}</span>
                                      </div>
                                    ) : '—'}
                                  </td>
                                  <td className="p-4">
                                    <select
                                      value={c.status}
                                      onChange={(e) => updateClientStatus(c.id, e.target.value as Client['status'])}
                                      className={`px-2 py-1 rounded text-xs font-semibold focus:outline-none border ${
                                        c.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        c.status === 'Lead' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                        'bg-gray-50 text-gray-500 border-gray-200'
                                      }`}
                                    >
                                      <option value="Active">Active</option>
                                      <option value="Lead">Lead</option>
                                      <option value="Inactive">Inactive</option>
                                    </select>
                                  </td>
                                  <td className="p-4 text-right">
                                    <button
                                      onClick={() => handleDeleteClient(c.id)}
                                      className="text-gray-400 hover:text-rose-600 p-1"
                                      title="Remove Client"
                                    >
                                      <Icon name="Trash2" className="h-4.5 w-4.5" />
                                    </button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* --------------------- D. TAB: TICKETS (Real-time) --------------------- */}
                {activeTab === 'tickets' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h2 className="font-sans text-xl font-bold text-gray-900">
                          {portalRole === 'Client' ? 'Submit Support & Maintenance Request' : 'Active Support Service Desk'}
                        </h2>
                        <p className="font-sans text-sm text-gray-500">
                          {portalRole === 'Client' ? 'File immediate incident tickets. Your request syncs instantly with engineers.' : 'Real-time client request queue. Triage tickets and log SLA updates.'}
                        </p>
                      </div>
                      
                      <button
                        onClick={() => {
                          if (portalRole === 'Manager' && clients.length === 0) {
                            triggerToast('⚠️ Register a client partner first!');
                            return;
                          }
                          setShowTicketForm(!showTicketForm);
                        }}
                        className="flex items-center space-x-1.5 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold hover:bg-indigo-700 transition"
                      >
                        <Icon name="Plus" className="h-4 w-4" />
                        <span>Open Ticket</span>
                      </button>
                    </div>

                    {/* Add Ticket Form Collapsible */}
                    {showTicketForm && (
                      <motion.form 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        onSubmit={handleAddTicket}
                        className="bg-white border border-indigo-100 p-6 rounded-xl shadow-md space-y-4 overflow-hidden"
                      >
                        <h3 className="font-sans text-sm font-bold uppercase text-indigo-700">Submit Real-time support Ticket</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600">Ticket Title / Summary *</label>
                            <input
                              type="text"
                              required
                              value={newTicket.title}
                              onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                              placeholder="e.g. Ingress gateway returning 502 bad gateway error"
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                          
                          {portalRole === 'Manager' && (
                            <div>
                              <label className="block text-xs font-semibold text-gray-600">Reporting Client Partner *</label>
                              <select
                                required
                                value={newTicket.clientId}
                                onChange={(e) => setNewTicket({ ...newTicket, clientId: e.target.value })}
                                className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                              >
                                <option value="">-- Choose Partner Company --</option>
                                {clients.map(c => (
                                  <option key={c.id} value={c.id}>{c.company} ({c.name})</option>
                                ))}
                              </select>
                            </div>
                          )}

                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Related Project (Optional)</label>
                            <select
                              value={newTicket.projectId}
                              onChange={(e) => setNewTicket({ ...newTicket, projectId: e.target.value })}
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="">-- Choose Associated Project --</option>
                              {displayProjects.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-gray-600">Urgency Level</label>
                            <select
                              value={newTicket.priority}
                              onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as Ticket['priority'] })}
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="Low">Low - Improvement / Query</option>
                              <option value="Medium">Medium - Regular Issue</option>
                              <option value="High">High - Impeding Progress</option>
                              <option value="Critical">Critical - Production Down / Urgent</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-600">Detailed Issue Logs / Steps to reproduce *</label>
                            <textarea
                              rows={3}
                              required
                              value={newTicket.description}
                              onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                              placeholder="Provide console crash logs, stack traces, and precise replication steps..."
                              className="mt-1 w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>
                        </div>
                        <div className="flex justify-end space-x-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setShowTicketForm(false)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                          >
                            Broadcast Ticket
                          </button>
                        </div>
                      </motion.form>
                    )}

                    {/* Support Tickets Queue */}
                    <div className="space-y-4">
                      {displayTickets.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-200 text-gray-400">
                          <Icon name="TicketCheck" className="h-8 w-8 mx-auto text-gray-300" />
                          <p className="mt-2 text-sm">No support tickets lodged in this perspective view.</p>
                        </div>
                      ) : (
                        displayTickets.map(t => {
                          const clientRef = clients.find(c => c.id === t.clientId);
                          const projectRef = projects.find(p => p.id === t.projectId);
                          
                          return (
                            <div 
                              key={t.id} 
                              className={`bg-white border rounded-xl p-5 shadow-sm transition-all relative overflow-hidden ${
                                t.status === 'Open' ? 'border-sky-200/50 bg-sky-50/5' :
                                t.status === 'In Progress' ? 'border-indigo-100' :
                                'border-gray-200/60 bg-gray-50/30'
                              }`}
                            >
                              {/* Ticket Header */}
                              <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                                <div className="space-y-1">
                                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                                    <span className="font-mono text-[9px] font-bold text-gray-400">ID: {t.id}</span>
                                    <h3 className="font-sans text-sm font-bold text-gray-900 leading-snug">{t.title}</h3>
                                    
                                    <span className={`px-1.5 py-0.5 text-[9px] rounded font-bold uppercase leading-none ${
                                      t.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                                      t.priority === 'High' ? 'bg-rose-100 text-rose-700' :
                                      t.priority === 'Medium' ? 'bg-amber-100 text-amber-700' :
                                      'bg-gray-100 text-gray-700'
                                    }`}>
                                      {t.priority}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2 text-[11px] text-gray-500 font-sans flex-wrap gap-y-1">
                                    <span>Client: <strong>{clientRef?.company || 'Unknown Client'}</strong></span>
                                    <span>•</span>
                                    <span>Project: <strong>{projectRef?.name || 'Ad-Hoc Support'}</strong></span>
                                    <span>•</span>
                                    <span>Reporter: <strong>{t.creatorName} ({t.creatorRole})</strong></span>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-2 font-sans text-xs shrink-0 self-start sm:self-center">
                                  <span className="text-gray-400">Triage:</span>
                                  
                                  {/* Select for Status */}
                                  <select
                                    value={t.status}
                                    onChange={(e) => handleTicketStatusChange(t.id, e.target.value as Ticket['status'])}
                                    className={`px-2.5 py-1 rounded text-xs font-semibold border focus:outline-none ${
                                      t.status === 'Resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                      t.status === 'In Progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                                      t.status === 'Open' ? 'bg-sky-50 text-sky-750 border-sky-200' :
                                      'bg-gray-150 text-gray-500 border-gray-300'
                                    }`}
                                  >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                    <option value="Closed">Closed</option>
                                  </select>

                                  <button
                                    onClick={() => handleDeleteTicket(t.id)}
                                    className="text-gray-400 hover:text-rose-600 p-1"
                                    title="Close/Archive Ticket"
                                  >
                                    <Icon name="Trash2" className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>

                              {/* Ticket Body Description */}
                              <div className="mt-3.5 bg-gray-50/70 p-4 rounded-lg border border-gray-100 text-xs text-gray-700 font-sans leading-relaxed whitespace-pre-wrap">
                                {t.description}
                              </div>

                              {/* Timeline and Updates Footer */}
                              <div className="mt-3.5 flex justify-between items-center text-[10px] text-gray-400 font-mono">
                                <span className="flex items-center">
                                  <Icon name="Clock" className="h-3.5 w-3.5 text-gray-300 mr-1" />
                                  <span>Logged: {new Date(t.createdAt).toLocaleString()}</span>
                                </span>
                                
                                <div className="flex items-center space-x-1.5 text-indigo-500 font-semibold font-sans">
                                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
                                  <span>Sync: Real-time update enabled</span>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          )}

        </div>
      </div>

      {/* Floating Interactive Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 bg-gray-900 border border-gray-800 text-white px-5 py-3.5 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-sans"
          >
            <span className="font-semibold text-indigo-400">{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
