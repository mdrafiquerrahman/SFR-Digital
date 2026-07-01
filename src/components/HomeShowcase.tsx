import React from 'react';
import { motion } from 'motion/react';
import { PRODUCTS, SERVICES, PORTFOLIO, PACKAGES } from '../data';
import Icon from './Icon';

interface HomeShowcaseProps {
  onEnterPortal: () => void;
}

export default function HomeShowcase({ onEnterPortal }: HomeShowcaseProps) {
  // Staggered motion container variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="bg-gray-50 text-gray-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white py-20 sm:py-28 border-b border-gray-100">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.07),rgba(255,255,255,0))]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600 border border-indigo-100/50"
            >
              <Icon name="Sparkles" className="h-3.5 w-3.5" />
              <span>Pioneering Digital Architectures</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-6 font-sans text-4xl font-extrabold tracking-tight text-gray-950 sm:text-5xl md:text-6xl leading-[1.1]"
            >
              The Enterprise Engine for <span className="text-indigo-600 bg-clip-text">Products & Services</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 font-sans text-lg text-gray-600 leading-relaxed"
            >
              We engineer secure cloud-native SaaS products and deliver tailored technical consultancy to fuel rapid business modernization. Fully monitored and integrated with our client tracking dashboard.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={onEnterPortal}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
              >
                <span>Access Client & Project Portal</span>
                <Icon name="ArrowRight" className="h-4 w-4" />
              </button>
              
              <a
                href="#products"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-white border border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all"
              >
                <span>View Product Ecosystem</span>
              </a>
            </motion.div>
          </div>
          
          {/* Hero Visual Terminal Accent */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 50 }}
            className="mt-16 border border-gray-200 bg-gray-950 rounded-xl shadow-2xl overflow-hidden max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900/50">
              <div className="flex space-x-1.5">
                <span className="h-3 w-3 rounded-full bg-red-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-yellow-500/80"></span>
                <span className="h-3 w-3 rounded-full bg-green-500/80"></span>
              </div>
              <div className="font-mono text-xs text-gray-500">terminal@apexdigital:~</div>
              <div className="w-12"></div>
            </div>
            <div className="p-6 font-mono text-xs text-indigo-400/90 space-y-2 text-left bg-gray-950 overflow-x-auto">
              <div><span className="text-emerald-500">❯</span> npx apex-digital-cli initialize --project-dashboard</div>
              <div className="text-gray-400">⚡ Initializing real-time database syncing hooks...</div>
              <div className="text-gray-400">✨ Binding secure collections: [clients, projects, support_tickets]</div>
              <div className="text-indigo-300">✓ Database Connection validated. Region: us-central (Active)</div>
              <div><span className="text-emerald-500">❯</span> apex-digital-cli start</div>
              <div className="text-emerald-400">● Live preview compiled successfully. Hosting node port :3000 online.</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. CORE PRODUCTS GRID (Bento Style) */}
      <section id="products" className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-indigo-600">Enterprise Product Base</h2>
            <p className="mt-2 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">SaaS Ecosystem Built to Scale</p>
            <p className="mt-4 font-sans text-md text-gray-600">Off-the-shelf software solutions fully integrated, security-hardened, and designed for immediate organizational deployment.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {PRODUCTS.map((product) => (
              <motion.div 
                key={product.id}
                variants={itemVariants}
                className="flex flex-col bg-white rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all overflow-hidden group"
              >
                <div className="p-6 flex-1">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Icon name={product.image} className="h-6 w-6" />
                  </div>
                  <div className="mt-5">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700 font-sans">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="mt-3 font-sans text-xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h3>
                  <p className="mt-2 font-sans text-xs text-indigo-600 font-medium">
                    {product.tagline}
                  </p>
                  <p className="mt-3 font-sans text-sm text-gray-600 leading-relaxed">
                    {product.description}
                  </p>
                </div>
                
                <div className="bg-gray-50/70 border-t border-gray-100 p-6">
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-gray-500">Core Architecture Features</h4>
                  <ul className="mt-3 space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start text-xs text-gray-600 font-sans">
                        <Icon name="Check" className="h-4 w-4 text-emerald-500 shrink-0 mr-1.5 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3. TAILORED SERVICES GRID */}
      <section id="services" className="py-20 bg-gray-950 text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_10%_90%,rgba(99,102,241,0.08),rgba(0,0,0,0))]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-indigo-400">Engineering Service Base</h2>
            <p className="mt-2 font-sans text-3xl font-bold tracking-tight text-white sm:text-4xl">Technical Consultation & Integration</p>
            <p className="mt-4 font-sans text-md text-gray-400">Bespoke technical engineering services delivering secure infrastructures, custom dashboards, and high-performance React frontends.</p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {SERVICES.map((service) => (
              <motion.div 
                key={service.id}
                variants={itemVariants}
                className="bg-gray-900 border border-gray-800 rounded-xl p-8 hover:border-indigo-500/40 hover:bg-gray-900/80 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Icon name={service.iconName} className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-sans text-lg font-bold text-white">{service.title}</h3>
                    <p className="font-sans text-xs text-indigo-400">Guaranteed SLA Delivery</p>
                  </div>
                </div>
                
                <p className="mt-4 font-sans text-sm text-gray-400 leading-relaxed">
                  {service.description}
                </p>
                
                <div className="mt-6 pt-6 border-t border-gray-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {service.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-xs text-gray-300 font-sans">
                        <span className="h-1.5 w-1.5 rounded-full bg-indigo-400"></span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 3.5 PRICING & PACKAGES SECTION */}
      <section id="pricing" className="py-20 sm:py-24 bg-gray-50 border-b border-gray-200/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-indigo-600">Transparent Pricing</h2>
            <p className="mt-2 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Engineered Website Packages</p>
            <p className="mt-4 font-sans text-md text-gray-600">
              Choose a tailored solution crafted specifically for your scale, fully integrated with SFR Digitech automation suites and comprehensive social media deliverables.
            </p>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch"
          >
            {PACKAGES.map((pkg) => (
              <motion.div 
                key={pkg.id}
                variants={itemVariants}
                className={`flex flex-col rounded-2xl border ${pkg.colorTheme.border} ${pkg.colorTheme.bg} ${pkg.colorTheme.text} shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden`}
              >
                {pkg.popular && (
                  <div className="absolute top-0 right-0 mt-4 mr-4">
                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-400 border border-indigo-500/30 animate-pulse">
                      <Icon name="Sparkles" className="h-3 w-3" />
                      <span>Most Popular</span>
                    </span>
                  </div>
                )}

                <div className="p-8 flex-1">
                  <div className="flex items-center justify-between">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${pkg.colorTheme.badge}`}>
                      {pkg.automation}
                    </span>
                  </div>
                  
                  <h3 className="mt-4 font-sans text-2xl font-extrabold tracking-tight">
                    {pkg.name}
                  </h3>
                  
                  <p className={`mt-2 font-sans text-xs leading-relaxed ${pkg.id === 'standard' ? 'text-slate-300' : 'text-gray-500'}`}>
                    {pkg.tagline}
                  </p>

                  <div className="mt-6 flex items-baseline">
                    <span className="font-sans text-4xl font-extrabold tracking-tight">{pkg.price}</span>
                    <span className={`ml-2 font-sans text-sm ${pkg.id === 'standard' ? 'text-slate-300' : 'text-gray-500'}`}>
                      one-time
                    </span>
                  </div>

                  <div className={`mt-2 py-1.5 px-3 rounded-lg flex items-center justify-between text-xs font-semibold ${pkg.id === 'standard' ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-700'}`}>
                    <span>{pkg.maintenance}</span>
                    <span className="opacity-80">Included</span>
                  </div>

                  <p className={`mt-3 font-mono text-[11px] ${pkg.id === 'standard' ? 'text-indigo-300' : 'text-indigo-600'}`}>
                    Extra Maintenance: <span className="font-bold">{pkg.extraMaintenance}</span>
                  </p>

                  {/* USE CASES */}
                  <div className="mt-8">
                    <h4 className="font-sans text-xs font-bold uppercase tracking-wider opacity-85 mb-4">
                      Supported Project Formats
                    </h4>
                    <div className="space-y-3">
                      {pkg.useCases.map((uc, index) => (
                        <div 
                          key={index} 
                          className={`p-3 rounded-xl border transition-colors ${pkg.id === 'standard' ? 'bg-slate-900/50 border-slate-800 hover:bg-slate-850' : 'bg-gray-50 border-gray-100 hover:bg-gray-100/50'}`}
                        >
                          <h5 className="font-sans text-xs font-bold tracking-tight">
                            {uc.title}
                          </h5>
                          <p className={`mt-1 font-sans text-[11px] leading-relaxed ${pkg.id === 'standard' ? 'text-slate-400' : 'text-gray-500'}`}>
                            {uc.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={`p-8 border-t ${pkg.id === 'standard' ? 'border-slate-800 bg-slate-900/40' : 'border-gray-100 bg-gray-50/50'}`}>
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider opacity-85 mb-3">
                    Deliverables & Features
                  </h4>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start text-xs font-sans">
                        <Icon name="Check" className="h-4 w-4 text-emerald-500 shrink-0 mr-2 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={onEnterPortal}
                    className={`w-full py-3 px-4 rounded-xl font-sans text-xs font-bold tracking-wide transition-all uppercase hover:-translate-y-0.5 active:translate-y-0 ${pkg.colorTheme.button}`}
                  >
                    Select Plan & Consult
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 4. DESIGN INSPIRATIONS & PORTFOLIO (Highlights brightbuildcon, zrnsolar, kairozinterior) */}
      <section id="portfolio" className="py-20 bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-indigo-600">Enterprise Case Studies</h2>
            <p className="mt-2 font-sans text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Showcasing Inspired Layouts</p>
            <p className="mt-4 font-sans text-md text-gray-600">Explore real projects modeled in collaboration with lead development partners, featuring bespoke aesthetics and custom integrations.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* BrightBuildCon Inspired Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-stone-900 text-white rounded-xl overflow-hidden shadow-lg border border-stone-800 flex flex-col group justify-between"
            >
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-500 font-semibold">Geometric / Heavy Grid</span>
                  <a href="https://brightbuildcon.com/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                    <Icon name="ArrowRight" className="h-4 w-4 rotate-[-45deg]" />
                  </a>
                </div>
                <h3 className="mt-4 font-sans text-2xl font-black text-white tracking-tight uppercase">
                  BrightBuild Con
                </h3>
                <p className="mt-1 font-mono text-[11px] text-gray-400">Portal & Resource Approver</p>
                <p className="mt-4 font-sans text-sm text-stone-300 leading-relaxed">
                  Inspired by the bold geometric panels and concrete industrial branding of BrightBuild. Developed a heavy-grid portal structure mapping contract pipelines and real-time equipment allocation matrices.
                </p>
              </div>
              <div className="p-8 bg-stone-950 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-gray-400">KEY METRIC</div>
                  <div className="font-sans text-lg font-bold text-amber-500">140% Lead Boost</div>
                </div>
                <div className="flex gap-1">
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-[10px] font-mono text-gray-300">Next.js</span>
                  <span className="px-2 py-0.5 rounded bg-stone-800 text-[10px] font-mono text-gray-300">Grid API</span>
                </div>
              </div>
            </motion.div>

            {/* ZRN Solar Inspired Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900 text-white rounded-xl overflow-hidden shadow-lg border border-slate-800 flex flex-col group justify-between"
            >
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-400 font-semibold">Analytical / Tech Mono</span>
                  <a href="https://zrnsolar.com/" target="_blank" rel="noreferrer" className="text-gray-400 hover:text-white">
                    <Icon name="ArrowRight" className="h-4 w-4 rotate-[-45deg]" />
                  </a>
                </div>
                <h3 className="mt-4 font-sans text-2xl font-bold text-white tracking-tight">
                  ZRN Solar Systems
                </h3>
                <p className="mt-1 font-mono text-[11px] text-gray-400">Fleet Telemetry Supervisor</p>
                <p className="mt-4 font-sans text-sm text-slate-300 leading-relaxed">
                  Inspired by ZRN Solar’s technical clean telemetry layouts. Engineered an intelligent server-side database sync feeding visual power graphs, historical logs, and automatic alert escalations.
                </p>
              </div>
              <div className="p-8 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-gray-400">KEY METRIC</div>
                  <div className="font-sans text-lg font-bold text-emerald-400">99.98% Latency Drop</div>
                </div>
                <div className="flex gap-1">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-gray-300">IoT Ingest</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-gray-300">D3 charts</span>
                </div>
              </div>
            </motion.div>

            {/* Kairoz Interiors Inspired Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-amber-50 text-stone-900 rounded-xl overflow-hidden shadow-lg border border-amber-100/50 flex flex-col group justify-between"
            >
              <div className="p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-amber-800 font-semibold">Minimalist / Warm Bento</span>
                  <a href="https://kairozinterior.in/" target="_blank" rel="noreferrer" className="text-stone-500 hover:text-stone-900">
                    <Icon name="ArrowRight" className="h-4 w-4 rotate-[-45deg]" />
                  </a>
                </div>
                <h3 className="mt-4 font-sans text-2xl font-serif text-stone-900 tracking-tight italic">
                  Kairoz Interiors
                </h3>
                <p className="mt-1 font-mono text-[11px] text-stone-500">Spatial Designer Board</p>
                <p className="mt-4 font-sans text-sm text-stone-700 leading-relaxed">
                  Reflecting the high-end spatial aesthetics of Kairoz Interiors. Crafted elegant product bento cards utilizing warm background shades, thin wire borders, and soft interactive shadows.
                </p>
              </div>
              <div className="p-8 bg-stone-100 border-t border-stone-200/50 flex items-center justify-between">
                <div>
                  <div className="font-mono text-xs text-stone-500">KEY METRIC</div>
                  <div className="font-sans text-lg font-bold text-stone-900">5x Drafting Speed</div>
                </div>
                <div className="flex gap-1">
                  <span className="px-2 py-0.5 rounded bg-stone-200 text-[10px] font-mono text-stone-700">Canvas</span>
                  <span className="px-2 py-0.5 rounded bg-stone-200 text-[10px] font-mono text-stone-700">Bento UI</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION SECTION */}
      <section className="bg-gradient-to-r from-indigo-900 to-indigo-850 text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_500px_at_right_top,rgba(255,255,255,0.06),transparent)]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="font-sans text-3xl font-extrabold sm:text-4xl">Ready to modernization your IT Operations?</h2>
          <p className="mt-4 font-sans text-md text-indigo-100 max-w-2xl mx-auto">
            Log in to the Client Portal to inspect live active projects, track budget burn-downs, and file tickets directly with our core engineering desk.
          </p>
          <div className="mt-8">
            <button
              onClick={onEnterPortal}
              className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-indigo-900 shadow-md hover:bg-gray-50 transition-all hover:scale-105"
            >
              <span>Launch Client Portal</span>
              <Icon name="Briefcase" className="h-4 w-4 text-indigo-900" />
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
