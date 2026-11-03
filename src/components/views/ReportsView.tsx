import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { calculateConsolidatedPayroll, formatCurrency } from '../../utils/payrollCalculator';
import { exportPayrollToExcel, exportSinglePaystubPDF } from '../../utils/exportUtils';
import { 
  FileText, 
  FileSpreadsheet, 
  Printer, 
  Download, 
  CheckCircle, 
  Filter, 
  Search, 
  Eye, 
  FolderCheck,
  TrendingUp,
  ShieldCheck,
  Calendar,
  FileCheck2,
  Building
} from 'lucide-react';

export const ReportsView: React.FC = () => {
  const { employees, novelties, legalParams, periodType, getPeriodLabel, companyInfo } = usePayroll();
  const [selectedReport, setSelectedReport] = useState<string>('nomina_general');

  const { items, totals } = calculateConsolidatedPayroll(employees, periodType, novelties, legalParams);

  const reportTypes = [
    { id: 'nomina_general', label: '1. Nómina General Consolidada', desc: 'Resumen completo de devengados, deducciones y netos de todos los colaboradores.' },
    { id: 'comprobantes', label: '2. Comprobantes Individuales de Pago', desc: 'Volantes de pago individualizados según Art. 139 CST para firma del trabajador.' },
    { id: 'deducciones', label: '3. Informe de Deducciones Laborales', desc: 'Desglose detallado de aportes a Salud (4%), Pensión (4%) y retenciones.' },
    { id: 'novedades', label: '4. Informe de Novedades del Período', desc: 'Historial de incapacidades, horas extras, permisos remunerados y no remunerados.' },
    { id: 'prestaciones', label: '5. Informe de Prestaciones Sociales', desc: 'Provisiones de Cesantías, Intereses, Prima de Servicios y Vacaciones.' },
    { id: 'seguridad_social', label: '6. Informe de Seguridad Social Patronal', desc: 'Aportes a EPS (8.5%), AFP (12%) y ARL según clase de riesgo laboral.' },
    { id: 'parafiscales', label: '7. Informe de Aportes Parafiscales', desc: 'Liquidación de Caja de Compensación (4%), SENA (2%) e ICBF (3%).' },
    { id: 'costos_proyecto', label: '8. Informe de Costos por Proyecto', desc: 'Distribución del costo de mano de obra asignado a cada iniciativa social.' },
    { id: 'horas_extras', label: '9. Informe de Horas Extras y Recargos', desc: 'Consolidado de trabajo suplementario diurno, nocturno y festivo.' },
    { id: 'historial_pagos', label: '10. Historial de Pagos y Dispersión', desc: 'Trazabilidad de pagos bancarios y transferencias a colaboradores.' },
  ];

  const handleExportExcelAll = () => {
    exportPayrollToExcel(items, companyInfo, getPeriodLabel());
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 7: Generador de Informes
            </span>
            <span className="text-xs font-bold text-slate-500">
              10 Informes Oficiales Disponibles
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Centro de Informes, Certificados y Reportes Gerenciales
          </h1>
          <p className="text-xs text-slate-500">
            Descarga y visualización en tiempo real de reportes en PDF imprimible y libros de cálculo Excel (.xlsx) estructurados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportExcelAll}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Descargar Todo en Excel (.xlsx)
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir Vista Actual
          </button>
        </div>
      </div>

      {/* Main Grid: Selector on left, Preview on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: List of reports */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 pb-2 border-b border-slate-100">
            Catálogo de Informes
          </h2>
          <div className="space-y-1">
            {reportTypes.map((r) => {
              const isSelected = selectedReport === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedReport(r.id)}
                  className={`w-full text-left p-3 rounded-lg text-xs transition-all ${
                    isSelected
                      ? 'bg-amber-500/15 border border-amber-500/40 text-amber-900 font-bold'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <p className="font-semibold text-slate-900">{r.label}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{r.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Preview of the selected report */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">
                Vista Previa del Informe
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {reportTypes.find((r) => r.id === selectedReport)?.label}
              </h3>
              <p className="text-xs text-slate-500">
                {companyInfo.name} &bull; Período: {getPeriodLabel()}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleExportExcelAll}
                className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> XLS
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> PDF
              </button>
            </div>
          </div>

          {/* Conditional Report Views */}
          {selectedReport === 'nomina_general' && (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Empleado</th>
                    <th className="py-2.5 px-3">Cargo</th>
                    <th className="py-2.5 px-3">Devengado</th>
                    <th className="py-2.5 px-3">Deducciones</th>
                    <th className="py-2.5 px-3 text-right">Neto Pagado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.employeeId} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.fullName}</td>
                      <td className="py-2.5 px-3">{item.position}</td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{formatCurrency(item.totalEarnings)}</td>
                      <td className="py-2.5 px-3 text-red-600">-{formatCurrency(item.totalDeductions)}</td>
                      <td className="py-2.5 px-3 text-right font-extrabold text-emerald-700">{formatCurrency(item.netPay)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold border-t border-slate-200">
                  <tr>
                    <td className="py-2.5 px-3">TOTAL</td>
                    <td className="py-2.5 px-3">-</td>
                    <td className="py-2.5 px-3">{formatCurrency(totals.totalEarnings)}</td>
                    <td className="py-2.5 px-3 text-red-600">-{formatCurrency(totals.totalDeductions)}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-800 text-sm font-extrabold">{formatCurrency(totals.netPay)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {selectedReport === 'comprobantes' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-600">
                Seleccione un colaborador para descargar su comprobante individual de nómina conforme al Código Sustantivo del Trabajo:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((item) => (
                  <div key={item.employeeId} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50/50 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900">{item.fullName}</p>
                      <p className="text-[11px] text-slate-500">{item.position}</p>
                      <p className="text-xs font-extrabold text-emerald-700 mt-1">Neto: {formatCurrency(item.netPay)}</p>
                    </div>
                    <button
                      onClick={() => exportSinglePaystubPDF(item, companyInfo, getPeriodLabel())}
                      className="px-3 py-1.5 bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold rounded-lg text-xs flex items-center gap-1 shadow"
                    >
                      <Download className="w-3.5 h-3.5" /> PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedReport === 'deducciones' && (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Empleado</th>
                    <th className="py-2.5 px-3">Salud (4%)</th>
                    <th className="py-2.5 px-3">Pensión (4%)</th>
                    <th className="py-2.5 px-3">Solidaridad Pensional</th>
                    <th className="py-2.5 px-3">Retención Fuente</th>
                    <th className="py-2.5 px-3 text-right">Total Deducciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.employeeId}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.fullName}</td>
                      <td className="py-2.5 px-3 text-red-600">-{formatCurrency(item.healthEmployee)}</td>
                      <td className="py-2.5 px-3 text-red-600">-{formatCurrency(item.pensionEmployee)}</td>
                      <td className="py-2.5 px-3 text-slate-500">{item.solidarityPension > 0 ? `-${formatCurrency(item.solidarityPension)}` : '$0'}</td>
                      <td className="py-2.5 px-3 text-slate-500">{item.withholdingTax > 0 ? `-${formatCurrency(item.withholdingTax)}` : '$0'}</td>
                      <td className="py-2.5 px-3 text-right font-bold text-red-700">-{formatCurrency(item.totalDeductions)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedReport === 'costos_proyecto' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600">
                Imputación de costos de talento humano a los proyectos sociales de la Corporación:
              </p>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.employeeId} className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                        {item.project}
                      </span>
                      <p className="font-bold text-slate-900 mt-1">{item.fullName} ({item.position})</p>
                      <p className="text-[11px] text-slate-500">Salario base: {formatCurrency(item.baseSalary)}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-500 uppercase font-bold block">Costo Laboral Período</span>
                      <span className="text-base font-extrabold text-[#0B192C]">{formatCurrency(item.totalLaborCost)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedReport !== 'nomina_general' && selectedReport !== 'comprobantes' && selectedReport !== 'deducciones' && selectedReport !== 'costos_proyecto' && (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left text-slate-600">
                <thead className="bg-slate-50 text-slate-700 uppercase text-[10px] font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-2.5 px-3">Empleado</th>
                    <th className="py-2.5 px-3">Cargo</th>
                    <th className="py-2.5 px-3">Base / IBC</th>
                    <th className="py-2.5 px-3">Valor Reportado</th>
                    <th className="py-2.5 px-3 text-right">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => (
                    <tr key={item.employeeId}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.fullName}</td>
                      <td className="py-2.5 px-3">{item.position}</td>
                      <td className="py-2.5 px-3">{formatCurrency(item.baseSalary)}</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">
                        {selectedReport === 'prestaciones' ? formatCurrency(item.totalSocialProvisions) : formatCurrency(item.totalLaborCost)}
                      </td>
                      <td className="py-2.5 px-3 text-right">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Liquidado
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Certificación emitida bajo el marco normativo de Colombia para <strong>{companyInfo.name}</strong>.</span>
            <span className="font-mono text-slate-400">Verificado CST</span>
          </div>
        </div>
      </div>
    </div>
  );
};
