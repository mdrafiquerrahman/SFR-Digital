import React from 'react';
import Icon from './Icon';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-b border-gray-800 pb-8">
          <div>
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-indigo-500 text-white">
                <Icon name="Cpu" className="h-4 w-4" />
              </div>
              <span className="font-sans text-md font-bold text-white tracking-tight">
                SAFIQ<span className="text-indigo-400">TECH</span>
              </span>
            </div>
            <p className="mt-4 font-sans text-sm text-gray-400 max-w-xs">
              Pioneering enterprise products and custom engineering architectures. Hardened for high-density visual applications.
            </p>
          </div>
          
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-gray-400">Our Inspirations</h4>
            <ul className="mt-4 space-y-2 font-sans text-sm text-gray-400">
              <li>
                <a href="https://brightbuildcon.com/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  BrightBuild Con Layout
                </a>
              </li>
              <li>
                <a href="https://zrnsolar.com/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  ZRN Solar Telemetry Grid
                </a>
              </li>
              <li>
                <a href="https://kairozinterior.in/" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  Kairoz Minimal Spatial Bento
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-sans text-xs font-semibold uppercase tracking-wider text-gray-400">Systems Contact</h4>
            <p className="mt-4 font-sans text-sm text-gray-400">
              Technical Inquiries: mdrafiquerrahman@gmail.com
            </p>
            <p className="mt-1 font-sans text-sm text-gray-400">
              Support Desk: +91 6205369397
            </p>
            <div className="mt-4 flex items-center space-x-2 font-mono text-[10px] text-indigo-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Cloud Engine: Online (Region: us-central)</span>
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between font-sans text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Safiqtech Systems Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Enterprise Grade • ISO 27001 Certified</p>
        </div>
      </div>
    </footer>
  );
}
