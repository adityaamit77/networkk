import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/pages', label: 'Pages' },
  { href: '/insights', label: 'Insights' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/industries', label: 'Industries' },
  { href: '/media', label: 'Media' },
  { href: '/settings', label: 'Settings' },
  { href: '/users', label: 'Users & Roles' },
  { href: '/builder', label: 'Visual Builder' }
];

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen">
      <nav aria-label="CMS Navigation" className="w-48 border-r p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`block rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  router.pathname === item.href ? 'bg-blue-100 font-semibold' : ''
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

