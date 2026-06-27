import React from 'react';
import * as Icons from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function Icon({ name, className = '', size = 20 }: IconProps) {
  // Safe lookup for Lucide icons
  const LucideIcon = (Icons as any)[name];
  
  if (!LucideIcon) {
    // Return a default fallback if the icon name is invalid or missing
    const Fallback = Icons.HelpCircle;
    return <Fallback className={className} size={size} />;
  }
  
  return <LucideIcon className={className} size={size} />;
}
