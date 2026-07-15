'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import Breadcrumb from './Breadcrumb';

export default function Navbar() {
  const { logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <>
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-black hover:text-blue-600">
            📋 Task & Learning Tracker
          </Link>

          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`font-semibold transition ${
                isActive('/dashboard')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-black hover:text-blue-600'
              }`}
            >
              Dashboard
            </Link>

            <Link
              href="/tasks"
              className={`font-semibold transition ${
                isActive('/tasks')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-black hover:text-blue-600'
              }`}
            >
              Tasks
            </Link>

            <Link
              href="/learning"
              className={`font-semibold transition ${
                isActive('/learning')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-black hover:text-blue-600'
              }`}
            >
              Learning
            </Link>

            <Link
              href="/activity"
              className={`font-semibold transition ${
                isActive('/activity')
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-black hover:text-blue-600'
              }`}
            >
              Activity
            </Link>

            <button
              onClick={() => {
                logout();
                router.push('/auth/login');
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
      
      <Breadcrumb />
    </>
  );
}