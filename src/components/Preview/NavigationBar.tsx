import React from 'react';
import { ChatSettings } from '../../types';
import { cn } from '../../lib/utils';

interface NavigationBarProps {
  settings: ChatSettings;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ settings }) => {
  if (settings.navigationBar === 'none') return null;

  return (
    <div className={cn(
      "flex items-center justify-around px-8",
      settings.isDarkMode ? "bg-[#0b141a]" : "bg-white/80",
      settings.navigationBar === 'android' ? "h-12" : "h-6"
    )}>
      {settings.navigationBar === 'android' ? (
        <>
          <div className="w-3 h-3 border-2 border-current rounded-sm rotate-45" />
          <div className="w-3 h-3 border-2 border-current rounded-full" />
          <div className="w-3 h-3 border-2 border-current rounded-sm" />
        </>
      ) : (
        <div className="w-32 h-1 bg-current/20 rounded-full" />
      )}
    </div>
  );
};
