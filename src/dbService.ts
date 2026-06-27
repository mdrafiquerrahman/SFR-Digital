import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit,
  writeBatch
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { Client, Project, Ticket, AppUser } from './types';
import { SEED_CLIENTS, SEED_PROJECTS, SEED_TICKETS } from './data';

// --- Error Handling & ABAC Zero-Trust Telemetry Enforcer ---
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to check if database is empty and seed initial data if so
export async function seedDatabaseIfEmpty() {
  const pathForCheck = 'clients';
  try {
    const clientsRef = collection(db, pathForCheck);
    const snapshot = await getDocs(query(clientsRef, limit(1)));
    
    if (snapshot.empty) {
      console.log('No clients found in Firestore. Seeding database with professional portfolios...');
      
      const batch = writeBatch(db);
      
      // Seed clients
      for (const client of SEED_CLIENTS) {
        const clientDocRef = doc(db, 'clients', client.id);
        batch.set(clientDocRef, client);
      }
      
      // Seed projects
      for (const project of SEED_PROJECTS) {
        const projectDocRef = doc(db, 'projects', project.id);
        batch.set(projectDocRef, project);
      }
      
      // Seed tickets
      for (const ticket of SEED_TICKETS) {
        const ticketDocRef = doc(db, 'tickets', ticket.id);
        batch.set(ticketDocRef, ticket);
      }
      
      try {
        await batch.commit();
        console.log('Database seeded successfully!');
        return true;
      } catch (batchErr) {
        handleFirestoreError(batchErr, OperationType.WRITE, 'batch_seed');
      }
    }
    return false;
  } catch (err) {
    // If it's already an error containing our JSON structure, rethrow it
    if (err instanceof Error && err.message.startsWith('{')) {
      throw err;
    }
    handleFirestoreError(err, OperationType.GET, pathForCheck);
  }
}

// 1. Client Real-time Subscriptions & Mutations
export function subscribeToClients(callback: (clients: Client[]) => void) {
  const path = 'clients';
  const clientsRef = collection(db, path);
  const q = query(clientsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const clients: Client[] = [];
    snapshot.forEach((doc) => {
      clients.push({ id: doc.id, ...doc.data() } as Client);
    });
    callback(clients);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function addClient(clientData: Omit<Client, 'id' | 'createdAt'>): Promise<string> {
  const path = 'clients';
  const id = 'client_' + Math.random().toString(36).substr(2, 9);
  const client: Client = {
    ...clientData,
    id,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, path, id), client);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
  }
}

export async function updateClientStatus(id: string, status: Client['status']) {
  const path = `clients/${id}`;
  const clientRef = doc(db, 'clients', id);
  try {
    await updateDoc(clientRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteClient(id: string) {
  const path = `clients/${id}`;
  try {
    await deleteDoc(doc(db, 'clients', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 2. Project Real-time Subscriptions & Mutations
export function subscribeToProjects(callback: (projects: Project[]) => void) {
  const path = 'projects';
  const projectsRef = collection(db, path);
  const q = query(projectsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const projects: Project[] = [];
    snapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() } as Project);
    });
    callback(projects);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function addProject(projectData: Omit<Project, 'id' | 'createdAt'>): Promise<string> {
  const path = 'projects';
  const id = 'proj_' + Math.random().toString(36).substr(2, 9);
  const project: Project = {
    ...projectData,
    id,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, path, id), project);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
  }
}

export async function updateProjectProgress(id: string, progress: number) {
  const path = `projects/${id}`;
  const projectRef = doc(db, 'projects', id);
  try {
    await updateDoc(projectRef, { progress: Math.max(0, Math.min(100, progress)) });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateProjectStatus(id: string, status: Project['status']) {
  const path = `projects/${id}`;
  const projectRef = doc(db, 'projects', id);
  try {
    await updateDoc(projectRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteProject(id: string) {
  const path = `projects/${id}`;
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 3. Ticket Real-time Subscriptions & Mutations
export function subscribeToTickets(callback: (tickets: Ticket[]) => void) {
  const path = 'tickets';
  const ticketsRef = collection(db, path);
  const q = query(ticketsRef, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (snapshot) => {
    const tickets: Ticket[] = [];
    snapshot.forEach((doc) => {
      tickets.push({ id: doc.id, ...doc.data() } as Ticket);
    });
    callback(tickets);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, path);
  });
}

export async function addTicket(ticketData: Omit<Ticket, 'id' | 'createdAt'>): Promise<string> {
  const path = 'tickets';
  const id = 'tick_' + Math.random().toString(36).substr(2, 9);
  const ticket: Ticket = {
    ...ticketData,
    id,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, path, id), ticket);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `${path}/${id}`);
  }
}

export async function updateTicketStatus(id: string, status: Ticket['status']) {
  const path = `tickets/${id}`;
  const ticketRef = doc(db, 'tickets', id);
  try {
    await updateDoc(ticketRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateTicketPriority(id: string, priority: Ticket['priority']) {
  const path = `tickets/${id}`;
  const ticketRef = doc(db, 'tickets', id);
  try {
    await updateDoc(ticketRef, { priority });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteTicket(id: string) {
  const path = `tickets/${id}`;
  try {
    await deleteDoc(doc(db, 'tickets', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

// 4. Authenticated User Profiles
export async function getUserProfile(uid: string): Promise<AppUser | null> {
  const path = `users/${uid}`;
  try {
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as AppUser;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function createUserProfile(uid: string, profile: Omit<AppUser, 'uid' | 'createdAt'>): Promise<AppUser> {
  const path = `users/${uid}`;
  const userProfile: AppUser = {
    uid,
    ...profile,
    createdAt: new Date().toISOString()
  };
  try {
    await setDoc(doc(db, 'users', uid), userProfile);
    return userProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
