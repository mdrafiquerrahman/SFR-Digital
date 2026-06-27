import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { auth } from '../firebase';
import { createUserProfile, addClient, addProject, getUserProfile } from '../dbService';
import Icon from './Icon';

interface PortalAuthProps {
  onAuthSuccess: (user: any) => void;
  onSandboxSelect?: (role: 'Client' | 'Manager', name: string, email: string, company?: string, clientId?: string) => void;
}

export default function PortalAuth({ onAuthSuccess, onSandboxSelect }: PortalAuthProps) {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [role, setRole] = useState<'Client' | 'Manager'>('Client');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isOperationNotAllowed, setIsOperationNotAllowed] = useState<boolean>(false);

  // Form Fields
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [adminPasscode, setAdminPasscode] = useState<string>('');

  // Pending Google registration states
  const [pendingGoogleUser, setPendingGoogleUser] = useState<any | null>(null);

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsOperationNotAllowed(false);
    setIsLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;
      
      // Check if user profile already exists
      const existingProfile = await getUserProfile(user.uid);
      if (existingProfile) {
        onAuthSuccess(user);
      } else {
        // Prompt them to complete registration
        setPendingGoogleUser(user);
        setName(user.displayName || '');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/operation-not-allowed') {
        setIsOperationNotAllowed(true);
      }
      const details = err.message || err.code || String(err);
      setErrorMsg(`Google Authentication failed. Details: ${details}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePendingGoogleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingGoogleUser) return;
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const uid = pendingGoogleUser.uid;
      const userEmail = pendingGoogleUser.email || '';

      if (role === 'Client') {
        if (!company) {
          setErrorMsg('Please enter your organization or company name.');
          setIsLoading(false);
          return;
        }

        const clientId = `client_user_${uid}`;
        await addClient({
          name: name || pendingGoogleUser.displayName || 'Google Partner',
          company,
          email: userEmail,
          phone: phone || 'Not Provided',
          status: 'Active'
        });

        await addProject({
          name: 'Cloud Architecture & Security Setup',
          clientId: clientId,
          clientName: company,
          description: 'Implementation of custom zero-trust microsegmentation, Kubernetes clustering, and automated compliance guardrails.',
          status: 'In Progress',
          progress: 25,
          budget: 35000,
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        });

        await createUserProfile(uid, {
          name: name || pendingGoogleUser.displayName || 'Google Partner',
          email: userEmail,
          role: 'Client',
          company: company,
          clientId: clientId
        });
      } else {
        // Manager role
        if (adminPasscode !== 'SAFIQ2026') {
          setErrorMsg('Invalid System Manager registration passcode. Use "SAFIQ2026" for validation.');
          setIsLoading(false);
          return;
        }

        await createUserProfile(uid, {
          name: name || pendingGoogleUser.displayName || 'Google Partner',
          email: userEmail,
          role: 'Manager'
        });
      }

      onAuthSuccess(pendingGoogleUser);
    } catch (err: any) {
      console.error(err);
      const details = err.message || err.code || String(err);
      setErrorMsg(`Failed to finalize profile. Details: ${details}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (!email || !password) {
      setErrorMsg('Please enter email and password.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        // Handle Login
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        onAuthSuccess(userCredential.user);
      } else {
        // Handle Signup
        if (!name) {
          setErrorMsg('Please enter your full name.');
          setIsLoading(false);
          return;
        }

        if (role === 'Client' && !company) {
          setErrorMsg('Please enter your organization or company name.');
          setIsLoading(false);
          return;
        }

        if (role === 'Manager') {
          // Verify passcode
          if (adminPasscode !== 'SAFIQ2026') {
            setErrorMsg('Invalid System Manager registration passcode. Use "SAFIQ2026" for validation.');
            setIsLoading(false);
            return;
          }
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        const uid = userCredential.user.uid;

        if (role === 'Client') {
          const clientId = `client_user_${uid}`;
          
          // 1. Create client document directly in clients collection
          await addClient({
            name,
            company,
            email: email.trim(),
            phone: phone || 'Not Provided',
            status: 'Active'
          });

          // Override the default random client id with a deterministic one to map accurately
          // Or we can let it write to user Profile and preseed a custom project
          const userCompany = company;

          // 2. Add an interactive cloud project automatically so they have active metrics
          await addProject({
            name: 'Cloud Architecture & Security Setup',
            clientId: clientId,
            clientName: userCompany,
            description: 'Implementation of custom zero-trust microsegmentation, Kubernetes clustering, and automated compliance guardrails.',
            status: 'In Progress',
            progress: 25,
            budget: 35000,
            startDate: new Date().toISOString().split('T')[0],
            endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          });

          // 3. Create the auth user profile document
          await createUserProfile(uid, {
            name,
            email: email.trim(),
            role: 'Client',
            company: userCompany,
            clientId: clientId
          });

        } else {
          // Register manager
          await createUserProfile(uid, {
            name,
            email: email.trim(),
            role: 'Manager'
          });
        }

        onAuthSuccess(userCredential.user);
      }
    } catch (err: any) {
      console.error(err);
      let friendlyError = 'An error occurred during authentication.';
      if (err.code === 'auth/operation-not-allowed') {
        setIsOperationNotAllowed(true);
        friendlyError = 'Email/Password registration is disabled in Firebase.';
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        friendlyError = 'Incorrect email or password. Please try again.';
      } else if (err.code === 'auth/email-already-in-use') {
        friendlyError = 'This email address is already registered.';
      } else if (err.code === 'auth/invalid-email') {
        friendlyError = 'Invalid email address format.';
      }
      // Include the actual error code or message for transparent debugging
      const details = err.message || err.code || String(err);
      setErrorMsg(`${friendlyError} Details: ${details}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden font-sans">
      <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 p-8 text-white text-center relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_300px_at_top_right,rgba(99,102,241,0.15),transparent)]"></div>
        <div className="relative z-10">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 mb-4 shadow-inner">
            <Icon name="Cpu" className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight uppercase">SAFIQ<span className="text-indigo-400">TECH</span> PORTAL</h2>
          <p className="mt-1.5 text-xs text-indigo-200/80 tracking-wide">
            Secure enterprise access gateway for partners and system architects.
          </p>
        </div>
      </div>

      <div className="p-8">
        {pendingGoogleUser ? (
          // Pending Google Registration completion form
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-900 leading-relaxed mb-4">
              <div className="font-bold text-indigo-950 flex items-center space-x-1.5 mb-1">
                <Icon name="UserCheck" className="h-4 w-4 text-indigo-600" />
                <span>Enterprise Profile Setup</span>
              </div>
              <p>
                Successfully logged in with Google as <strong className="font-semibold text-indigo-950">{pendingGoogleUser.email}</strong>. Please complete your registration details to gain customized workspace access.
              </p>
            </div>

            {errorMsg && (
              <div className="p-3.5 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs rounded-r-lg font-medium leading-relaxed flex items-start space-x-2">
                <Icon name="AlertTriangle" className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handlePendingGoogleRegister} className="space-y-4">
              {/* Role selection */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Role</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('Client')}
                    className={`py-2 px-3 text-xs font-bold border rounded-lg transition-all flex items-center justify-center space-x-1.5 ${role === 'Client' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold' : 'border-gray-250 hover:bg-gray-50 text-gray-600'}`}
                  >
                    <Icon name="Users" className="h-3.5 w-3.5" />
                    <span>Partner Client</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Manager')}
                    className={`py-2 px-3 text-xs font-bold border rounded-lg transition-all flex items-center justify-center space-x-1.5 ${role === 'Manager' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold' : 'border-gray-250 hover:bg-gray-50 text-gray-600'}`}
                  >
                    <Icon name="Settings" className="h-3.5 w-3.5" />
                    <span>System Manager</span>
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Icon name="User" className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Connor"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs border border-gray-250 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                  />
                </div>
              </div>

              {/* Company for Client */}
              {role === 'Client' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Company / Organization</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <Icon name="Building" className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cyberdyne Systems"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs border border-gray-250 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Phone for Client */}
              {role === 'Client' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number (Optional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <Icon name="Phone" className="h-4 w-4" />
                    </span>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs border border-gray-250 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Passcode for Admin */}
              {role === 'Manager' && (
                <div className="space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold text-amber-800 uppercase tracking-wider">Manager Access Key</label>
                    <span className="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">Hint: SAFIQ2026</span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <Icon name="KeyRound" className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="Enter System Manager Key"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs border border-amber-200 bg-white rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 mt-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:bg-indigo-400 disabled:scale-100 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 animate-spin text-white" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <Icon name="UserCheck" className="h-4 w-4 text-white" />
                    <span>Initialize Enterprise Profile</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setPendingGoogleUser(null);
                  setErrorMsg(null);
                }}
                className="w-full text-center text-xs text-gray-500 hover:text-indigo-600 transition-colors font-medium mt-2 block"
              >
                Cancel and use different account
              </button>
            </form>
          </div>
        ) : (
          // Normal Registration/Login Form
          <>
            {/* Instant Sandbox Access Panel */}
            {onSandboxSelect && (
              <div className="mb-6 p-4 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-950 flex flex-col space-y-3">
                <div className="flex items-center space-x-2 font-bold text-indigo-950">
                  <Icon name="Cpu" className="h-4.5 w-4.5 text-indigo-600 animate-pulse" />
                  <span>Sandbox Environment (Bypass Auth)</span>
                </div>
                <p className="text-[11px] text-indigo-800 leading-normal">
                  Email/Password provider might be disabled in Firebase console. Skip auth setup and instantly log in to either portal view with live simulated client or manager workspace data.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onSandboxSelect('Client', 'Sarah Connor', 'sarah.connor@cyberdyne.com', 'Cyberdyne Systems', 'client_brightbuild');
                    }}
                    className="py-2 px-3 bg-indigo-600 hover:bg-indigo-750 text-white font-bold text-[11px] rounded-lg transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
                  >
                    <Icon name="Users" className="h-3.5 w-3.5" />
                    <span>Client Portal Demo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onSandboxSelect('Manager', 'Alex Mercer', 'alex.mercer@safiqtech.com');
                    }}
                    className="py-2 px-3 bg-slate-800 hover:bg-slate-900 text-white font-bold text-[11px] rounded-lg transition-all flex items-center justify-center space-x-1.5 shadow-sm active:scale-95"
                  >
                    <Icon name="Settings" className="h-3.5 w-3.5" />
                    <span>Manager Portal Demo</span>
                  </button>
                </div>
              </div>
            )}

            {/* Toggle between login and registration */}
            <div className="grid grid-cols-2 bg-gray-100 rounded-lg p-1 mb-6 border border-gray-150">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setErrorMsg(null);
                }}
                className={`py-2 text-xs font-bold rounded-md transition-all ${isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Portal Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setErrorMsg(null);
                }}
                className={`py-2 text-xs font-bold rounded-md transition-all ${!isLogin ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                Create Account
              </button>
            </div>

            {isOperationNotAllowed && (
              <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-950 text-xs rounded-xl font-medium leading-relaxed flex flex-col space-y-2.5 animate-fadeIn">
                <div className="flex items-center space-x-2 font-bold text-amber-900 text-sm">
                  <Icon name="AlertTriangle" className="h-5 w-5 text-amber-600 shrink-0" />
                  <span>Firebase Email Provider Disabled</span>
                </div>
                <p className="text-[11px]">
                  The <strong>Email/Password</strong> provider is disabled in this project's Firebase authentication console. Follow these steps to enable it:
                </p>
                <ol className="list-decimal list-inside space-y-1.5 text-[11px] text-amber-900 ml-1">
                  <li>Navigate to the <a href="https://console.firebase.google.com/project/gen-lang-client-0580561052/authentication/providers" target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-bold inline-flex items-center space-x-1"><span>Firebase Console</span><Icon name="ExternalLink" className="h-3 w-3 inline" /></a>.</li>
                  <li>Click <strong>Add new provider</strong> and choose <strong>Email/Password</strong>.</li>
                  <li>Toggle the first switch to <strong>Enable</strong>, then hit <strong>Save</strong>.</li>
                </ol>
                <div className="pt-2 border-t border-amber-200 flex flex-col space-y-2">
                  <span className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">Fast Out-of-the-Box Alternatives:</span>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-2 px-3 bg-white hover:bg-amber-100/50 border border-amber-200 text-amber-950 font-bold text-[11px] rounded-lg transition-colors flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <Icon name="Globe" className="h-3.5 w-3.5 text-amber-600" />
                    <span>Authenticate via Google Sign-In</span>
                  </button>
                </div>
              </div>
            )}

            {errorMsg && !isOperationNotAllowed && (
              <div className="mb-5 p-3.5 bg-rose-50 border-l-4 border-rose-500 text-rose-700 text-xs rounded-r-lg font-medium leading-relaxed flex items-start space-x-2">
                <Icon name="AlertTriangle" className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {/* Sign Up role selection */}
              {!isLogin && (
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Account Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('Client')}
                      className={`py-2 px-3 text-xs font-bold border rounded-lg transition-all flex items-center justify-center space-x-1.5 ${role === 'Client' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold' : 'border-gray-250 hover:bg-gray-50 text-gray-600'}`}
                    >
                      <Icon name="Users" className="h-3.5 w-3.5" />
                      <span>Partner Client</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('Manager')}
                      className={`py-2 px-3 text-xs font-bold border rounded-lg transition-all flex items-center justify-center space-x-1.5 ${role === 'Manager' ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-semibold' : 'border-gray-250 hover:bg-gray-50 text-gray-600'}`}
                    >
                      <Icon name="Settings" className="h-3.5 w-3.5" />
                      <span>System Manager</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Full Name for Signup */}
              {!isLogin && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <Icon name="User" className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Connor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs border border-gray-250 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Company for Client Signup */}
              {!isLogin && role === 'Client' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Company / Organization</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <Icon name="Building" className="h-4 w-4" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cyberdyne Systems"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs border border-gray-250 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Phone for Client Signup (Optional) */}
              {!isLogin && role === 'Client' && (
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Phone Number (Optional)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <Icon name="Phone" className="h-4 w-4" />
                    </span>
                    <input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs border border-gray-250 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Passcode for Admin Signup */}
              {!isLogin && role === 'Manager' && (
                <div className="space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-100">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-[11px] font-bold text-amber-800 uppercase tracking-wider">Manager Access Key</label>
                    <span className="text-[10px] text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded font-mono font-bold">Hint: SAFIQ2026</span>
                  </div>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                      <Icon name="KeyRound" className="h-4 w-4" />
                    </span>
                    <input
                      type="password"
                      required
                      placeholder="Enter System Manager Key"
                      value={adminPasscode}
                      onChange={(e) => setAdminPasscode(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs border border-amber-200 bg-white rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Icon name="Mail" className="h-4 w-4" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs border border-gray-250 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                    <Icon name="Lock" className="h-4 w-4" />
                  </span>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-xs border border-gray-250 rounded-lg focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-gray-800"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 mt-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:bg-indigo-400 disabled:scale-100 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Icon name="Loader2" className="h-4 w-4 animate-spin text-white" />
                    <span>Synchronizing...</span>
                  </>
                ) : (
                  <>
                    <Icon name={isLogin ? 'LogIn' : 'UserPlus'} className="h-4 w-4 text-white" />
                    <span>{isLogin ? 'Authenticate Workspace' : 'Initialize Enterprise Profile'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-wider">
                <span className="bg-white px-3 text-gray-400">Or authenticate via</span>
              </div>
            </div>

            {/* Google Sign-In button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full py-2.5 px-4 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold text-xs shadow-sm active:scale-[0.98] transition-all flex items-center justify-center space-x-2.5 disabled:opacity-50"
            >
              <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.62 0 3.08.56 4.22 1.65l3.15-3.15C17.45 1.84 14.93 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.85 3C6.3 7.55 8.95 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.25c0-.82-.07-1.61-.21-2.38H12v4.5h6.48c-.28 1.48-1.11 2.73-2.36 3.58l3.66 2.84c2.14-1.98 3.72-4.88 3.72-8.54z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.35 14.5c-.25-.75-.39-1.55-.39-2.38s.14-1.63.39-2.38L1.5 6.74C.55 8.64 0 10.76 0 13s.55 4.36 1.5 6.26l3.85-3.76z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.08 7.96-2.91l-3.66-2.84c-1.01.68-2.32 1.09-3.8 1.09-3.05 0-5.7-2.51-6.65-5.46L1.5 16.64C3.4 20.35 7.35 23 12 23z"
                />
              </svg>
              <span>Sign In with Google Enterprise</span>
            </button>

            <div className="mt-6 pt-5 border-t border-gray-100 text-center text-[10px] text-gray-400 font-mono">
              {isLogin ? (
                <p>
                  New partner?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setErrorMsg(null);
                    }}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Create an enterprise account
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setErrorMsg(null);
                    }}
                    className="text-indigo-600 hover:underline font-semibold"
                  >
                    Sign in with existing credential
                  </button>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
