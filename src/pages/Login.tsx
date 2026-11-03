import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  UserPlus, 
  Shield, 
  Target, 
  BarChart3, 
  ShieldCheck, 
  ChevronDown, 
  User, 
  CheckCircle2, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { BrandLogo } from '../components/auth/BrandLogo';

export const Login: React.FC = () => {
  const { navigate, login } = useApp();

  // Mode: 'login' | 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation & status states
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [demoSuccessMessage, setDemoSuccessMessage] = useState<string | null>(null);

  // Validate Email
  const validateEmail = (val: string) => {
    if (!val.trim()) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(val)) return 'Please enter a valid email address';
    return '';
  };

  // Handle Login Submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Simulate authenticating in demo mode
    setTimeout(() => {
      setIsLoading(false);
      login(email, 'Athlete');
      setDemoSuccessMessage('Demo Login successful! Entering Athlete Studio...');
      setTimeout(() => {
        navigate('dashboard');
      }, 700);
    }, 800);
  };

  // Handle Registration Submission
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';

    const emailErr = validateEmail(email);
    if (emailErr) newErrors.email = emailErr;

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false);
      login(email, fullName);
      setDemoSuccessMessage('Account registered in demo mode! Directing to Dashboard...');
      setTimeout(() => {
        navigate('dashboard');
      }, 700);
    }, 800);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#2C271C] text-[#F8F1D9] select-none font-sans flex flex-col justify-between">
      {/* 1. PHOTOGRAPHIC BACKGROUND WITH EXACT CROPPING */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url('/athlete-hero-bg.jpg')`,
          backgroundPosition: 'center 35%',
        }}
      />

      {/* 2. CINEMATIC GRADIENT OVERLAYS */}
      {/* Left dark vignette for hero text readability */}
      <div className="fixed inset-0 z-0 bg-gradient-to-r from-[#1E190F]/85 via-[#1E190F]/50 to-transparent pointer-events-none" />
      {/* Warm golden morning sun sheen across viewport */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40 mix-blend-soft-light"
        style={{
          background: 'radial-gradient(ellipse at 80% 20%, rgba(245, 215, 140, 0.45) 0%, rgba(110, 80, 40, 0.1) 70%, transparent 100%)',
        }}
      />
      {/* Bottom ambient shade */}
      <div className="fixed inset-0 z-0 bg-gradient-to-t from-[#1C170E]/80 via-transparent to-transparent pointer-events-none" />

      {/* 3. FINE GOLDEN DECORATIVE CURVED CONTOUR LINES */}
      <svg 
        className="fixed inset-0 z-0 w-full h-full pointer-events-none opacity-30" 
        viewBox="0 0 1664 936" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {/* Upper flowing arc */}
        <path 
          d="M-50 140 C 250 170, 480 260, 680 340" 
          stroke="#F4E9C7" 
          strokeWidth="1.2" 
          strokeDasharray="4 2"
        />
        {/* Hip/Body contour wave */}
        <path 
          d="M 520 740 C 650 670, 750 710, 840 820 C 900 890, 1100 870, 1300 780" 
          stroke="#F4E9C7" 
          strokeWidth="1" 
        />
        {/* Right side lower arc */}
        <path 
          d="M 1200 900 C 1380 840, 1500 760, 1680 720" 
          stroke="#F4E9C7" 
          strokeWidth="1" 
        />
      </svg>

      {/* 4. TOP-LEFT BRAND HEADER */}
      <header className="relative z-10 w-full pt-7 sm:pt-9 px-[4.5%] flex items-center justify-between">
        <div className="flex items-center">
          {/* Logo icon */}
          <BrandLogo size="md" className="mr-3.5" />

          {/* Brand Name */}
          <span className="font-serif font-bold text-xl sm:text-2xl text-[#F8F1D9] tracking-normal drop-shadow-sm">
            AthleteGuard AI
          </span>

          {/* Thin vertical separator */}
          <div className="h-6 w-[1.5px] bg-[#C6B58A]/45 mx-4 sm:mx-5" />

          {/* Tagline */}
          <div className="text-[11px] sm:text-[12px] leading-[1.25] text-[#D8CBB0] font-normal tracking-wide">
            <div>Smarter Analysis.</div>
            <div>Stronger You.</div>
          </div>
        </div>

        {/* Quick link to bypass login for reviewers/developers */}
        <button
          onClick={() => {
            login('guest@athleteguard.ai', 'Guest Athlete');
            navigate('dashboard');
          }}
          className="text-xs text-[#EADBB6]/70 hover:text-[#F8F1D9] underline underline-offset-4 transition-colors hidden sm:block"
        >
          Skip to Studio &rarr;
        </button>
      </header>

      {/* 5. MAIN CONTENT TWO-COLUMN GRID */}
      <main className="relative z-10 w-full flex-1 px-[4.5%] py-6 sm:py-8 lg:py-10 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-12">
        {/* LEFT HERO SECTION */}
        <div className="w-full lg:w-1/2 max-w-2xl flex flex-col justify-center pt-2 sm:pt-4 lg:pt-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            {/* Eyebrow */}
            <p className="text-[11px] sm:text-xs font-semibold tracking-[0.26em] text-[#C6B58A] uppercase mb-4 sm:mb-5">
              WELCOME TO ATHLETEGUARD AI
            </p>

            {/* Headline */}
            <h1 className="font-serif font-bold text-5xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[0.98] sm:leading-[1.02] text-[#F8F1D9] tracking-tight mb-5 drop-shadow-md">
              Every Move<br />
              Is Progress.
            </h1>

            {/* Supporting paragraph */}
            <p className="text-sm sm:text-base text-[#E2D5BE] max-w-md leading-relaxed font-normal mb-8 sm:mb-10 drop-shadow">
              AI-powered movement analysis to help you train smarter, move better and reach your goals.
            </p>

            {/* Feature items */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-6 pt-1 max-w-xl">
              {/* Feature 1 */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border border-[#D5C29D]/50 bg-black/20 backdrop-blur-md flex items-center justify-center text-[#F8F1D9] flex-shrink-0 shadow-sm">
                  <Target className="w-5 h-5 stroke-[1.6]" />
                </div>
                <div className="text-xs sm:text-[13px] font-medium text-[#F8F1D9] leading-tight">
                  <div>Real-time</div>
                  <div>Pose Detection</div>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border border-[#D5C29D]/50 bg-black/20 backdrop-blur-md flex items-center justify-center text-[#F8F1D9] flex-shrink-0 shadow-sm">
                  <BarChart3 className="w-5 h-5 stroke-[1.6]" />
                </div>
                <div className="text-xs sm:text-[13px] font-medium text-[#F8F1D9] leading-tight">
                  <div>Movement</div>
                  <div>Analytics</div>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full border border-[#D5C29D]/50 bg-black/20 backdrop-blur-md flex items-center justify-center text-[#F8F1D9] flex-shrink-0 shadow-sm">
                  <ShieldCheck className="w-5 h-5 stroke-[1.6]" />
                </div>
                <div className="text-xs sm:text-[13px] font-medium text-[#F8F1D9] leading-tight">
                  <div>Build a</div>
                  <div>Healthier You</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* RIGHT TRANSLUCENT GLASSMORPHISM CARD */}
        <div className="w-full lg:w-[48%] xl:w-[45%] flex justify-center lg:justify-end">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative w-full max-w-[530px] rounded-[32px] p-7 sm:p-9 md:p-11 overflow-hidden"
            style={{
              background: 'linear-gradient(145deg, rgba(238, 227, 198, 0.52) 0%, rgba(214, 198, 163, 0.38) 100%)',
              backdropFilter: 'blur(28px) saturate(130%)',
              WebkitBackdropFilter: 'blur(28px) saturate(130%)',
              border: '1.2px solid rgba(255, 255, 255, 0.45)',
              boxShadow: '0 25px 60px -15px rgba(28, 20, 10, 0.45), inset 0 1.5px 2px rgba(255, 255, 255, 0.55), inset 0 0 0 1px rgba(255, 255, 255, 0.25)',
            }}
          >
            {/* Delicate glass bracket / corner accent hugging the upper-right */}
            <div 
              className="absolute top-4 right-4 w-11 h-11 border-t-[1.8px] border-r-[1.8px] border-white/50 rounded-tr-[24px] pointer-events-none" 
            />

            {/* Subtle top edge highlight */}
            <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white/70 to-transparent pointer-events-none" />

            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                /* ======================== LOGIN VIEW ======================== */
                <motion.div
                  key="login-form"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Card Header: Logo, Title, Subtitle */}
                  <div className="flex flex-col items-center text-center mb-7 sm:mb-8">
                    <BrandLogo size="lg" className="mb-3.5 shadow-md" />
                    <h2 className="font-serif font-bold text-2xl sm:text-[28px] text-[#3A2B1E] tracking-tight">
                      AthleteGuard AI
                    </h2>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6E5B48] mt-1.5">
                      LOGIN TO YOUR ACCOUNT
                    </p>
                  </div>

                  {/* Demo Success Toast */}
                  {demoSuccessMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-5 p-3 rounded-2xl bg-[#5B6141]/90 text-[#F8F1D9] text-xs flex items-center gap-2.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{demoSuccessMessage}</span>
                    </motion.div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleLoginSubmit} noValidate className="space-y-4">
                    {/* Email Input */}
                    <div>
                      <div 
                        className={`relative flex items-center h-[56px] px-5 rounded-full border transition-all duration-200 ${
                          errors.email 
                            ? 'border-red-500 bg-[#E8DCBF]/70 ring-1 ring-red-500/50' 
                            : 'border-white/55 bg-[#E8DCBF]/50 focus-within:bg-[#E8DCBF]/75 focus-within:border-[#8C765C] focus-within:ring-2 focus-within:ring-[#70503A]/25'
                        }`}
                      >
                        <Mail className="w-5 h-5 text-[#705C49] mr-3 flex-shrink-0" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                          }}
                          placeholder="Email address"
                          autoComplete="email"
                          className="w-full bg-transparent text-sm sm:text-[15px] text-[#382B1F] placeholder-[#8E7E6A] font-medium outline-none"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1.5 ml-4 text-[12px] text-red-700 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Password Input */}
                    <div>
                      <div 
                        className={`relative flex items-center h-[56px] px-5 rounded-full border transition-all duration-200 ${
                          errors.password 
                            ? 'border-red-500 bg-[#E8DCBF]/70 ring-1 ring-red-500/50' 
                            : 'border-white/55 bg-[#E8DCBF]/50 focus-within:bg-[#E8DCBF]/75 focus-within:border-[#8C765C] focus-within:ring-2 focus-within:ring-[#70503A]/25'
                        }`}
                      >
                        <Lock className="w-5 h-5 text-[#705C49] mr-3 flex-shrink-0" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                          }}
                          placeholder="Password"
                          autoComplete="current-password"
                          className="w-full bg-transparent text-sm sm:text-[15px] text-[#382B1F] placeholder-[#8E7E6A] font-medium outline-none pr-2"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[#786653] hover:text-[#423223] transition-colors p-1"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1.5 ml-4 text-[12px] text-red-700 font-medium flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Login Submit Button */}
                    <div className="pt-1.5">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="group w-full h-[56px] rounded-full bg-[#5A603E] hover:bg-[#4E5434] active:bg-[#404629] text-[#F8F1D9] font-medium text-[15px] flex items-center justify-center gap-2 shadow-md transition-all duration-200 disabled:opacity-75 disabled:cursor-wait"
                        style={{
                          boxShadow: '0 6px 16px rgba(45, 48, 25, 0.35)',
                        }}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <span>Login</span>
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* OR Divider */}
                    <div className="flex items-center my-5 sm:my-6">
                      <div className="flex-1 h-[1px] bg-[#BFAEA0]/55" />
                      <span className="px-4 text-[11px] font-semibold text-[#7D6B57] uppercase tracking-wider">
                        OR
                      </span>
                      <div className="flex-1 h-[1px] bg-[#BFAEA0]/55" />
                    </div>

                    {/* Create New Account Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setMode('register');
                        setErrors({});
                      }}
                      className="w-full h-[56px] rounded-full border border-[#8C755D]/60 hover:border-[#70503A] bg-transparent hover:bg-[#E8DCBF]/40 text-[#4E3B2E] font-medium text-[14px] sm:text-[15px] flex items-center justify-center gap-2 transition-all duration-200"
                    >
                      <UserPlus className="w-4 h-4 text-[#5F4B3C]" />
                      <span>Create a new account</span>
                    </button>
                  </form>

                  {/* Security Disclaimer */}
                  <div className="mt-7 pt-2 flex items-start gap-2.5 text-[#6D5D4E]">
                    <Shield className="w-4 h-4 text-[#70503A] flex-shrink-0 mt-0.5" />
                    <div className="text-[11px] sm:text-[11.5px] leading-tight space-y-0.5">
                      <p>This is a demo application for educational purposes only.</p>
                      <p>Passwords are not stored securely.</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* ======================== REGISTER VIEW ======================== */
                <motion.div
                  key="register-form"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col items-center text-center mb-6">
                    <BrandLogo size="lg" className="mb-3.5 shadow-md" />
                    <h2 className="font-serif font-bold text-2xl sm:text-[28px] text-[#3A2B1E] tracking-tight">
                      AthleteGuard AI
                    </h2>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#6E5B48] mt-1.5">
                      CREATE YOUR ACCOUNT
                    </p>
                  </div>

                  {demoSuccessMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-5 p-3 rounded-2xl bg-[#5B6141]/90 text-[#F8F1D9] text-xs flex items-center gap-2.5 shadow-sm"
                    >
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{demoSuccessMessage}</span>
                    </motion.div>
                  )}

                  <form onSubmit={handleRegisterSubmit} noValidate className="space-y-3.5">
                    {/* Full Name */}
                    <div>
                      <div 
                        className={`relative flex items-center h-[52px] px-5 rounded-full border transition-all duration-200 ${
                          errors.fullName 
                            ? 'border-red-500 bg-[#E8DCBF]/70' 
                            : 'border-white/55 bg-[#E8DCBF]/50 focus-within:bg-[#E8DCBF]/75 focus-within:border-[#8C765C]'
                        }`}
                      >
                        <User className="w-4 h-4 text-[#705C49] mr-3 flex-shrink-0" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: '' }));
                          }}
                          placeholder="Full Name"
                          className="w-full bg-transparent text-sm text-[#382B1F] placeholder-[#8E7E6A] font-medium outline-none"
                        />
                      </div>
                      {errors.fullName && (
                        <p className="mt-1 ml-4 text-[11px] text-red-700 font-medium">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <div 
                        className={`relative flex items-center h-[52px] px-5 rounded-full border transition-all duration-200 ${
                          errors.email 
                            ? 'border-red-500 bg-[#E8DCBF]/70' 
                            : 'border-white/55 bg-[#E8DCBF]/50 focus-within:bg-[#E8DCBF]/75 focus-within:border-[#8C765C]'
                        }`}
                      >
                        <Mail className="w-4 h-4 text-[#705C49] mr-3 flex-shrink-0" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                          }}
                          placeholder="Email address"
                          className="w-full bg-transparent text-sm text-[#382B1F] placeholder-[#8E7E6A] font-medium outline-none"
                        />
                      </div>
                      {errors.email && (
                        <p className="mt-1 ml-4 text-[11px] text-red-700 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Password */}
                    <div>
                      <div 
                        className={`relative flex items-center h-[52px] px-5 rounded-full border transition-all duration-200 ${
                          errors.password 
                            ? 'border-red-500 bg-[#E8DCBF]/70' 
                            : 'border-white/55 bg-[#E8DCBF]/50 focus-within:bg-[#E8DCBF]/75 focus-within:border-[#8C765C]'
                        }`}
                      >
                        <Lock className="w-4 h-4 text-[#705C49] mr-3 flex-shrink-0" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors((prev) => ({ ...prev, password: '' }));
                          }}
                          placeholder="Create password"
                          className="w-full bg-transparent text-sm text-[#382B1F] placeholder-[#8E7E6A] font-medium outline-none pr-2"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-[#786653] hover:text-[#423223] transition-colors p-1"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="mt-1 ml-4 text-[11px] text-red-700 font-medium">
                          {errors.password}
                        </p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <div 
                        className={`relative flex items-center h-[52px] px-5 rounded-full border transition-all duration-200 ${
                          errors.confirmPassword 
                            ? 'border-red-500 bg-[#E8DCBF]/70' 
                            : 'border-white/55 bg-[#E8DCBF]/50 focus-within:bg-[#E8DCBF]/75 focus-within:border-[#8C765C]'
                        }`}
                      >
                        <Lock className="w-4 h-4 text-[#705C49] mr-3 flex-shrink-0" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                          }}
                          placeholder="Confirm password"
                          className="w-full bg-transparent text-sm text-[#382B1F] placeholder-[#8E7E6A] font-medium outline-none pr-2"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="text-[#786653] hover:text-[#423223] transition-colors p-1"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="mt-1 ml-4 text-[11px] text-red-700 font-medium">
                          {errors.confirmPassword}
                        </p>
                      )}
                    </div>

                    {/* Register Button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-[52px] rounded-full bg-[#5A603E] hover:bg-[#4E5434] text-[#F8F1D9] font-medium text-[15px] flex items-center justify-center gap-2 shadow-md transition-all duration-200"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Creating Account...</span>
                          </>
                        ) : (
                          <>
                            <span>Register &amp; Get Started</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>

                    {/* Back to Login */}
                    <div className="pt-1 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          setMode('login');
                          setErrors({});
                        }}
                        className="text-xs text-[#554133] hover:text-[#382B1F] font-semibold underline underline-offset-4"
                      >
                        Already have an account? Sign in
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </main>

      {/* 6. BOTTOM DECORATIVE FOOTER (EXPLORE INDICATOR & HANDWRITTEN ACCENT) */}
      <footer className="relative z-10 w-full pb-7 px-[4.5%] flex items-end justify-between">
        {/* Bottom Left: Scroll to explore */}
        <div className="flex items-center gap-3 text-[#D8CBB0] text-xs font-normal">
          {/* Vertical accent */}
          <div className="h-5 w-[1.5px] bg-[#C6B58A]/60" />
          {/* Dotted indicator */}
          <span className="tracking-[0.25em] text-[#C6B58A]/80 font-mono text-[13px]">
            ·····
          </span>
          {/* Label */}
          <span className="tracking-wide">Scroll to explore</span>
          <ChevronDown className="w-3.5 h-3.5 text-[#C6B58A]" />
        </div>

        {/* Bottom Right: Handwritten "Move Better" accent with brush underline */}
        <div className="relative flex flex-col items-end pr-2 sm:pr-6 pointer-events-none">
          <span 
            className="font-handwriting text-3xl sm:text-4xl text-[#F8F1D9] -rotate-6 tracking-wide drop-shadow select-none"
            style={{ textShadow: '0 2px 8px rgba(30, 20, 10, 0.4)' }}
          >
            Move Better
          </span>
          {/* Brush-style underline SVG */}
          <svg 
            className="w-24 sm:w-28 h-2 -mt-1 -rotate-6 text-[#F8F1D9] opacity-90" 
            viewBox="0 0 120 10" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M 5 5 Q 60 9, 115 4" 
              stroke="currentColor" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
            />
          </svg>
        </div>
      </footer>
    </div>
  );
};
