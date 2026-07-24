'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Camera, AtSign, Lock, Eye, ArrowRight, ShieldCheck, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockUsers } from '@/lib/mockData';
import { sendLoginOTP, verifyLoginOTP } from '@/app/actions';
import { toast } from 'sonner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const envUser = process.env.NEXT_PUBLIC_ADMIN_USER || 'admin';
    const envPass = process.env.NEXT_PUBLIC_ADMIN_PASS || 'lumina2025';
    // Use an environment variable or default
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || username;

    if (username === envUser && password === envPass) {
      // Correct credentials, request OTP
      try {
        const res = await sendLoginOTP(username, adminEmail);
        if (res.success) {
          toast.success('OTP sent to your email');
          setStep(2);
        } else {
          setError(res.error || 'Failed to send OTP');
        }
      } catch (err) {
        setError('Network error. Please try again.');
      }
    } else {
      setError('Invalid username or password');
    }
    setIsLoading(false);
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || username;
    
    try {
      const res = await verifyLoginOTP(adminEmail, otp);
      if (res.success) {
        const user = mockUsers.find(u => u.username === 'admin') || mockUsers[0];
        login(user);
        router.push('/dashboard');
        toast.success('Login Successful');
      } else {
        setError(res.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setIsLoading(false);
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
          className="bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_25px_50px_-12px_rgba(92,6,86,0.08)] rounded-[16px] p-10 flex flex-col items-center overflow-hidden relative"
        >
          {/* Logo Section */}
          <div className="mb-8 flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center shadow-lg shadow-primary/20 mb-4 transform transition-transform hover:scale-105 duration-300">
              {step === 1 ? <Camera className="text-white w-8 h-8" /> : <ShieldCheck className="text-white w-8 h-8" />}
            </div>
            <h1 className="text-[32px] leading-[1.2] font-semibold text-primary tracking-tighter">
              {step === 1 ? 'Arjun Photography' : 'Verification'}
            </h1>
            <p className="text-[14px] text-on-surface-variant mt-1 opacity-70 font-medium text-center">
              {step === 1 ? 'Elevated Photography Management' : 'We sent a one-time password to your email.'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full space-y-8" 
                onSubmit={handleLogin}
              >
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

                {/* CTA Button */}
                <div className="pt-2">
                  <button 
                    disabled={isLoading}
                    className="w-full bg-primary-container hover:bg-primary text-white text-[14px] font-medium py-4 rounded-xl shadow-xl shadow-primary/10 active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 group disabled:opacity-70" 
                    type="submit"
                  >
                    <span>{isLoading ? 'Sending OTP...' : 'Login'}</span>
                    {!isLoading && <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />}
                  </button>
                </div>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="w-full space-y-8" 
                onSubmit={handleOTPVerify}
              >
                {error && (
                  <div className="bg-error-container text-on-error-container p-3 rounded-lg text-sm text-center">
                    {error}
                  </div>
                )}
                
                {/* OTP Field */}
                <div className="relative group">
                  <div className="flex items-center justify-between mb-1 px-1">
                    <div className="flex items-center space-x-3">
                      <Mail className="text-on-surface-variant w-5 h-5" />
                      <label className="text-[14px] font-medium text-on-surface-variant" htmlFor="otp">One Time Password</label>
                    </div>
                  </div>
                  <input 
                    className="w-full bg-transparent border-b border-outline-variant py-3 px-1 text-on-surface text-[24px] tracking-widest text-center transition-all duration-300 placeholder:text-outline-variant/50 focus:outline-none focus:border-primary" 
                    id="otp" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="------" 
                    type="text"
                    maxLength={6}
                    required
                  />
                </div>

                {/* CTA Button */}
                <div className="pt-2">
                  <button 
                    disabled={isLoading}
                    className="w-full bg-primary-container hover:bg-primary text-white text-[14px] font-medium py-4 rounded-xl shadow-xl shadow-primary/10 active:scale-[0.98] transition-all duration-300 flex items-center justify-center space-x-2 group disabled:opacity-70" 
                    type="submit"
                  >
                    <span>{isLoading ? 'Verifying...' : 'Verify & Continue'}</span>
                    {!isLoading && <ArrowRight className="w-[18px] h-[18px] group-hover:translate-x-1 transition-transform" />}
                  </button>
                  <button 
                    type="button"
                    onClick={() => { setStep(1); setOtp(''); setError(''); }}
                    className="w-full mt-4 text-[13px] font-medium text-on-surface-variant hover:text-primary transition-colors text-center"
                  >
                    Back to login
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
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
