// Sidebar.tsx
'use client';
import { useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  ChevronRight,
  ChevronLeft,
  Home,
  User,
  ShoppingBag,
  LogOut,
  Megaphone,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<{ name: string; role: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    document.cookie = 'token=; path=/; max-age=0';
    router.push('/login');
  };

  useEffect(() => {
    let isMounted = true;
    const fetchUserInfo = async () => {
      try {
        const res = await fetch('/api/users/getUsersSide', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!res.ok) throw new Error('Failed to fetch user info');

        const data = await res.json();
        if (isMounted) setUserInfo(data);
      } catch (error) {
        console.error('Erro ao carregar informações do usuário:', error);
      }
    };

    fetchUserInfo();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <aside
      className={`${
        isOpen ? 'w-60' : 'w-20'
      } bg-white min-h-screen flex flex-col justify-between border-r border-[1.2px] transition-all duration-300 relative rounded-tr-[27px] rounded-br-[27px]`}
    >
      <div className="p-4">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-8 h-8 flex items-center justify-center bg-red-400 text-white rounded-full shadow-md hover:bg-red-500 transition-transform"
          >
            {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="cursor-pointer w-10 h-10 flex items-center justify-center rounded-full bg-gray-300 text-gray-600">
            <User size={20} />
          </div>
          {isOpen && userInfo && (
            <div className="flex flex-col">
              <span className="font-medium text-gray-900">{userInfo.name}</span>
              <span className="text-xs text-gray-600">{userInfo.role}</span>
            </div>
          )}
        </div>

        <ul className="space-y-3 font-medium">
          <SidebarItem icon={<Home size={20} />} text="Dashboard" href="/dashboard" isOpen={isOpen} pathname={pathname} />
          {userInfo?.role === 'ADMINISTRADOR' && (
            <SidebarItem icon={<User size={20} />} text="Usuários" href="/usuarios" isOpen={isOpen} pathname={pathname} />
          )}
          <SidebarItem icon={<ShoppingBag size={20} />} text="KPI de Fluxo de Caixa" href="/kpi-fluxo" isOpen={isOpen} pathname={pathname} />
          <SidebarItem icon={<CreditCard size={20} />} text="Cartão Fidelidade" href="/cartao-fidelidade" isOpen={isOpen} pathname={pathname} />
        </ul>
      </div>

      <div className="border-t p-4 font-medium">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-4 p-3 rounded-lg transition-colors text-gray-700 hover:bg-red-50 hover:text-red-600 ${
            isOpen ? 'justify-start' : 'justify-center'
          }`}
        >
          <LogOut size={20} />
          {isOpen && <span className="whitespace-nowrap">Sair</span>}
        </button>
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  href: string;
  isOpen: boolean;
  pathname: string | null;
  alert?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, href, isOpen, pathname, alert }) => {
  const isActive = pathname === href;

  return (
    <li className="list-none">
      <Link
        href={href}
        className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
          isActive ? 'bg-red-100 text-red-700' : 'text-gray-700 hover:bg-red-50 hover:text-red-600'
        } ${isOpen ? 'justify-start' : 'justify-center'} ${isOpen && 'w-full'}`}
      >
        <div className="relative">
          {icon}
          {alert && (
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-400 rounded-full"></span>
          )}
        </div>
        {isOpen && <span className="whitespace-nowrap">{text}</span>}
      </Link>
    </li>
  );
};
