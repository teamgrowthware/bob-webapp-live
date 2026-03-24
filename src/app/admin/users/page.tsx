"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Shield, MoreVertical } from "lucide-react";

export default function UsersAdmin() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">Citizen Management</h1>
          <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Manage the BOB population</p>
        </div>
        <div className="flex gap-4">
           <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-4 flex items-center gap-3 h-12">
              <Search size={18} className="text-zinc-600" />
              <input placeholder="Search users..." className="bg-transparent border-none focus:outline-none text-sm font-bold placeholder:text-zinc-700" />
           </div>
           <button className="bg-zinc-900 border border-zinc-800 p-3 rounded-2xl text-zinc-500 hover:text-white transition-colors">
              <Filter size={18} />
           </button>
        </div>
      </div>

      <div className="bg-zinc-900/30 border border-zinc-900 rounded-[40px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-900 bg-zinc-950/50">
              <th className="px-8 py-6 text-xs font-black uppercase text-zinc-500 tracking-widest">User</th>
              <th className="px-8 py-6 text-xs font-black uppercase text-zinc-500 tracking-widest">Role</th>
              <th className="px-8 py-6 text-xs font-black uppercase text-zinc-500 tracking-widest">Stats</th>
              <th className="px-8 py-6 text-xs font-black uppercase text-zinc-500 tracking-widest">Joined</th>
              <th className="px-8 py-6 text-xs font-black uppercase text-zinc-500 tracking-widest"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-900">
            {loading ? (
              <tr><td colSpan={5} className="px-8 py-20 text-center font-black italic text-zinc-700 uppercase">Retrieving Database...</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="hover:bg-zinc-900/40 transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-violet-600/20 items-center justify-center flex font-black text-violet-500 italic uppercase">
                      {user.name?.[0] || user.phone[0]}
                    </div>
                    <div>
                      <div className="font-black text-white italic uppercase">{user.name || "Anonymous Brain"}</div>
                      <div className="text-xs font-bold text-zinc-500">{user.phone}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md border ${
                    user.role === 'ADMIN' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    user.role === 'TEACHER' ? 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20' : 
                    'bg-violet-500/10 text-violet-500 border-violet-500/20'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="text-xs font-bold text-zinc-300 tracking-tight">{user.xp?.toLocaleString()} XP • {user.coins} Coins</div>
                </td>
                <td className="px-8 py-6">
                  <div className="text-xs font-bold text-zinc-500 uppercase">{new Date(user.createdAt).toLocaleDateString()}</div>
                </td>
                <td className="px-8 py-6 text-right">
                  <button className="text-zinc-700 hover:text-white transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
