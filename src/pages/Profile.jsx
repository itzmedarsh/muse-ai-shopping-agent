import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRound, Save, LogOut } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    try {
      const current = JSON.parse(localStorage.getItem("muse-user") || "null");
      if (!current) { navigate("/login"); return; }
      setUser(current);
      setName(current.name || "");
      setBudget(current.preferences?.budget || "");
      setCategories(current.preferences?.categories || []);
    } catch { navigate("/login"); }
  }, [navigate]);

  function saveProfile(event) {
    event.preventDefault();
    const updated = { ...user, name: name.trim(), preferences: { ...(user.preferences || {}), budget, categories } };
    localStorage.setItem("muse-user", JSON.stringify(updated));
    const users = JSON.parse(localStorage.getItem("muse-demo-users") || "[]");
    const nextUsers = users.map((u) => u.email === updated.email ? updated : u);
    localStorage.setItem("muse-demo-users", JSON.stringify(nextUsers));
    setUser(updated);
    window.alert("Demo profile saved.");
  }

  function toggleCategory(value) {
    setCategories((current) => current.includes(value) ? current.filter((item) => item !== value) : [...current, value]);
  }

  function signOut() {
    localStorage.removeItem("muse-user");
    navigate("/login");
  }

  if (!user) return <div className="min-h-screen bg-[#090811]" />;
  const options = ["Fashion", "Audio", "Storage", "Accessories", "Home"];

  return (
    <main className="min-h-screen bg-[#090811] px-5 py-12 text-white">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[.25em] text-violet-300">YOUR MUSE</p>
            <h1 className="mt-3 text-4xl font-bold">My <span className="text-violet-400">Profile.</span></h1>
          </div>
          <button onClick={signOut} className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-300 hover:bg-white/5"><LogOut size={16} /> Sign out</button>
        </div>
        <form onSubmit={saveProfile} className="rounded-3xl border border-white/10 bg-[#151421] p-6 md:p-8">
          <div className="mb-7 flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-violet-500/15 text-violet-300"><UserRound size={30} /></div>
            <div><h2 className="text-xl font-semibold">{user.name}</h2><p className="text-sm text-gray-400">{user.email}</p></div>
          </div>
          <label className="mb-2 block text-sm text-gray-300">Display name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="mb-6 w-full rounded-xl border border-white/10 bg-[#0b0b12] px-4 py-4 outline-none focus:border-violet-400" />
          <label className="mb-2 block text-sm text-gray-300">Preferred shopping budget (₹)</label>
          <input value={budget} onChange={(e) => setBudget(e.target.value)} type="number" min="0" placeholder="e.g. 5000" className="mb-7 w-full rounded-xl border border-white/10 bg-[#0b0b12] px-4 py-4 outline-none focus:border-violet-400" />
          <p className="mb-3 text-sm text-gray-300">Shopping interests</p>
          <div className="mb-8 flex flex-wrap gap-3">
            {options.map((item) => <button key={item} type="button" onClick={() => toggleCategory(item)}
              className={`rounded-full border px-4 py-2 text-sm ${categories.includes(item) ? "border-violet-400 bg-violet-500/20 text-violet-200" : "border-white/10 text-gray-400 hover:border-violet-400/50"}`}>{item}</button>)}
          </div>
          <button type="submit" className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 font-semibold hover:bg-violet-500"><Save size={17} /> Save preferences</button>
        </form>
        <p className="mt-5 text-xs leading-5 text-gray-500">Demo profile information is saved only in this browser. It is not connected to a secure account database.</p>
        <Link to="/" className="mt-6 inline-block text-sm text-violet-300 hover:text-white">← Back to MUSE</Link>
      </div>
    </main>
  );
}
