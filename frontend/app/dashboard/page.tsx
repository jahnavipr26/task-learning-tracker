'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-black">Loading...</p>
      </div>
    );
  }

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold text-black mb-8">Dashboard</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-black text-sm">Total Tasks</p>
            <p className="text-3xl font-bold text-black">
              {stats?.summary?.totalTasks || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-black text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">
              {stats?.summary?.completedTasks || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-black text-sm">Pending</p>
            <p className="text-3xl font-bold text-blue-600">
              {stats?.summary?.pendingTasks || 0}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-black text-sm">Learning Topics</p>
            <p className="text-3xl font-bold text-purple-600">
              {stats?.summary?.totalLearning || 0}
            </p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Tasks by Day */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-black mb-4">Tasks Completed (Last 7 Days)</h3>
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
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-black mb-4">Tasks by Priority</h3>
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
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-black mb-4">Tasks by Status</h3>
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

          {/* Learning Progress */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-xl font-bold text-black mb-4">Learning Progress</h3>
            <div className="space-y-4">
              {(stats?.charts?.learningProgress || []).map((topic: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <span className="text-black font-semibold">{topic.title}</span>
                    <span className="text-black">{topic.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a href="/tasks" className="bg-blue-500 text-white p-6 rounded-lg shadow hover:bg-blue-600 text-center font-semibold">
            Manage Tasks
          </a>
          <a href="/learning" className="bg-purple-500 text-white p-6 rounded-lg shadow hover:bg-purple-600 text-center font-semibold">
            Learning Tracker
          </a>
          <a href="/activity" className="bg-green-500 text-white p-6 rounded-lg shadow hover:bg-green-600 text-center font-semibold">
            Activity Log
          </a>
        </div>
      </div>
    </div>
  );
}