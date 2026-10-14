import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { User, LogOut, Sparkles } from 'lucide-react';

interface UserMenuProps {
  detectedTone?: string;
  detectedUndertone?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  detectedTone,
  detectedUndertone,
}) => {
  const { user, signOut, isLoading } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-stone-200 animate-pulse" />;
  }

  if (!user) {
    return <GoogleSignInButton label="Sign In" />;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-stone-100 hover:bg-stone-200/80 border border-stone-200 transition-all text-xs font-semibold text-stone-800"
      >
        {user.avatar_url ? (
          <img
            src={user.avatar_url}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover border border-white"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-xs">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name}</span>
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-stone-200/80 p-4 z-50 text-xs space-y-3">
          <div className="flex items-center gap-3 border-b border-stone-100 pb-3">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold text-sm">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-stone-900 truncate">{user.name}</p>
              <p className="text-stone-500 text-[11px] truncate">{user.email}</p>
            </div>
          </div>

          {(detectedTone || detectedUndertone) && (
            <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-100 space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-wider text-rose-600 block">
                Saved Skin Profile
              </span>
              <div className="flex items-center gap-1.5 font-bold text-stone-800 capitalize">
                <Sparkles className="w-3.5 h-3.5 text-rose-500" />
                <span>{detectedTone || 'Medium'} • {detectedUndertone || 'Neutral'}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => {
              signOut();
              setDropdownOpen(false);
            }}
            className="w-full flex items-center gap-2 py-2 px-3 rounded-xl hover:bg-stone-50 text-stone-600 hover:text-rose-600 font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      )}
    </div>
  );
};

