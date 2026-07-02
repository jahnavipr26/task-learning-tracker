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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-black">Loading...</p>
      </div>
    );
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-black">Learning Topics</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 font-semibold"
          >
            + New Topic
          </button>
        </div>

        <div className="space-y-4">
          {topics.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <p className="text-black">No learning topics yet. Create one to get started!</p>
            </div>
          ) : (
            topics.map((topic) => (
              <div key={topic.id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <input
                        type="checkbox"
                        checked={topic.completed}
                        onChange={() => completeTopic(topic.id)}
                        className="w-5 h-5"
                      />
                      <h3
                        className={`text-xl font-semibold ${
                          topic.completed ? 'line-through text-black' : 'text-black'
                        }`}
                      >
                        {topic.title}
                      </h3>
                    </div>
                    {topic.description && (
                      <p className="text-black mb-2">{topic.description}</p>
                    )}
                    {topic.notes && (
                      <p className="text-black text-sm mb-2">Notes: {topic.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => deleteTopic(topic.id)}
                    className="text-red-600 hover:text-red-800 font-semibold"
                  >
                    Delete
                  </button>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-black text-sm font-medium">Progress</label>
                    <span className="text-black font-semibold">{topic.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div
                      className={`h-2 rounded-full transition-all ${getProgressColor(topic.progress)}`}
                      style={{ width: `${topic.progress}%` }}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={topic.progress}
                    onChange={(e) => updateProgress(topic.id, parseInt(e.target.value))}
                    className="w-full cursor-pointer"
                  />
                </div>

                <div className="flex gap-2">
                  {topic.progress < 100 && (
                    <button
                      onClick={() => updateProgress(topic.id, 100)}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                    >
                      Mark 100%
                    </button>
                  )}
                  {topic.progress < 50 && (
                    <button
                      onClick={() => updateProgress(topic.id, 50)}
                      className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                    >
                      50%
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-2xl font-bold text-black mb-6">Create New Learning Topic</h3>

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