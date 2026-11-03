import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { INITIAL_USERS } from '../../data/initialData';
import { 
  Building2, 
  Bell, 
  Calendar, 
  Search, 
  UserCheck, 
  ShieldCheck, 
  ChevronDown, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Sparkles
} from 'lucide-react';

interface NavbarProps {
  onOpenSearch?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { 
    companyInfo, 
    currentUser, 
    setCurrentUser, 
    periodType, 
    setPeriodType, 
    periodNumber, 
    setPeriodNumber,
    selectedMonth,
    selectedYear,
    payrollStatus,
    getPeriodLabel,
    searchQuery,
    setSearchQuery
  } = usePayroll();

  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    {
      id: 1,
      type: 'payment',
      title: 'Próxima fecha de pago de nómina',
      desc: 'Pago de decena correspondiente al 30 de octubre.',
      time: 'Hoy',
      urgent: true
    },
    {
      id: 2,
      type: 'pila',
      title: 'Vencimiento planilla integrada PILA',
      desc: 'Fecha límite de pago aportes: 8 de noviembre (Dígito 07).',
      time: 'En 6 días',
      urgent: false
    },
    {
      id: 3,
      type: 'benefits',
      title: 'Provisión contable de cesantías al día',
      desc: 'Cálculo acumulado actualizado según devengados del mes.',
      time: 'Hace 2 horas',
      urgent: false
    }
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#0B192C] text-white border-b border-slate-800 shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Left: Organization Brand */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-amber-500/20 ring-2 ring-amber-300/30">
            <Building2 className="w-6 h-6 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
                {companyInfo.name}
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                Colombia 2026
              </span>
            </div>
            <p className="text-xs text-slate-400">
              NIT: {companyInfo.nit} &bull; Plataforma Oficial de Gestión y Nómina
            </p>
          </div>
        </div>

        {/* Center: Search & Period Indicator */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar colaborador, cargo o documento..."
              className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Right: Period Selector, Notifications, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Period Selector */}
          <div className="hidden lg:flex items-center bg-slate-900/90 border border-slate-700/70 rounded-lg p-1 text-xs">
            <span className="px-2 text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              Período:
            </span>
            <select
              value={periodType}
              onChange={(e) => setPeriodType(e.target.value as any)}
              className="bg-transparent text-slate-200 text-xs font-semibold focus:outline-none pr-1 cursor-pointer"
            >
              <option value="10_DIAS" className="bg-slate-900 text-white">Cada 10 días (Decenas)</option>
              <option value="QUINCENAL" className="bg-slate-900 text-white">Quincenal (15 días)</option>
              <option value="MENSUAL" className="bg-slate-900 text-white">Mensual (30 días)</option>
            </select>
            {periodType === '10_DIAS' && (
              <div className="flex items-center border-l border-slate-700 pl-1.5 ml-1 space-x-1">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPeriodNumber(num)}
                    className={`px-1.5 py-0.5 text-[11px] rounded font-bold transition-all ${
                      periodNumber === num
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    D{num}
                  </button>
                ))}
              </div>
            )}
            {periodType === 'QUINCENAL' && (
              <div className="flex items-center border-l border-slate-700 pl-1.5 ml-1 space-x-1">
                {[1, 2].map((num) => (
                  <button
                    key={num}
                    onClick={() => setPeriodNumber(num)}
                    className={`px-1.5 py-0.5 text-[11px] rounded font-bold transition-all ${
                      periodNumber === num
                        ? 'bg-amber-500 text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Q{num}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Notificaciones y Alertas"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 text-slate-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Alertas Operativas
                  </span>
                  <span className="text-[10px] text-slate-400">3 activas</span>
                </div>
                <div className="space-y-2 mt-2">
                  {notifications.map((n) => (
                    <div 
                      key={n.id} 
                      className={`p-2.5 rounded-lg border text-xs transition-colors ${
                        n.urgent 
                          ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' 
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="font-semibold text-white">{n.title}</span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{n.desc}</p>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    setActiveTab('payroll');
                    setShowNotifications(false);
                  }}
                  className="w-full mt-2.5 py-1.5 text-center text-[11px] font-semibold text-amber-400 hover:text-amber-300 hover:bg-slate-800/80 rounded transition-colors"
                >
                  Ver liquidación en curso →
                </button>
              </div>
            )}
          </div>

          {/* User Profile / Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowRoleModal(!showRoleModal)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all text-left"
            >
              <div className={`w-7 h-7 rounded-lg bg-gradient-to-tr ${currentUser.avatarColor} flex items-center justify-center text-white font-bold text-xs shadow`}>
                {currentUser.name.charAt(0)}
              </div>
              <div className="hidden sm:block text-xs">
                <p className="font-semibold text-slate-200 leading-none">{currentUser.name.split(' ')[0]}</p>
                <p className="text-[10px] text-amber-400 font-medium leading-none mt-1">{currentUser.role.replace('_', ' ')}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* Role Switcher Menu */}
            {showRoleModal && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-slate-200">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cambiar Perfil de Usuario</p>
                  <p className="text-[10px] text-slate-500">Prueba los 4 roles con sus respectivos permisos</p>
                </div>
                <div className="py-1 space-y-1">
                  {INITIAL_USERS.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => {
                          setCurrentUser(user);
                          setShowRoleModal(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-lg transition-all text-left ${
                          isSelected 
                            ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30' 
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div className={`w-6 h-6 rounded bg-gradient-to-tr ${user.avatarColor} flex items-center justify-center text-white text-[11px] font-bold`}>
                            {user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-white">{user.name}</p>
                            <p className="text-[10px] text-slate-400">{user.role}</p>
                          </div>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
                      </button>
                    );
                  })}
                </div>
                <div className="p-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Permisos activos: {currentUser.role}</span>
                  <button 
                    onClick={() => {
                      setActiveTab('users');
                      setShowRoleModal(false);
                    }}
                    className="text-amber-400 underline hover:text-amber-300"
                  >
                    Ver matriz
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
