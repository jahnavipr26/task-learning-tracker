'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';

interface Learning {
  id: string;
  title: string;
  description?: string;
  progress: number;
  notes?: string;
  completed: boolean;
  createdAt: string;
}

// Converts "about css" -> "About Css" for consistent display casing
const toTitleCase = (text: string) =>
  text
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export default function LearningPage() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [topics, setTopics] = useState<Learning[]>([]);
  const [topicsLoading, setTopicsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    notes: '',
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchTopics();
    }
  }, [isAuthenticated]);

  const fetchTopics = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/learning', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setTopics(data);
    } catch (error) {
      console.error('Failed to fetch learning topics:', error);
    } finally {
      setTopicsLoading(false);
    }
  };

  const createTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3001/learning', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const newTopic = await response.json();
      setTopics([newTopic, ...topics]);
      setShowCreateModal(false);
      setFormData({ title: '', description: '', notes: '' });
    } catch (error) {
      console.error('Failed to create topic:', error);
    }
  };

  const updateProgress = async (id: string, progress: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/learning/${id}/progress`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ progress }),
      });
      const updatedTopic = await response.json();
      setTopics(topics.map((topic) => (topic.id === id ? updatedTopic : topic)));
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const completeTopic = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3001/learning/${id}/complete`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const updatedTopic = await response.json();
      setTopics(topics.map((topic) => (topic.id === id ? updatedTopic : topic)));
    } catch (error) {
      console.error('Failed to complete topic:', error);
    }
  };

  const deleteTopic = async (id: string) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:3001/learning/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTopics(topics.filter((topic) => topic.id !== id));
    } catch (error) {
      console.error('Failed to delete topic:', error);
    }
  };

  if (isLoading || topicsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen font-sans">
        <p className="text-lg text-black">Loading...</p>
      </div>
    );
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-emerald-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans antialiased">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-black tracking-tight">
            Learning Topics
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Track what you&apos;re learning and how far you&apos;ve gotten.
          </p>
        </div>

        {/* Vertical, responsive card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {topics.length === 0 ? (
            <div className="sm:col-span-2 xl:col-span-3 bg-white p-8 rounded-xl shadow text-center">
              <p className="text-black">No learning topics yet. Create one to get started!</p>
            </div>
          ) : (
            topics.map((topic) => (
              <div
                key={topic.id}
                className="relative flex flex-col bg-white rounded-xl shadow hover:shadow-lg transition p-5 sm:p-6"
              >
                {/* Delete as a small icon button, top-right corner */}
                <button
                  onClick={() => deleteTopic(topic.id)}
                  aria-label="Delete topic"
                  className="absolute top-4 right-4 text-gray-400 hover:text-rose-600 transition"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m2 0-1 13a2 2 0 01-2 2H9a2 2 0 01-2-2L6 7h12z" />
                  </svg>
                </button>

                {/* Status badge */}
                <span
                  className={`self-start mb-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
                    topic.completed
                      ? 'bg-emerald-100 text-emerald-700'
                      : topic.progress > 0
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {topic.completed ? 'Completed' : topic.progress > 0 ? 'In Progress' : 'Not Started'}
                </span>

                {/* Title row with checkbox, stacked above description */}
                <div className="flex items-start gap-3 mb-2 pr-6">
                  <input
                    type="checkbox"
                    checked={topic.completed}
                    onChange={() => completeTopic(topic.id)}
                    className="w-5 h-5 mt-0.5 accent-purple-600 shrink-0"
                  />
                  <h3
                    className={`text-lg sm:text-xl font-semibold leading-snug ${
                      topic.completed ? 'line-through text-gray-400' : 'text-black'
                    }`}
                  >
                    {toTitleCase(topic.title)}
                  </h3>
                </div>

                {topic.description && (
                  <p className="text-black text-sm mb-2">{topic.description}</p>
                )}
                {topic.notes && (
                  <p className="text-gray-500 text-sm mb-4">Notes: {topic.notes}</p>
                )}

                {/* Progress bar */}
                <div className="mt-auto pt-2">
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-black text-xs font-medium uppercase tracking-wide">
                      Progress
                    </label>
                    <span className="text-black text-sm font-bold">{topic.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden mb-3">
                    <div
                      className={`h-2.5 rounded-full transition-all duration-500 ease-out ${getProgressColor(
                        topic.progress
                      )}`}
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={topic.progress}
                    onChange={(e) => updateProgress(topic.id, parseInt(e.target.value))}
                    className="w-full cursor-pointer accent-purple-600 mb-4"
                  />

                  <div className="flex gap-2">
                    {topic.progress < 100 && (
                      <button
                        onClick={() => updateProgress(topic.id, 100)}
                        className="flex-1 bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-emerald-600 transition"
                      >
                        Mark 100%
                      </button>
                    )}
                    {topic.progress < 50 && (
                      <button
                        onClick={() => updateProgress(topic.id, 50)}
                        className="flex-1 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-600 transition"
                      >
                        50%
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Floating action button replaces the inline "+ New Topic" button */}
      <button
        onClick={() => setShowCreateModal(true)}
        aria-label="New learning topic"
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 w-14 h-14 rounded-full bg-purple-600 text-white shadow-lg hover:bg-purple-700 hover:shadow-xl active:scale-95 transition flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-6 tracking-tight">
              Create New Learning Topic
            </h3>

            <form onSubmit={createTopic} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-black text-black"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-black text-black"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-black text-black"
                  rows={2}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 font-semibold"
                >
                  Create Topic
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}