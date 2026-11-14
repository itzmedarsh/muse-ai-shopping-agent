import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";

const USERS_KEY = "muse-demo-users";
const ACTIVE_KEY = "muse-user";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !password) {
      setMessage("Enter your email and password to continue.");
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      const account = users.find((user) => user.email === normalizedEmail);
      if (!account) {
        setMessage("No demo account found for this email. Please create an account first.");
        return;
      }

      // Demo-only sign-in: passwords are intentionally not stored in browser storage.
      localStorage.setItem(ACTIVE_KEY, JSON.stringify({
        name: account.name,
        email: account.email,
        preferences: account.preferences || {},
      }));
      navigate("/profile");
    } catch {
      setMessage("Unable to sign in on this browser. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151421] p-8 shadow-2xl">
        <Link to="/" className="block text-center text-sm font-bold tracking-[.25em] text-violet-300">MUSE</Link>
        <div className="mb-8 mt-5 text-center">
          <h1 className="text-3xl font-bold">Welcome <span className="text-violet-400">Back</span></h1>
          <p className="mt-2 text-gray-400">Sign in to continue shopping smarter.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-300">Email address</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0b12] px-4">
              <Mail className="text-gray-500" size={19} />
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email"
                className="w-full bg-transparent py-4 outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-300">Password</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0b12] px-4">
              <Lock className="text-gray-500" size={19} />
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter any demo password" autoComplete="current-password"
                className="w-full bg-transparent py-4 outline-none" />
            </div>
          </div>
          {message && <p role="alert" className="text-sm text-rose-300">{message}</p>}
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold hover:bg-violet-500">
            Sign In <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/5 p-3 text-xs leading-5 text-amber-100/70">
          Demo account only: this prototype stores your name and email in this browser. Passwords are not saved or verified. Do not use a real password.
        </p>
        <p className="mt-8 text-center text-sm text-gray-400">
          Don't have an account? <Link to="/signup" className="font-semibold text-violet-400">Create account</Link>
        </p>
      </div>
    </div>
  );
}
