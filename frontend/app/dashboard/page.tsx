'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Converts "about css" -> "About Css" for consistent display casing
const toTitleCase = (text: string) =>
  text
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

const getProgressColor = (progress: number) => {
  if (progress === 100) return 'bg-emerald-500';
  if (progress >= 75) return 'bg-blue-500';
  if (progress >= 50) return 'bg-amber-500';
  return 'bg-rose-500';
};

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchStats();
    }
  }, [isAuthenticated, user]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/dashboard/stats', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  if (isLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans">
        <p className="text-lg text-black">Loading...</p>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  const statCards = [
    { label: 'Total Tasks', value: stats?.summary?.totalTasks || 0, color: 'text-black' },
    { label: 'Completed', value: stats?.summary?.completedTasks || 0, color: 'text-emerald-600' },
    { label: 'Pending', value: stats?.summary?.pendingTasks || 0, color: 'text-blue-600' },
    { label: 'Learning Topics', value: stats?.summary?.totalLearning || 0, color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-3 sm:mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-0.5">A quick overview of your tasks and learning.</p>
        </div>

        {/* Stats Cards — vertical layout, responsive grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="flex flex-col bg-white p-5 sm:p-6 rounded-xl shadow hover:shadow-lg transition"
            >
              <p className="text-gray-500 text-xs sm:text-sm font-medium uppercase tracking-wide mb-2">
                {card.label}
              </p>
              <p className={`text-2xl sm:text-3xl font-bold ${card.color}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Tasks by Day */}
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
            <h3 className="text-lg sm:text-xl font-bold text-black tracking-tight mb-4">
              Tasks Completed (Last 7 Days)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.charts?.tasksByDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Tasks by Priority */}
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
            <h3 className="text-lg sm:text-xl font-bold text-black tracking-tight mb-4">
              Tasks by Priority
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.charts?.tasksByPriority || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(stats?.charts?.tasksByPriority || []).map(
                    (entry: { name: string; value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    )
                  )}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Tasks by Status */}
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
            <h3 className="text-lg sm:text-xl font-bold text-black tracking-tight mb-4">
              Tasks by Status
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.charts?.tasksByStatus || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#3b82f6" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Learning Progress — vertical cards instead of plain rows */}
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
            <h3 className="text-lg sm:text-xl font-bold text-black tracking-tight mb-4">
              Learning Progress
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {(stats?.charts?.learningProgress || []).map((topic: any, index: number) => (
                <div key={index} className="flex flex-col bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-black font-semibold text-sm">
                      {toTitleCase(topic.title)}
                    </span>
                    <span className="text-black text-sm font-bold">{topic.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getProgressColor(
                        topic.progress
                      )}`}
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              {(!stats?.charts?.learningProgress || stats.charts.learningProgress.length === 0) && (
                <p className="text-gray-500 text-sm">No learning topics yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons — responsive stack on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <a
            href="/tasks"
            className="bg-blue-500 text-white p-5 sm:p-6 rounded-xl shadow hover:bg-blue-600 hover:shadow-lg transition text-center font-semibold"
          >
            Manage Tasks
          </a>
          <a
            href="/learning"
            className="bg-purple-500 text-white p-5 sm:p-6 rounded-xl shadow hover:bg-purple-600 hover:shadow-lg transition text-center font-semibold"
          >
            Learning Tracker
          </a>
          <a
            href="/activity"
            className="bg-emerald-500 text-white p-5 sm:p-6 rounded-xl shadow hover:bg-emerald-600 hover:shadow-lg transition text-center font-semibold"
          >
            Activity Log
          </a>
        </div>
      </div>
    </div>
  );
}
