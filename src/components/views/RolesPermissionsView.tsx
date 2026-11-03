import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { INITIAL_USERS } from '../../data/initialData';
import { SystemUser, UserRole } from '../../types/payroll';
import { 
  UserCog, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  KeyRound, 
  UserCheck, 
  Users, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const RolesPermissionsView: React.FC = () => {
  const { currentUser, setCurrentUser } = usePayroll();

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const permissionsMatrix = [
    { permission: 'Registrar y editar empleados', auxiliar: true, admin: true, gerente: true, proyectos: false },
    { permission: 'Registrar novedades y adjuntar soportes', auxiliar: true, admin: true, gerente: true, proyectos: false },
    { permission: 'Aprobar novedades radicadas', auxiliar: false, admin: true, gerente: true, proyectos: false },
    { permission: 'Calcular y preparar borrador de nómina', auxiliar: true, admin: true, gerente: true, proyectos: false },
    { permission: 'Verificar pre-liquidación y contratos', auxiliar: false, admin: true, gerente: true, proyectos: false },
    { permission: 'Autorizar formalmente pagos y dispersión', auxiliar: false, admin: false, gerente: true, proyectos: false },
    { permission: 'Consultar informes generales de nómina', auxiliar: true, admin: true, gerente: true, proyectos: false },
    { permission: 'Consultar costos laborales por proyecto', auxiliar: true, admin: true, gerente: true, proyectos: true },
    { permission: 'Modificar parámetros legales (SMLMV / Auxilio)', auxiliar: false, admin: true, gerente: true, proyectos: false },
    { permission: 'Exportar copias de seguridad del sistema', auxiliar: false, admin: true, gerente: true, proyectos: false },
    { permission: 'Administrar usuarios y permisos', auxiliar: false, admin: false, gerente: true, proyectos: false },
  ];

  const handleSimulatedLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const found = INITIAL_USERS.find(
      (u) => u.username.toLowerCase() === loginUsername.trim().toLowerCase()
    );

    if (found) {
      setCurrentUser(found);
      setLoginMessage({ type: 'success', text: `Autenticación exitosa. Sesión iniciada como ${found.name}.` });
      setLoginPassword('');
    } else {
      setLoginMessage({ type: 'error', text: 'Credenciales inválidas. Seleccione un usuario de la lista de acceso rápido.' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 10: Usuarios y Permisos (RBAC)
            </span>
            <span className="text-xs font-bold text-slate-500">
              Control de Acceso Seguro
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Gestión de Perfiles y Matriz de Roles y Responsabilidades
          </h1>
          <p className="text-xs text-slate-500">
            Control de privilegios por perfil: Auxiliar contable, Administración, Gerente y Gestor de proyectos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 bg-slate-900 text-amber-400 rounded-lg text-xs font-bold flex items-center gap-2 shadow">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Sesión Activa: <span className="text-white">{currentUser.name}</span>
          </div>
        </div>
      </div>

      {/* Grid: Fast Role Switcher & Login Box */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 4 Role Cards */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Perfiles de Usuario Oficiales (Haga clic para cambiar de rol al instante)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INITIAL_USERS.map((user) => {
              const isCurrent = user.id === currentUser.id;
              return (
                <div
                  key={user.id}
                  onClick={() => setCurrentUser(user)}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative overflow-hidden ${
                    isCurrent
                      ? 'border-amber-500 bg-amber-50/40 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${user.avatarColor} text-white font-bold flex items-center justify-center text-sm shadow`}>
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{user.name}</h3>
                        <p className="text-[11px] font-mono text-slate-500">@{user.username}</p>
                      </div>
                    </div>
                    {isCurrent && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                        Activo
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 text-xs space-y-1">
                    <p className="text-[11px] text-slate-700">
                      <strong>Rol:</strong> {user.role.replace('_', ' ')}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {user.role === 'AUXILIAR_CONTABLE' && 'Registra empleados, novedades y elabora pre-liquidaciones.'}
                      {user.role === 'ADMINISTRACION' && 'Supervisa personal, verifica contratos y aprueba procesos.'}
                      {user.role === 'GERENTE' && 'Autoriza formalmente desembolsos y reportes financieros.'}
                      {user.role === 'GESTOR_PROYECTOS' && 'Consulta costos laborales y presupuesto por proyecto.'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Login simulation form */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-amber-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Inicio de Sesión con Credenciales
            </h3>
          </div>

          <form onSubmit={handleSimulatedLogin} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Nombre de Usuario</label>
              <input
                type="text"
                required
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="ej: gerencia.general o aux.contable"
                className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {loginMessage && (
              <div className={`p-2.5 rounded-lg text-[11px] font-medium ${
                loginMessage.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
              }`}>
                {loginMessage.text}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold rounded-lg shadow text-xs transition-all"
            >
              Ingresar al Sistema
            </button>
          </form>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <span className="font-bold text-slate-700 block">Usuarios de prueba:</span>
            <p>&bull; <code>aux.contable</code> (Auxiliar Contable)</p>
            <p>&bull; <code>admin.corporativo</code> (Administración)</p>
            <p>&bull; <code>gerencia.general</code> (Gerente)</p>
            <p>&bull; <code>gestor.proyectos</code> (Gestor de Proyectos)</p>
          </div>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/80">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            Matriz Comparativa de Permisos y Privilegios
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#0B192C] text-white uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Acción / Módulo del Sistema</th>
                <th className="py-3 px-3 text-center">Auxiliar Contable</th>
                <th className="py-3 px-3 text-center">Administración</th>
                <th className="py-3 px-3 text-center font-bold text-amber-400">Gerente</th>
                <th className="py-3 px-3 text-center">Gestor Proyectos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-800">{row.permission}</td>
                  <td className="py-2.5 px-3 text-center">
                    {row.auxiliar ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.admin ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-2.5 px-3 text-center bg-amber-50/40">
                    {row.gerente ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.proyectos ? <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" /> : <XCircle className="w-4 h-4 text-slate-300 inline" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
