'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface BreadcrumbItem {
  name: string;
  path: string;
}

export default function Breadcrumb() {
  const pathname = usePathname();

  const breadcrumbMap: Record<string, BreadcrumbItem[]> = {
    '/dashboard': [{ name: 'Dashboard', path: '/dashboard' }],
    '/tasks': [{ name: 'Tasks', path: '/tasks' }],
    '/learning': [{ name: 'Learning', path: '/learning' }],
    '/activity': [{ name: 'Activity', path: '/activity' }],
  };

  const crumbs = breadcrumbMap[pathname] || [];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm">
        <Link href="/dashboard" className="text-blue-600 hover:text-blue-800 font-medium">
          Home
        </Link>

        {crumbs.map((crumb, index) => (
          <div key={crumb.path} className="flex items-center gap-2">
            <span className="text-gray-400">/</span>
            {index === crumbs.length - 1 ? (
              <span className="text-black font-medium">{crumb.name}</span>
            ) : (
              <Link href={crumb.path} className="text-blue-600 hover:text-blue-800">
                {crumb.name}
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}