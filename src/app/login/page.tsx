'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Camera, AtSign, Lock, Eye, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockUsers } from '@/lib/mockData';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const envUser = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin';
    const envPass = process.env.NEXT_PUBLIC_ADMIN_PASS || 'lumina2025';

    if (username === envUser && password === envPass) {
      // Login success
      const user = mockUsers.find(u => u.username === 'admin') || mockUsers[0];
      login(user);
      router.push('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#e4e4ff] to-[#fef0f7] font-sans text-on-surface">
      {/* Ambient Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 w-96 h-96 bg-primary-fixed-dim/20 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-1/2 -right-24 w-80 h-80 bg-secondary-fixed/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-24 left-1/4 w-64 h-64 bg-tertiary-fixed/20 rounded-full blur-3xl"
        />
      </div>

      <main className="relative z-10 w-full max-w-md px-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_25px_50px_-12px_rgba(92,6,86,0.08)] rounded-[16px] p-10 flex flex-col items-center"
        >
          {/* Logo Section */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center shadow-lg shadow-primary/20 mb-4 transform transition-transform hover:scale-105 duration-300">
              <Camera className="text-white w-8 h-8" />
            </div>
            <h1 className="text-[32px] leading-[1.2] font-semibold text-primary tracking-tighter">Arjun Photography</h1>
            <p className="text-[14px] text-on-surface-variant mt-1 opacity-70 font-medium">Elevated Photography Management</p>
          </div>

          {/* Login Form */}
          <form className="w-full space-y-8" onSubmit={handleLogin}>
            {error && (
              <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm text-center">
                {error}
              </div>
            )}
            
            {/* Username Field */}
            <div className="relative group">
              <div className="flex items-center space-x-3 mb-1 px-1">
                <AtSign className="text-on-surface-variant w-5 h-5" />
                <label className="text-[14px] font-medium text-on-surface-variant" htmlFor="username">Username</label>
              </div>
              <input 
                className="w-full bg-transparent border-b border-outline-variant py-3 px-1 text-on-surface text-[16px] transition-all duration-300 placeholder:text-outline-variant/50 focus:outline-none focus:border-primary" 
                id="username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="creative.pro@arjunfilms.com" 
                type="text"
                required
              />
            </div>

            {/* Password Field */}
            <div className="relative group">
              <div className="flex items-center justify-between mb-1 px-1">
                <div className="flex items-center space-x-3">
                  <Lock className="text-on-surface-variant w-5 h-5" />
                  <label className="text-[14px] font-medium text-on-surface-variant" htmlFor="password">Password</label>
                </div>
                <a className="text-[12px] font-semibold text-on-primary-container hover:text-primary transition-colors" href="#">Forgot?</a>
              </div>
              <div className="relative">
                <input 
                  className="w-full bg-transparent border-b border-outline-variant py-3 px-1 text-on-surface text-[16px] transition-all duration-300 placeholder:text-outline-variant/50 focus:outline-none focus:border-primary pr-10" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  type={showPassword ? 'text' : 'password'}
                  required
                />
                <button 
                  className="absolute right-2 top-3 text-on-surface-variant/60 hover:text-primary" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center px-1">
              <input className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary/20 bg-white/50 cursor-pointer" id="remember" type="checkbox"/>
              <label className="ml-3 text-[14px] font-medium text-on-surface-variant cursor-pointer select-none" htmlFor="remember">Stay signed in for 30 days</label>
            </div>

            {/* CTA Button */}
            <div className="pt-2">
              <button 
                className="w-full bg-primary-container hover:bg-primary text-white text-[14px] font-medium py-4 rounded-xl shadow-xl shadow-primary/10 active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 group" 
                type="submit"
              >
                <span>Login</span>
                <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
          
        </motion.div>

        {/* System Status */}
        <div className="mt-8 flex justify-center space-x-6 text-on-surface-variant/40 text-[12px] font-semibold">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>Systems Operational</span>
          </div>
          <span>Privacy</span>
          <span>Terms</span>
        </div>
      </main>
    </div>
  );
}
