import { Product, Service, Client, Project, Ticket } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'flowdoc',
    name: 'FlowDoc Intelligent SaaS',
    tagline: 'Enterprise Document Intelligence',
    description: 'A cloud-native document processing and intelligence platform. Features real-time multi-user editing, AI-powered parsing, automatic meta-tagging, and secure multi-region replication.',
    category: 'SaaS / Productivity',
    features: ['Automated PDF Parsing', 'Real-time Rich Collaborative Editors', 'Version Control & Rollbacks', 'Enterprise SSO & IAM Roles'],
    image: 'FileText'
  },
  {
    id: 'omnicore',
    name: 'OmniCore Unified ERP',
    tagline: 'Modern Enterprise Resource Suite',
    description: 'An elegant, high-density operations engine for modern scale-ups. Unifies resource planning, accounting, inventory tracking, and client contract management in a sleek dashboard.',
    category: 'Enterprise Software',
    features: ['Live Inventory Auditing', 'Unified Billing & Ledgers', 'Visual Supply Chain Pipelines', 'Interactive Resource Planner'],
    image: 'Layers'
  },
  {
    id: 'apexshield',
    name: 'SFR Shield Cybersecurity',
    tagline: 'Zero-Trust Cloud Firewall',
    description: 'An intelligent cybersecurity shield providing micro-segmentation, visual threat graphs, and automated cloud compliance auditing to ensure data isolation at the boundary.',
    category: 'SecOps / Infrastructure',
    features: ['Zero-Trust Microsegmentation', 'Visual Live Network Threat Maps', 'Automated GDPR & HIPAA Compliance', 'Instant Exploit Patching'],
    image: 'ShieldAlert'
  }
];

export const SERVICES: Service[] = [
  {
    id: 'cloud-arch',
    title: 'Custom Cloud Architectures',
    description: 'Sleek, scale-to-zero serverless solutions utilizing multi-region cloud infrastructures to handle high-density visual applications.',
    iconName: 'Cloud',
    features: ['Multi-Region Serverless Setup', 'Nginx & Load-Balancing Optimization', 'Container Ingress & Microservices', 'Automated CD/CI Pipelines']
  },
  {
    id: 'ent-dev',
    title: 'Enterprise App Engineering',
    description: 'Native and progressive web applications built with React, Vite, and tailwind. Optimized for fluid visual transitions and offline persistence.',
    iconName: 'Cpu',
    features: ['High-Performance React SPA/Full-stack', 'Responsive Touch & Click Layouts', 'Durable Offline Local State', 'Micro-interaction Animations']
  },
  {
    id: 'sec-audit',
    title: 'Cybersecurity Guard & Audit',
    description: 'Comprehensive vulnerability assessments, penetration testing, database hardening, and compliance certification readiness.',
    iconName: 'Shield',
    features: ['Dynamic Pentesting Reports', 'Firestore Rules & IAM Audits', 'Data Encryption & Tokenization', 'ISO 27001 Certification Prep']
  },
  {
    id: 'ai-ml',
    title: 'AI & Machine Learning Systems',
    description: 'Practical integration of Large Language Models, custom vector retrieval databases, search grounding, and smart dashboard widgets.',
    iconName: 'Sparkles',
    features: ['RAG Pipeline Orchestration', 'Gemini SDK Integrations', 'Smart Analytics Dashboards', 'Cognitive Automation Flows']
  }
];

// PORTFOLIO / CASE STUDIES - Inspired by brightbuildcon, zrnsolar, and kairozinterior
export const PORTFOLIO = [
  {
    title: 'BrightBuild Infrastructure Portal',
    client: 'BrightBuild Construction',
    category: 'Full-Scale Enterprise Web Application',
    description: 'Designed a highly geometric, modern web portal with massive grid layouts and responsive client estimators.',
    tags: ['Next.js', 'PostgreSQL', 'Tailwind', 'Real-time Bidding'],
    metric: '140%+ client engagement increase',
    inspirationUrl: 'https://brightbuildcon.com/'
  },
  {
    title: 'ZRN Solar Management Suite',
    client: 'ZRN Solar Energy',
    category: 'IoT Fleet Monitoring & Analytics Dashboard',
    description: 'Engineered a real-time IoT monitoring console featuring high-performance canvas rendering and power timeline grids.',
    tags: ['React', 'D3.js', 'WebSockets', 'AWS IoT'],
    metric: '99.98% real-time tracking uptime',
    inspirationUrl: 'https://zrnsolar.com/'
  },
  {
    title: 'Kairoz Spatial Configurator',
    client: 'Kairoz Interior Design',
    category: 'Interactive Visual Layout Software',
    description: 'Created a sleek, minimalist client mood-board and contract editor utilizing soft shadows, bento grids, and custom CSS variables.',
    tags: ['React', 'Canvas API', 'Framer Motion', 'Cloud SQL'],
    metric: '5x faster project drafting',
    inspirationUrl: 'https://kairozinterior.in/'
  }
];

// Seed Data for Database
export const SEED_CLIENTS: Client[] = [
  {
    id: 'client_brightbuild',
    name: 'Vikram Mehta',
    company: 'BrightBuild Con',
    email: 'contact@brightbuildcon.com',
    phone: '+91 98765 43210',
    status: 'Active',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'client_zrnsolar',
    name: 'Sarah Jenkins',
    company: 'ZRN Solar Systems',
    email: 'sarah.j@zrnsolar.com',
    phone: '+1 (555) 234-5678',
    status: 'Active',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'client_kairoz',
    name: 'Anya Sen',
    company: 'Kairoz Interiors',
    email: 'anya@kairozinterior.in',
    phone: '+91 87654 32109',
    status: 'Active',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'client_nexus',
    name: 'David Vance',
    company: 'Nexus Logistics',
    email: 'd.vance@nexuslog.com',
    phone: '+1 (555) 890-1234',
    status: 'Lead',
    createdAt: new Date().toISOString()
  }
];

export const SEED_PROJECTS: Project[] = [
  {
    id: 'proj_bb_portal',
    name: 'Enterprise Builder Portal v2',
    clientId: 'client_brightbuild',
    clientName: 'BrightBuild Con',
    description: 'Complete redesign and optimization of construction portal, adding real-time contract approvals, heavy equipment allocation grids, and interactive progress calculators.',
    status: 'In Progress',
    progress: 72,
    budget: 45000,
    startDate: '2026-05-10',
    endDate: '2026-08-15',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'proj_zrn_iot',
    name: 'IoT Fleet Telemetry Console',
    clientId: 'client_zrnsolar',
    clientName: 'ZRN Solar Systems',
    description: 'A cloud ingestion backend and visual live map interface tracking 10,000+ residential and industrial solar panel inverters, generating real-time anomaly tickets.',
    status: 'Completed',
    progress: 100,
    budget: 68000,
    startDate: '2026-03-01',
    endDate: '2026-06-15',
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'proj_kairoz_3d',
    name: 'Kairoz Studio Configurator',
    clientId: 'client_kairoz',
    clientName: 'Kairoz Interiors',
    description: 'An interactive HTML5 spatial room editor allowing clients to drag, drop, and customize custom cabinet configurations in their browsers, synced with production order desks.',
    status: 'In Progress',
    progress: 35,
    budget: 28000,
    startDate: '2026-06-12',
    endDate: '2026-09-30',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  }
];

export const SEED_TICKETS: Ticket[] = [
  {
    id: 'tick_bb_01',
    title: 'S3 File Upload Upload Limit Error',
    description: 'Clients are reporting a 413 Payload Too Large when uploading blueprints greater than 15MB. Need to raise the API Gateway limit and add client-side compression checking.',
    status: 'In Progress',
    priority: 'High',
    clientId: 'client_brightbuild',
    projectId: 'proj_bb_portal',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Vikram Mehta',
    creatorRole: 'Client'
  },
  {
    id: 'tick_zrn_02',
    title: 'Inverter Telemetry Latency Jump',
    description: 'Observed a 4.2-second spike in telemetry stream ingestion times during high noon solar loads. Investigate Redis cache queuing bottlenecks.',
    status: 'Resolved',
    priority: 'Critical',
    clientId: 'client_zrnsolar',
    projectId: 'proj_zrn_iot',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Sarah Jenkins',
    creatorRole: 'Client'
  },
  {
    id: 'tick_kairoz_03',
    title: 'Mobile Canvas Pinch-to-Zoom Lag',
    description: 'On Safari iOS devices, pinching to zoom in the spatial configurator causes flickering and offset coordinates. Need to touch-action guard the HTML element.',
    status: 'Open',
    priority: 'Medium',
    clientId: 'client_kairoz',
    projectId: 'proj_kairoz_3d',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    creatorName: 'Anya Sen',
    creatorRole: 'Client'
  }
];
