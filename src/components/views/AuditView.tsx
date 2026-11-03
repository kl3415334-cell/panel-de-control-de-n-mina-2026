import React from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { 
  History, 
  ShieldCheck, 
  AlertTriangle, 
  Download, 
  Calendar, 
  Clock, 
  User, 
  FileCheck2,
  Lock
} from 'lucide-react';

export const AuditView: React.FC = () => {
  const { auditLogs, exportDatabaseJSON, companyInfo } = usePayroll();

  const alerts = [
    {
      id: 1,
      title: 'Dispersión de Nómina 3ª Decena',
      deadline: '30 de Octubre de 2026',
      status: 'Próxima',
      category: 'Pago Bancario',
      urgent: true,
    },
    {
      id: 2,
      title: 'Planilla Integrada PILA (Aportes Seguridad Social)',
      deadline: '08 de Noviembre de 2026',
      status: 'En Plazo',
      category: 'Obligación Legal',
      urgent: false,
    },
    {
      id: 3,
      title: 'Consignación de Cesantías a Fondos (Ley 50 de 1990)',
      deadline: '14 de Febrero de 2027',
      status: 'Provisión en Curso',
      category: 'Prestación Social',
      urgent: false,
    },
    {
      id: 4,
      title: 'Pago Directo de Intereses a las Cesantías (Ley 52 de 1975)',
      deadline: '31 de Enero de 2027',
      status: 'Provisión en Curso',
      category: 'Prestación Social',
      urgent: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 11: Auditoría y Cumplimiento
            </span>
            <span className="text-xs font-bold text-slate-500">
              Trazabilidad en Tiempo Real
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Historial de Auditoría, Alertas y Protección de Datos
          </h1>
          <p className="text-xs text-slate-500">
            Registro inmutable de acciones en la plataforma y cumplimiento de la Ley 1581 de 2012 de Protección de Datos Personales.
          </p>
        </div>

        <button
          onClick={exportDatabaseJSON}
          className="px-4 py-2 bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Descargar Bitácora y Backup
        </button>
      </div>

      {/* Grid: Alerts & Habeas Data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Calendar Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" /> Alertas de Pago y Vencimientos
          </h2>
          <div className="space-y-2.5">
            {alerts.map((alert) => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border text-xs space-y-1 ${
                  alert.urgent 
                    ? 'bg-amber-500/10 border-amber-300 text-amber-950' 
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{alert.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    alert.urgent ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {alert.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Límite: {alert.deadline}
                </p>
                <span className="text-[10px] text-blue-700 font-semibold uppercase tracking-wider block">
                  {alert.category}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 2 Columns: Audit Log Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
            <History className="w-4 h-4 text-blue-600" /> Registro de Modificaciones y Trazabilidad (Audit Trail)
          </h2>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left text-slate-600">
              <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Fecha y Hora</th>
                  <th className="py-2.5 px-3">Usuario y Rol</th>
                  <th className="py-2.5 px-3">Acción</th>
                  <th className="py-2.5 px-3">Módulo</th>
                  <th className="py-2.5 px-3">Detalle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 text-[11px] text-slate-500 whitespace-nowrap font-mono">
                      {new Date(log.timestamp).toLocaleString('es-CO')}
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">
                      {log.user}
                      <span className="block text-[10px] text-amber-700 font-normal">{log.role}</span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                        {log.action}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 font-medium">{log.module}</td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-xs">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Habeas Data & Personal Data Protection Banner */}
      <div className="p-5 rounded-2xl bg-[#0B192C] text-white border border-slate-800 shadow-md flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
          <Lock className="w-5 h-5" />
        </div>
        <div className="text-xs space-y-1">
          <h3 className="font-bold text-amber-400 text-sm">
            Política de Protección de Datos Personales (Ley 1581 de 2012 y Decreto 1377 de 2013)
          </h3>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            La <strong>Corporación Social Somos Uno</strong> garantiza la confidencialidad, reserva y tratamiento seguro de los datos sensibles de sus trabajadores (salarios, historias clínicas de incapacidades y datos de contacto). La información es procesada de manera cifrada exclusivamente con fines contables, de seguridad social y de cumplimiento laboral.
          </p>
        </div>
      </div>
    </div>
  );
};
