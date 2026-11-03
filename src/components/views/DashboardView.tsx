import React from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { calculateConsolidatedPayroll, formatCurrency } from '../../utils/payrollCalculator';
import { 
  Users, 
  Wallet, 
  Receipt, 
  PiggyBank, 
  ShieldAlert, 
  CalendarClock, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  AlertCircle,
  FileCheck,
  Building,
  PlusCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const { 
    employees, 
    novelties, 
    legalParams, 
    periodType, 
    periodNumber, 
    selectedMonth, 
    selectedYear,
    payrollStatus,
    getPeriodLabel,
    companyInfo
  } = usePayroll();

  // Monthly consolidated for global metrics
  const monthlyData = calculateConsolidatedPayroll(employees, 'MENSUAL', novelties, legalParams);
  // Current period consolidated
  const currentPeriodData = calculateConsolidatedPayroll(employees, periodType, novelties, legalParams);

  const activeEmployeesCount = employees.filter((e) => e.status === 'Activo').length;

  // Next payment dates for Colombia Corporación
  const paymentDates = [
    { label: 'Pago 1ª Decena (Días 1 - 10)', date: `10 de Octubre ${selectedYear}`, status: 'Completado', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pago 2ª Decena (Días 11 - 20)', date: `20 de Octubre ${selectedYear}`, status: 'Completado', color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Pago 3ª Decena (Días 21 - 30)', date: `30 de Octubre ${selectedYear}`, status: payrollStatus === 'PAGADO' ? 'Completado' : 'Próximo', color: payrollStatus === 'PAGADO' ? 'text-emerald-600 bg-emerald-50' : 'text-amber-600 bg-amber-50' },
    { label: 'Planilla PILA (Aportes SS)', date: `08 de Noviembre ${selectedYear}`, status: 'Programado', color: 'text-blue-600 bg-blue-50' },
  ];

  // Cost distribution calculations
  const totalCost = monthlyData.totals.totalLaborCost;
  const salariosPct = Math.round((monthlyData.totals.baseSalary / totalCost) * 100);
  const prestacionesPct = Math.round((monthlyData.totals.totalSocialProvisions / totalCost) * 100);
  const aportesPct = Math.round((monthlyData.totals.totalEmployerContributions / totalCost) * 100);
  const auxilioPct = Math.round((monthlyData.totals.transportAllowance / totalCost) * 100);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B192C] via-[#1E3E62] to-[#0F2027] p-6 text-white shadow-xl border border-slate-700/60">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                Panel de Control de Nómina 2026
              </span>
              <span className="text-xs text-slate-300">
                &bull; Período activo: <strong className="text-white">{getPeriodLabel()}</strong>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {companyInfo.name}
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Consola unificada para administración, liquidación, provisiones de prestaciones sociales y aportes parafiscales en estricta conformidad con el Código Sustantivo del Trabajo.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('payroll')}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              Liquidar Nómina
            </button>
            <button
              onClick={() => setActiveTab('novelties')}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-600/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              Registrar Novedad
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className="px-4 py-2.5 bg-slate-800/80 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl border border-slate-600/80 transition-all flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              Informes
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Empleados */}
        <div 
          onClick={() => setActiveTab('employees')}
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Empleados Activos</span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{activeEmployeesCount}</p>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>4 cargos simulados</span>
            <span className="text-blue-600 font-medium group-hover:translate-x-0.5 transition-transform">Gestionar →</span>
          </div>
        </div>

        {/* Total Nómina Mensual Básica + Auxilio */}
        <div 
          onClick={() => setActiveTab('payroll')}
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nómina Mensual Básica</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{formatCurrency(monthlyData.totals.baseSalary)}</p>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>+ Aux. Transp: {formatCurrency(monthlyData.totals.transportAllowance)}</span>
            <span className="text-emerald-600 font-medium">Ver desglose →</span>
          </div>
        </div>

        {/* Prestaciones Sociales Acumuladas */}
        <div 
          onClick={() => setActiveTab('benefits')}
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Provisión Prestaciones</span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900 mt-2">{formatCurrency(monthlyData.totals.totalSocialProvisions)}</p>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span>Cesantías, Intereses, Prima, Vac.</span>
            <span className="text-amber-600 font-medium">Fórmulas →</span>
          </div>
        </div>

        {/* Costo Laboral Total Estimado */}
        <div 
          onClick={() => setActiveTab('simulation')}
          className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-gradient-to-br from-white to-slate-50"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Costo Laboral Mensual</span>
            <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#0B192C] mt-2">{formatCurrency(monthlyData.totals.totalLaborCost)}</p>
          <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-slate-100">
            <span className="text-indigo-600 font-semibold">100% de la carga patronal</span>
            <span className="text-slate-400">Ver simulación →</span>
          </div>
        </div>
      </div>

      {/* Second Row: Detailed Breakdown & Next Payment Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Labor Cost Chart and Distribution */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-500" />
                Estructura y Distribución de Costos Laborales (Simulación 2026)
              </h2>
              <p className="text-xs text-slate-500">
                Presupuesto mensual integral de talento humano: {formatCurrency(totalCost)}
              </p>
            </div>
            <button
              onClick={() => setActiveTab('simulation')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              Ver Comparativa →
            </button>
          </div>

          {/* Graphical Progress Bar */}
          <div>
            <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden flex">
              <div 
                style={{ width: `${salariosPct}%` }} 
                className="bg-blue-600 h-full transition-all" 
                title={`Salarios Básicos: ${salariosPct}%`}
              />
              <div 
                style={{ width: `${prestacionesPct}%` }} 
                className="bg-amber-500 h-full transition-all" 
                title={`Prestaciones Sociales: ${prestacionesPct}%`}
              />
              <div 
                style={{ width: `${aportesPct}%` }} 
                className="bg-emerald-600 h-full transition-all" 
                title={`Aportes Seguridad Social & Parafiscales: ${aportesPct}%`}
              />
              <div 
                style={{ width: `${auxilioPct}%` }} 
                className="bg-purple-500 h-full transition-all" 
                title={`Auxilio de Transporte: ${auxilioPct}%`}
              />
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-blue-600 shrink-0" />
                <span className="text-slate-600">Salarios: <strong>{salariosPct}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-amber-500 shrink-0" />
                <span className="text-slate-600">Prestaciones: <strong>{prestacionesPct}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-emerald-600 shrink-0" />
                <span className="text-slate-600">Seg. Social & Paraf.: <strong>{aportesPct}%</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded bg-purple-500 shrink-0" />
                <span className="text-slate-600">Aux. Transp.: <strong>{auxilioPct}%</strong></span>
              </div>
            </div>
          </div>

          {/* Breakdown Table by Employee */}
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold uppercase text-[10px] tracking-wider border-y border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Cargo / Colaborador</th>
                  <th className="py-2.5 px-3">Salario Básico</th>
                  <th className="py-2.5 px-3">Aux. Transp.</th>
                  <th className="py-2.5 px-3">Prestaciones</th>
                  <th className="py-2.5 px-3">Aportes Patronales</th>
                  <th className="py-2.5 px-3 text-right">Costo Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {monthlyData.items.map((item) => (
                  <tr key={item.employeeId} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3">
                      <p className="font-semibold text-slate-900">{item.position}</p>
                      <p className="text-[11px] text-slate-400">{item.fullName}</p>
                    </td>
                    <td className="py-2.5 px-3 font-medium text-slate-800">{formatCurrency(item.baseSalary)}</td>
                    <td className="py-2.5 px-3 text-slate-600">{formatCurrency(item.transportAllowance)}</td>
                    <td className="py-2.5 px-3 text-amber-700">{formatCurrency(item.totalSocialProvisions)}</td>
                    <td className="py-2.5 px-3 text-emerald-700">{formatCurrency(item.totalEmployerContributions)}</td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">{formatCurrency(item.totalLaborCost)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50/80 font-bold text-slate-900 border-t border-slate-200">
                <tr>
                  <td className="py-2.5 px-3">TOTAL CONSOLIDADO</td>
                  <td className="py-2.5 px-3">{formatCurrency(monthlyData.totals.baseSalary)}</td>
                  <td className="py-2.5 px-3">{formatCurrency(monthlyData.totals.transportAllowance)}</td>
                  <td className="py-2.5 px-3 text-amber-700">{formatCurrency(monthlyData.totals.totalSocialProvisions)}</td>
                  <td className="py-2.5 px-3 text-emerald-700">{formatCurrency(monthlyData.totals.totalEmployerContributions)}</td>
                  <td className="py-2.5 px-3 text-right text-indigo-700 font-extrabold">{formatCurrency(monthlyData.totals.totalLaborCost)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Calendar & Payment Schedules */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-blue-600" />
                Cronograma y Vencimientos
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Octubre 2026
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {paymentDates.map((p, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-start justify-between text-xs">
                  <div>
                    <p className="font-semibold text-slate-800">{p.label}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {p.date}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.color}`}>
                    {p.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notice Card */}
          <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-900 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Modalidad de Pago Decenal
            </div>
            <p className="text-[11px] text-blue-800 leading-relaxed">
              La Corporación realiza tres desembolsos al mes (cada 10 días). Cada pago distribuye proporcionalmente el salario básico y auxilio, aplicando el 4% de salud y 4% de pensión sobre el IBC de los días liquidados.
            </p>
            <button
              onClick={() => setActiveTab('payroll')}
              className="mt-2 text-xs font-semibold text-blue-700 hover:text-blue-900 underline block"
            >
              Liquidar decena actual ({getPeriodLabel()}) →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Status Banner of Current Period */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 font-bold shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Estado del Período en Curso: <span className="text-emerald-700 font-extrabold">{payrollStatus}</span>
              </h3>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-bold">
                {currentPeriodData.count} trabajadores incluidos
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Neto total a desembolsar en este período: <strong className="text-slate-900">{formatCurrency(currentPeriodData.totals.netPay)}</strong> | Deducciones totales: {formatCurrency(currentPeriodData.totals.totalDeductions)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('payroll')}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors"
          >
            Abrir Módulo de Liquidación
          </button>
          <button
            onClick={() => setActiveTab('phva')}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors"
          >
            Ver Flujograma PHVA
          </button>
        </div>
      </div>
    </div>
  );
};
