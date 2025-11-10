'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    {
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
        </svg>
      ),
      label: 'Home',
      href: '/',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Shorts',
      href: '/shorts',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      label: 'Subscriptions',
      href: '/subscriptions',
    },
  ];

  const userMenuItems = user ? [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Your channel',
      href: `/channel/${user.username}`,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'History',
      href: '/history',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Your videos',
      href: '/studio',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      label: 'Liked videos',
      href: '/liked',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      label: 'Playlists',
      href: '/playlists',
    },
  ] : [];

  const isActive = (href) => pathname === href;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-14 left-0 h-[calc(100vh-3.5rem)] bg-white z-40 
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:sticky lg:top-14
          w-64 overflow-y-auto
          border-r border-gray-200
        `}
      >
        <div className="py-2">
          {/* Main menu */}
          <nav className="space-y-1 px-3 pb-4 border-b border-gray-200">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-6 px-3 py-2.5 rounded-lg
                  transition-colors text-sm font-medium
                  ${
                    isActive(item.href)
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-700 hover:bg-gray-100'
                  }
                `}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose?.();
                }}
              >
                <span className={isActive(item.href) ? 'text-red-600' : ''}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* User menu */}
          {user && userMenuItems.length > 0 && (
            <nav className="space-y-1 px-3 py-4 border-b border-gray-200">
              {userMenuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center gap-6 px-3 py-2.5 rounded-lg
                    transition-colors text-sm font-medium
                    ${
                      isActive(item.href)
                        ? 'bg-gray-100 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose?.();
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          )}

          {/* Subscriptions section */}
          {user && (
            <div className="px-3 py-4">
              <h3 className="px-3 text-sm font-semibold text-gray-900 mb-2">
                Subscriptions
              </h3>
              <div className="space-y-1">
                {/* This will be populated with actual subscriptions */}
                <div className="px-3 py-2 text-sm text-gray-500">
                  No subscriptions yet
                </div>
              </div>
            </div>
          )}

          {/* Footer links */}
          <div className="px-6 py-4 text-xs text-gray-500 space-y-2">
            <div className="space-x-2">
              <Link href="/about" className="hover:text-gray-900">About</Link>
              <Link href="/press" className="hover:text-gray-900">Press</Link>
              <Link href="/copyright" className="hover:text-gray-900">Copyright</Link>
            </div>
            <div className="space-x-2">
              <Link href="/contact" className="hover:text-gray-900">Contact us</Link>
              <Link href="/creators" className="hover:text-gray-900">Creators</Link>
              <Link href="/advertise" className="hover:text-gray-900">Advertise</Link>
            </div>
            <div className="space-x-2">
              <Link href="/terms" className="hover:text-gray-900">Terms</Link>
              <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
              <Link href="/policy" className="hover:text-gray-900">Policy & Safety</Link>
            </div>
            <p className="pt-2 text-gray-400">
              © 2024 YouTube Clone
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
