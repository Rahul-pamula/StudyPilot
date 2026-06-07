"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { api } from "@/lib/api";

type AuthStep = "login" | "register-email" | "register-otp" | "register-creds" | "forgot-email" | "forgot-otp" | "forgot-reset";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [step, setStep]     = useState<AuthStep>("login");
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);

  // Form state
  const [username, setUsername]       = useState("");
  const [password, setPassword]       = useState("");
  const [email, setEmail]             = useState("");
  const [otp, setOtp]                 = useState("");
  const [newPass, setNewPass]         = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  useEffect(() => { if (user) router.replace("/dashboard"); }, [user]);

  const handleErr = (e: unknown) => setError((e as Error).message || "Something went wrong");

  const doLogin = async () => {
    setLoading(true); setError("");
    try {
      const res = await api.auth.login(username, password);
      login(res.access_token, res.username, res.email);
      router.push("/dashboard");
    } catch(e) { handleErr(e); } finally { setLoading(false); }
  };

  const doRequestOtp = async () => {
    setLoading(true); setError("");
    try { await api.auth.requestOtp(email); setStep("register-otp"); }
    catch(e) { handleErr(e); } finally { setLoading(false); }
  };

  const doVerifyOtp = async () => {
    setLoading(true); setError("");
    try { await api.auth.verifyOtp(email, otp); setStep("register-creds"); }
    catch(e) { handleErr(e); } finally { setLoading(false); }
  };

  const doRegister = async () => {
    if (newPass !== confirmPass) { setError("Passwords don't match"); return; }
    setLoading(true); setError("");
    try {
      const res = await api.auth.registerComplete(email, otp, username, newPass);
      login(res.access_token, res.username, res.email);
      router.push("/dashboard");
    } catch(e) { handleErr(e); } finally { setLoading(false); }
  };

  const doForgotOtp = async () => {
    setLoading(true); setError("");
    try { await api.auth.forgotRequestOtp(email); setStep("forgot-otp"); }
    catch(e) { handleErr(e); } finally { setLoading(false); }
  };

  const doReset = async () => {
    if (newPass !== confirmPass) { setError("Passwords don't match"); return; }
    setLoading(true); setError("");
    try { await api.auth.forgotReset(email, otp, newPass); setStep("login"); setError(""); }
    catch(e) { handleErr(e); } finally { setLoading(false); }
  };

  const inputCls = "w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-slate-400 bg-white";
  const btnCls   = "w-full py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const linkCls  = "text-blue-600 text-sm hover:underline cursor-pointer";

  const titles: Record<AuthStep, string> = {
    "login": "Sign in", "register-email": "Create account", "register-otp": "Verify email",
    "register-creds": "Set credentials", "forgot-email": "Reset password",
    "forgot-otp": "Enter OTP", "forgot-reset": "New password",
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4">
      <div className="mb-6 text-center">
        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg mx-auto mb-2">✈</div>
        <h1 className="text-xl font-bold text-slate-900">StudyPilot</h1>
        <p className="text-slate-500 text-sm">AI-powered learning workspace</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-sm bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-slate-900 mb-5">{titles[step]}</h2>

          {error && (
            <div className="mb-4 px-3.5 py-2.5 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">{error}</div>
          )}

          {step === "login" && (
            <div className="space-y-3">
              <input className={inputCls} placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
              <input className={inputCls} placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && doLogin()} />
              <button className={btnCls} onClick={doLogin} disabled={loading}>{loading ? "Signing in…" : "Sign In →"}</button>
              <div className="flex justify-between text-sm pt-1">
                <span className={linkCls} onClick={() => { setStep("register-email"); setError(""); }}>Create account</span>
                <span className={linkCls} onClick={() => { setStep("forgot-email"); setError(""); }}>Forgot password?</span>
              </div>
            </div>
          )}

          {step === "register-email" && (
            <div className="space-y-3">
              <input className={inputCls} placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} />
              <button className={btnCls} onClick={doRequestOtp} disabled={loading}>{loading ? "Sending…" : "Send Verification Code →"}</button>
              <span className={linkCls} onClick={() => { setStep("login"); setError(""); }}>← Back to Sign In</span>
            </div>
          )}

          {step === "register-otp" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Code sent to <strong>{email}</strong></p>
              <input className={inputCls} placeholder="6-digit code" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
              <button className={btnCls} onClick={doVerifyOtp} disabled={loading}>{loading ? "Verifying…" : "Verify →"}</button>
              <span className={linkCls} onClick={() => setStep("register-email")}>← Change email</span>
            </div>
          )}

          {step === "register-creds" && (
            <div className="space-y-3">
              <p className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg">✓ Email verified: {email}</p>
              <input className={inputCls} placeholder="Choose a username" value={username} onChange={e => setUsername(e.target.value)} />
              <input className={inputCls} placeholder="Password" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
              <input className={inputCls} placeholder="Confirm password" type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
              <button className={btnCls} onClick={doRegister} disabled={loading}>{loading ? "Creating…" : "Create Account →"}</button>
            </div>
          )}

          {step === "forgot-email" && (
            <div className="space-y-3">
              <input className={inputCls} placeholder="Registered email" value={email} onChange={e => setEmail(e.target.value)} />
              <button className={btnCls} onClick={doForgotOtp} disabled={loading}>{loading ? "Sending…" : "Send Reset Code →"}</button>
              <span className={linkCls} onClick={() => { setStep("login"); setError(""); }}>← Back to Sign In</span>
            </div>
          )}

          {step === "forgot-otp" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Code sent to <strong>{email}</strong></p>
              <input className={inputCls} placeholder="6-digit code" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} />
              <button className={btnCls} onClick={async () => {
                setLoading(true); setError("");
                try { await api.auth.verifyOtp(email, otp); setStep("forgot-reset"); }
                catch(e) { handleErr(e); } finally { setLoading(false); }
              }} disabled={loading}>{loading ? "Verifying…" : "Verify →"}</button>
            </div>
          )}

          {step === "forgot-reset" && (
            <div className="space-y-3">
              <input className={inputCls} placeholder="New password" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} />
              <input className={inputCls} placeholder="Confirm new password" type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} />
              <button className={btnCls} onClick={doReset} disabled={loading}>{loading ? "Updating…" : "Update Password →"}</button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
