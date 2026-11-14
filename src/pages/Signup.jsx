import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ArrowRight } from "lucide-react";

const USERS_KEY = "muse-demo-users";
const ACTIVE_KEY = "muse-user";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    const normalizedEmail = email.trim().toLowerCase();
    if (password.length < 6) {
      setMessage("For the demo form, enter at least 6 characters.");
      return;
    }

    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
      if (users.some((user) => user.email === normalizedEmail)) {
        setMessage("An account with this email already exists. Please sign in.");
        return;
      }

      const profile = {
        name: name.trim(),
        email: normalizedEmail,
        preferences: { budget: "", categories: [] },
      };
      users.push(profile);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
      localStorage.setItem(ACTIVE_KEY, JSON.stringify(profile));
      navigate("/profile");
    } catch {
      setMessage("Unable to create a demo account in this browser.");
    }
  }

  return (
    <div className="min-h-screen bg-[#0b0b12] text-white flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#151421] p-8 shadow-2xl">
        <Link to="/" className="block text-center text-sm font-bold tracking-[.25em] text-violet-300">MUSE</Link>
        <div className="mb-8 mt-5 text-center">
          <h1 className="text-3xl font-bold">Create Your <span className="text-violet-400">Account</span></h1>
          <p className="mt-2 text-gray-400">Join MUSE and shop smarter.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-300">Full name</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0b12] px-4">
              <User className="text-gray-500" size={19} />
              <input required value={name} onChange={(e) => setName(e.target.value)} type="text"
                placeholder="Your name" autoComplete="name" className="w-full bg-transparent py-4 outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-300">Email address</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0b12] px-4">
              <Mail className="text-gray-500" size={19} />
              <input required value={email} onChange={(e) => setEmail(e.target.value)} type="email"
                placeholder="you@example.com" autoComplete="email" className="w-full bg-transparent py-4 outline-none" />
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm text-gray-300">Password</label>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0b0b12] px-4">
              <Lock className="text-gray-500" size={19} />
              <input required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)}
                type="password" placeholder="At least 6 characters" autoComplete="new-password"
                className="w-full bg-transparent py-4 outline-none" />
            </div>
          </div>
          {message && <p role="alert" className="text-sm text-rose-300">{message}</p>}
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-4 font-semibold hover:bg-violet-500">
            Create Account <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-5 rounded-xl border border-amber-300/15 bg-amber-300/5 p-3 text-xs leading-5 text-amber-100/70">
          Demo account only: your name and email are stored in this browser. The password is not saved or verified. Google sign-in is not connected.
        </p>
        <p className="mt-8 text-center text-sm text-gray-400">
          Already have an account? <Link to="/login" className="font-semibold text-violet-400">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
