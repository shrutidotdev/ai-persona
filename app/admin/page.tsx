"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { Loader, BarChart3, Users, MessageSquare, Zap } from "lucide-react";

interface AdminStats {
  totalSessions: number;
  totalMessages: number;
  totalUsers: number;
  avgMessagesPerSession: number;
  topPersonas: Array<{ slug: string; name: string; count: number }>;
  recentSessions: Array<{
    id: string;
    userId: string;
    personaSlug: string;
    title: string;
    messageCount: number;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    const configuredAdminEmails = (process.env.NEXT_PUBLIC_CLERK_ADMIN_EMAILS || "thedeveloper.shruti@gmail.com")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean);

    const isAdmin = user?.emailAddresses?.some(({ emailAddress }) =>
      configuredAdminEmails.includes(emailAddress.toLowerCase())
    );

    if (!user || !isAdmin) {
      router.push("/");
      return;
    }

    fetchStats();
  }, [isLoaded, user, router]);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.error || "Failed to fetch stats");
      }

      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isLoaded || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <Loader className="w-6 h-6 text-yellow-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-red-400">
        Error: {error}
      </div>
    );
  }

  if (!stats) {
    return <div className="text-white text-center p-4">No data</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-white/10 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-bebas text-4xl text-yellow-400">ADMIN DASHBOARD</h1>
          <p className="font-mono text-xs text-neutral-500 mt-2">
            Pitch Persona Analytics
          </p>
        </div>
      </header>

      {/* Main Content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              icon={<Users className="w-5 h-5" />}
              label="Total Users"
              value={stats.totalUsers}
            />
            <StatCard
              icon={<BarChart3 className="w-5 h-5" />}
              label="Total Sessions"
              value={stats.totalSessions}
            />
            <StatCard
              icon={<MessageSquare className="w-5 h-5" />}
              label="Total Messages"
              value={stats.totalMessages}
            />
            <StatCard
              icon={<Zap className="w-5 h-5" />}
              label="Avg Messages/Session"
              value={stats.avgMessagesPerSession.toFixed(1)}
            />
          </div>

          {/* Top Personas */}
          <div className="bg-neutral-950 border border-white/10 rounded-lg p-6">
            <h2 className="font-bebas text-2xl text-yellow-400 mb-6">
              Top Personas
            </h2>
            <div className="space-y-3">
              {stats.topPersonas.length === 0 ? (
                <p className="text-neutral-500">No data yet</p>
              ) : (
                stats.topPersonas.map((persona, idx) => (
                  <div
                    key={persona.slug}
                    className="flex items-center justify-between p-3 bg-neutral-900 rounded border border-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                        #{idx + 1}
                      </span>
                      <span className="font-mono text-sm">{persona.name}</span>
                    </div>
                    <span className="font-bebas text-lg text-yellow-400">
                      {persona.count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Sessions */}
          <div className="bg-neutral-950 border border-white/10 rounded-lg p-6">
            <h2 className="font-bebas text-2xl text-yellow-400 mb-6">
              Recent Sessions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 font-mono text-xs text-neutral-500">
                      Title
                    </th>
                    <th className="text-left py-3 px-4 font-mono text-xs text-neutral-500">
                      Persona
                    </th>
                    <th className="text-center py-3 px-4 font-mono text-xs text-neutral-500">
                      Messages
                    </th>
                    <th className="text-left py-3 px-4 font-mono text-xs text-neutral-500">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSessions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-neutral-500">
                        No sessions yet
                      </td>
                    </tr>
                  ) : (
                    stats.recentSessions.map((session) => (
                      <tr
                        key={session.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-xs text-neutral-300">
                          {session.title}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-yellow-400">
                          {session.personaSlug}
                        </td>
                        <td className="py-3 px-4 text-center font-mono text-xs">
                          {session.messageCount}
                        </td>
                        <td className="py-3 px-4 font-mono text-xs text-neutral-500">
                          {new Date(session.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}

function StatCard({ icon, label, value }: StatCardProps) {
  return (
    <div className="bg-neutral-950 border border-white/10 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <span className="font-mono text-xs uppercase tracking-widest text-neutral-500">
          {label}
        </span>
        <div className="text-yellow-400">{icon}</div>
      </div>
      <p className="font-bebas text-4xl text-white">{value}</p>
    </div>
  );
}
