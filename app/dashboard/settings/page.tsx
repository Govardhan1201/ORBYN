'use client';

import { useSession } from 'next-auth/react';
import { User, Bell, Shield, Sparkles, LogOut, Paintbrush } from 'lucide-react';
import { signOut } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="h-full flex flex-col p-8 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-gradient">Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account, preferences, and AI behavior.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Side Nav */}
          <div className="col-span-1 space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium text-sm border border-primary/20 shadow-glow-blue">
              <User className="w-4 h-4" /> Account
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium text-sm transition-colors">
              <Paintbrush className="w-4 h-4" /> Appearance
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium text-sm transition-colors">
              <Sparkles className="w-4 h-4" /> AI Integrations
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-muted-foreground hover:bg-secondary/50 hover:text-foreground font-medium text-sm transition-colors">
              <Shield className="w-4 h-4" /> Privacy
            </button>
          </div>

          {/* Content */}
          <div className="col-span-3 space-y-6">
            
            {/* Profile Card */}
            <div className="glass-card p-6 rounded-xl border border-border/50">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><User className="w-5 h-5 text-primary"/> Profile</h2>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-accent p-[3px]">
                  <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-3xl font-bold text-foreground">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold">{session?.user?.name || 'Cosmic Explorer'}</h3>
                  <p className="text-muted-foreground">{session?.user?.email || 'user@orbyn.ai'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                    <input type="text" defaultValue={session?.user?.name || ''} className="w-full px-4 py-2 rounded-lg bg-input border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <input type="email" disabled defaultValue={session?.user?.email || ''} className="w-full px-4 py-2 rounded-lg bg-secondary/50 border border-border text-muted-foreground cursor-not-allowed outline-none text-sm" />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button className="px-5 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition-all shadow-glow-blue">Save Changes</button>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="glass-card p-6 rounded-xl border border-destructive/20 bg-destructive/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-destructive" />
              <h2 className="text-lg font-bold text-destructive mb-2">Danger Zone</h2>
              <p className="text-sm text-muted-foreground mb-4">Permanent actions regarding your account and your knowledge graph.</p>
              
              <div className="flex items-center justify-between py-3 border-b border-border/50">
                <div>
                  <h4 className="font-medium text-sm">Sign Out</h4>
                  <p className="text-xs text-muted-foreground">Log out of your current session.</p>
                </div>
                <button onClick={() => signOut({ callbackUrl: '/' })} className="px-4 py-2 bg-secondary text-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-all flex items-center gap-2">
                  <LogOut className="w-4 h-4"/> Sign Out
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <h4 className="font-medium text-sm text-destructive">Delete Account</h4>
                  <p className="text-xs text-muted-foreground">Permanently delete your account and all mapped data.</p>
                </div>
                <button className="px-4 py-2 bg-destructive/10 text-destructive text-sm font-medium rounded-lg hover:bg-destructive/20 transition-all">
                  Delete Account
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
