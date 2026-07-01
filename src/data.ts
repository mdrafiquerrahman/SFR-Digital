import { Product, Service, Client, Project, Ticket, PricingPackage } from './types';

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
    name: 'SFR Digitech Shield Cybersecurity',
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

export const PACKAGES: PricingPackage[] = [
  {
    id: 'normal',
    name: 'Normal Business Website',
    price: 'Rs 14,999',
    posts: '14 Posts',
    postsDetail: '5 Reels, 5 Photo Posts, 4 Stories',
    automation: 'Basic Automation',
    maintenance: '2 Months Free Maintenance',
    extraMaintenance: 'Rs 499 per month',
    tagline: 'Perfect for local shops, small startups, or individual professionals wanting a quick, clean digital footprint.',
    description: 'Single-page or low-page-count sites with zero to minimal programming, focused entirely on elegant informational display.',
    useCases: [
      {
        title: 'Landing Page',
        description: 'A single page designed specifically for one targeted marketing goal or promotion.'
      },
      {
        title: 'Brochure Website',
        description: 'A basic 3-to-5 page site showcasing standard business info (About, Services, Contact).'
      },
      {
        title: 'Personal Portfolio',
        description: 'A simple, gorgeous grid or gallery displaying a creator\'s work, resume, and skills.'
      },
      {
        title: 'Basic Blog',
        description: 'A clean, content-focused site for writing articles and sharing business news updates.'
      },
      {
        title: 'Link-in-Bio Page',
        description: 'An ultra-simple mobile landing page consolidating all your social media links beautifully.'
      }
    ],
    features: [
      '14 Curated Social Media Posts (5 Reels, 5 Posts)',
      'Basic Automation (Simple contact forms)',
      'Single-page or 3-5 Page Brochure Layout',
      'Fully Mobile-Responsive Designs',
      'Standard SSL & Custom Domain setup assistance',
      '2 Months of Complementary Maintenance',
      'Extra Maintenance at just Rs 499/mo'
    ],
    colorTheme: {
      bg: 'bg-white',
      border: 'border-slate-200/80',
      text: 'text-slate-900',
      badge: 'bg-slate-100 text-slate-800',
      button: 'bg-slate-900 hover:bg-slate-800 text-white'
    }
  },
  {
    id: 'standard',
    name: 'Standard Business Website',
    price: 'Rs 24,999',
    posts: '21 Posts',
    postsDetail: '21 Posts + dynamic promotion',
    automation: 'Real Estate Agent Automation',
    maintenance: '4 Months Free Maintenance',
    extraMaintenance: 'Rs 599 per month',
    tagline: 'Ideal for real estate agents, growing brands, and businesses requiring lead pipelines and dynamic content.',
    description: 'Websites featuring Content Management Systems (CMS), dynamic listing layouts, and interactive workflows.',
    useCases: [
      {
        title: 'Standard Business Site',
        description: 'A complete corporate website with lead-generation forms, service pages, and reviews/testimonials.'
      },
      {
        title: 'Basic E-commerce',
        description: 'An online storefront selling up to a few hundred products with standard secure payment gateways.'
      },
      {
        title: 'Directory / Listing Site',
        description: 'A professional platform listing local businesses, real estate properties, or job openings.'
      },
      {
        title: 'Event Website',
        description: 'A modern site featuring event schedules, interactive speaker bios, and basic ticket registration.'
      },
      {
        title: 'Non-Profit / Charity',
        description: 'A platform designed to share a clear mission, post updates, and accept secure online donations.'
      }
    ],
    features: [
      '21 Social Media Posts + Active Promotion',
      'Real Estate Agent / Lead Automation workflows',
      'Dynamic Content Management System (CMS)',
      'Up to 10 Pages or Product Collections',
      'Custom Forms & Lead Capture Pipelines',
      '4 Months of Complementary Maintenance',
      'Extra Maintenance at just Rs 599/mo'
    ],
    popular: true,
    colorTheme: {
      bg: 'bg-slate-900',
      border: 'border-indigo-500/30',
      text: 'text-white',
      badge: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30',
      button: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/25'
    }
  },
  {
    id: 'premium',
    name: 'Premium Enterprise Website',
    price: 'Rs 39,999',
    posts: '25 Posts + 2 Ads',
    postsDetail: '25 Posts + 2 Ad Campaigns + promotion',
    automation: 'AI Chatbot & All Automation',
    maintenance: '6 Months Free Maintenance',
    extraMaintenance: 'Rs 799 per month',
    tagline: 'Our ultimate package for large brands, educational systems, marketplaces, and tailored communication portals.',
    description: 'Fully customized large-scale platforms with smart automation, secure access portals, and advanced database workflows.',
    useCases: [
      {
        title: 'Advanced E-commerce / Marketplace',
        description: 'Supporting multi-vendor selling, dynamic tiered pricing, coupon systems, and global logistics.'
      },
      {
        title: 'Membership & LMS',
        description: 'Learning Management Systems offering online courses, user progress trackers, and subscription plans.'
      },
      {
        title: 'Community & Forum Hubs',
        description: 'Large social hubs featuring user profiles, live feeds, messaging systems, and discussion boards.'
      },
      {
        title: 'Custom Client/Web Portals',
        description: 'Secure, bespoke platforms built specifically for internal employee use, patient management, or client communications.'
      }
    ],
    features: [
      '25 Curated Social Media Posts + 2 Ad Campaigns',
      'Intelligent Chatbot & Full Automation suite',
      'Custom Client Operations Portal integration',
      'Unrestricted Page Count & Advanced Databases',
      'Advanced Membership & LMS capabilities',
      '6 Months of Complementary Maintenance',
      'Extra Maintenance at just Rs 799/mo'
    ],
    colorTheme: {
      bg: 'bg-white',
      border: 'border-slate-200/80',
      text: 'text-slate-900',
      badge: 'bg-purple-100 text-purple-800',
      button: 'bg-purple-900 hover:bg-purple-800 text-white'
    }
  }
];
