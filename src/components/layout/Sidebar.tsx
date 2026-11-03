import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Calculator, 
  FileSpreadsheet, 
  Coins, 
  ShieldCheck, 
  PieChart, 
  FileText, 
  GitBranch, 
  BookOpen, 
  Scale, 
  UserCog, 
  Download, 
  HelpCircle, 
  History,
  Lock,
  ChevronRight
} from 'lucide-react';
import { usePayroll } from '../../context/PayrollContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { currentUser, payrollStatus } = usePayroll();

  const navGroups = [
    {
      title: 'Operación de Nómina',
      items: [
        { id: 'dashboard', label: 'Panel Principal', icon: LayoutDashboard, badge: null },
        { id: 'employees', label: 'Empleados', icon: Users, badge: '4' },
        { id: 'payroll', label: 'Liquidación Nómina', icon: Calculator, badge: payrollStatus },
        { id: 'novelties', label: 'Novedades Laborales', icon: FileSpreadsheet, badge: '3' },
      ],
    },
    {
      title: 'Prestaciones y Seguridad',
      items: [
        { id: 'benefits', label: 'Prestaciones Sociales', icon: Coins, badge: null },
        { id: 'security', label: 'Seguridad Social & Parafiscales', icon: ShieldCheck, badge: null },
        { id: 'simulation', label: 'Simulación Oficial 2026', icon: PieChart, badge: '$19.1M' },
      ],
    },
    {
      title: 'Gestión y Calidad',
      items: [
        { id: 'reports', label: 'Informes y Certificados', icon: FileText, badge: 'PDF/XLS' },
        { id: 'phva', label: 'Flujograma PHVA', icon: GitBranch, badge: 'Ciclo' },
        { id: 'functions', label: 'Manual de Funciones', icon: BookOpen, badge: null },
        { id: 'normativity', label: 'Normatividad Laboral', icon: Scale, badge: '2026' },
      ],
    },
    {
      title: 'Administración y Soporte',
      items: [
        { id: 'users', label: 'Usuarios y Permisos', icon: UserCog, badge: currentUser.role.slice(0, 5) },
        { id: 'system', label: 'Instalación y Sistema', icon: Download, badge: null },
        { id: 'manual', label: 'Manual de Usuario', icon: HelpCircle, badge: 'Guía' },
        { id: 'audit', label: 'Historial y Auditoría', icon: History, badge: null },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0F2027] text-slate-300 flex flex-col shrink-0 border-r border-slate-800 min-h-[calc(100vh-65px)]">
      {/* Current Role Banner */}
      <div className="p-3 mx-3 my-2.5 bg-slate-900/90 rounded-xl border border-slate-700/60 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-semibold text-slate-300">
            Rol: <strong className="text-amber-400">{currentUser.role.replace('_', ' ')}</strong>
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">v2026.1</span>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5">
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <h3 className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1.5">
              {group.title}
            </h3>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                // Simple role restriction indicator
                const isRestricted = 
                  (item.id === 'system' && currentUser.role !== 'GERENTE' && currentUser.role !== 'ADMINISTRACION') ||
                  (item.id === 'users' && currentUser.role === 'GESTOR_PROYECTOS');

                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all group ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1.5 ml-2 shrink-0">
                      {isRestricted ? (
                        <Lock className="w-3 h-3 text-slate-500" />
                      ) : item.badge ? (
                        <span className={`px-1.5 py-0.2 text-[10px] rounded font-bold uppercase ${
                          isActive
                            ? 'bg-slate-900 text-amber-300'
                            : item.badge === 'PAGADO' || item.badge === 'APROBADO'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {item.badge}
                        </span>
                      ) : (
                        <ChevronRight className={`w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ${
                          isActive ? 'opacity-100 text-slate-950' : 'text-slate-400'
                        }`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 flex flex-col gap-1">
        <div className="flex items-center justify-between text-slate-400">
          <span>Corporación Social Somos Uno</span>
          <span className="text-amber-400 font-bold">CST / Ley 2466</span>
        </div>
        <p className="text-[10px] text-slate-500">
          Sistema certificado para liquidación laboral en Colombia.
        </p>
      </div>
    </aside>
  );
};
