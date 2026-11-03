import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { 
  calculateConsolidatedPayroll, 
  formatCurrency, 
  calculateEmployeePayroll 
} from '../../utils/payrollCalculator';
import { exportPayrollToExcel, exportSinglePaystubPDF } from '../../utils/exportUtils';
import { 
  Calculator, 
  Download, 
  FileSpreadsheet, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Printer, 
  CheckCheck, 
  Lock, 
  DollarSign, 
  Calendar,
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PayrollSettlementView: React.FC = () => {
  const { 
    employees, 
    novelties, 
    legalParams, 
    periodType, 
    setPeriodType, 
    periodNumber, 
    setPeriodNumber,
    selectedMonth, 
    selectedYear,
    payrollStatus, 
    setPayrollStatus,
    approvePayroll, 
    payPayroll, 
    currentUser, 
    companyInfo,
    getPeriodLabel 
  } = usePayroll();

  const [selectedItemForStub, setSelectedItemForStub] = useState<any | null>(null);

  const { items, totals, count } = calculateConsolidatedPayroll(
    employees, 
    periodType, 
    novelties, 
    legalParams
  );

  const handleApprove = () => {
    approvePayroll();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const handlePay = () => {
    payPayroll();
    confetti({ particleCount: 90, spread: 90, origin: { y: 0.6 } });
  };

  const handleExportExcel = () => {
    exportPayrollToExcel(items, companyInfo, getPeriodLabel());
  };

  const canApprove = currentUser.role === 'GERENTE';
  const canPay = currentUser.role === 'GERENTE' || currentUser.role === 'ADMINISTRACION';

  return (
    <div className="space-y-6">
      {/* Top Banner & Settlement Period Controls */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
                Módulo 3: Liquidación Oficial
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase ${
                payrollStatus === 'PAGADO' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : payrollStatus === 'APROBADO'
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                Estado: {payrollStatus}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 mt-1">
              Liquidación Periódica de Salarios y Prestaciones
            </h1>
            <p className="text-xs text-slate-500">
              Período Seleccionado: <strong className="text-slate-800">{getPeriodLabel()}</strong> &bull; CST, Ley 2101 y Ley 2466
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportExcel}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              title="Descargar libro Excel completo"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Exportar Excel
            </button>

            {payrollStatus === 'EN_REVISION' && canApprove && (
              <button
                onClick={handleApprove}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Aprobar Nómina (Gerencia)
              </button>
            )}

            {payrollStatus === 'APROBADO' && canPay && (
              <button
                onClick={handlePay}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                <DollarSign className="w-4 h-4" />
                Ejecutar Desembolso de Pagos
              </button>
            )}

            {payrollStatus === 'PAGADO' && (
              <span className="px-3 py-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1.5">
                <CheckCheck className="w-4 h-4 text-emerald-600" />
                Desembolso Efectuado
              </span>
            )}
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-semibold">Modalidad de Período:</span>
            <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1">
              <button
                onClick={() => setPeriodType('10_DIAS')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                  periodType === '10_DIAS' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Cada 10 días (Decenas - Propuesta PDF)
              </button>
              <button
                onClick={() => setPeriodType('QUINCENAL')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                  periodType === 'QUINCENAL' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Quincenal (15 días)
              </button>
              <button
                onClick={() => setPeriodType('MENSUAL')}
                className={`px-3 py-1.5 rounded-md font-bold transition-all ${
                  periodType === 'MENSUAL' 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mensual Completo (30 días)
              </button>
            </div>
          </div>

          {/* Sub period selection buttons */}
          {periodType === '10_DIAS' && (
            <div className="flex items-center gap-1.5 bg-amber-50 p-1 rounded-lg border border-amber-200">
              <span className="text-[11px] font-semibold text-amber-900 px-1">Decena:</span>
              <button
                onClick={() => setPeriodNumber(1)}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  periodNumber === 1 ? 'bg-amber-500 text-slate-950' : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                1ª Decena (Días 1-10)
              </button>
              <button
                onClick={() => setPeriodNumber(2)}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  periodNumber === 2 ? 'bg-amber-500 text-slate-950' : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                2ª Decena (Días 11-20)
              </button>
              <button
                onClick={() => setPeriodNumber(3)}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  periodNumber === 3 ? 'bg-amber-500 text-slate-950' : 'text-amber-800 hover:bg-amber-100'
                }`}
              >
                3ª Decena (Días 21-30)
              </button>
            </div>
          )}

          {periodType === 'QUINCENAL' && (
            <div className="flex items-center gap-1.5 bg-blue-50 p-1 rounded-lg border border-blue-200">
              <span className="text-[11px] font-semibold text-blue-900 px-1">Quincena:</span>
              <button
                onClick={() => setPeriodNumber(1)}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  periodNumber === 1 ? 'bg-blue-600 text-white' : 'text-blue-800 hover:bg-blue-100'
                }`}
              >
                1ª Quincena (Días 1-15)
              </button>
              <button
                onClick={() => setPeriodNumber(2)}
                className={`px-2.5 py-1 rounded text-xs font-bold ${
                  periodNumber === 2 ? 'bg-blue-600 text-white' : 'text-blue-800 hover:bg-blue-100'
                }`}
              >
                2ª Quincena (Días 16-30)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Stat Strips for Current Settlement */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-slate-400 font-semibold uppercase text-[10px] block">Devengados Período</span>
          <span className="text-lg font-extrabold text-slate-900">{formatCurrency(totals.totalEarnings)}</span>
          <span className="text-[10px] text-slate-500 block">Sueldo + Auxilio + Novedades</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-slate-400 font-semibold uppercase text-[10px] block">Deducciones Trabajador</span>
          <span className="text-lg font-extrabold text-red-600">-{formatCurrency(totals.totalDeductions)}</span>
          <span className="text-[10px] text-slate-500 block">Salud (4%) + Pensión (4%)</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
          <span className="text-emerald-700 font-semibold uppercase text-[10px] block">Total Neto a Pagar</span>
          <span className="text-xl font-extrabold text-emerald-700">{formatCurrency(totals.netPay)}</span>
          <span className="text-[10px] text-emerald-600 block">A desembolsar a trabajadores</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-slate-400 font-semibold uppercase text-[10px] block">Costo Empleador Período</span>
          <span className="text-lg font-extrabold text-slate-900">{formatCurrency(totals.totalLaborCost)}</span>
          <span className="text-[10px] text-slate-500 block">Incluye SS, Paraf. y Prestaciones</span>
        </div>
      </div>

      {/* Main Interactive Settlement Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Detalle Individual de Liquidación
            </h2>
            <span className="text-[11px] text-slate-500 font-normal">
              ({items.length} trabajadores procesados)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 italic">
            * Haga clic en "Comprobante" para ver el volante oficial o imprimir
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#0B192C] text-white uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-3">Colaborador / Cargo</th>
                <th className="py-3 px-2 text-center">Días</th>
                <th className="py-3 px-3">Básico Período</th>
                <th className="py-3 px-3">Aux. Transp.</th>
                <th className="py-3 px-3">H.E. & Novedades</th>
                <th className="py-3 px-3 font-extrabold text-amber-300">Total Devengado</th>
                <th className="py-3 px-3">Salud (4%)</th>
                <th className="py-3 px-3">Pensión (4%)</th>
                <th className="py-3 px-3 text-red-300">Total Deduc.</th>
                <th className="py-3 px-3 text-right font-extrabold text-emerald-400">NETO A PAGAR</th>
                <th className="py-3 px-3 text-center">Comprobante</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.map((item) => (
                <tr key={item.employeeId} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-bold text-slate-900">{item.fullName}</p>
                    <p className="text-[10px] text-slate-400">{item.position} &bull; {item.project}</p>
                  </td>

                  <td className="py-3 px-2 text-center font-bold text-slate-700">
                    {item.daysWorked} / {item.daysInPeriod}
                  </td>

                  <td className="py-3 px-3 font-medium text-slate-800">
                    {formatCurrency(item.proportionalBaseSalary)}
                    <span className="block text-[10px] text-slate-400 font-normal">
                      Base: {formatCurrency(item.baseSalary)}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-700">
                    {item.transportAllowance > 0 ? (
                      formatCurrency(item.transportAllowance)
                    ) : (
                      <span className="text-slate-400 text-[10px] italic">$0 (Exento)</span>
                    )}
                  </td>

                  <td className="py-3 px-3 text-slate-700">
                    {item.overtimeAndSurcharges > 0 ? (
                      <span className="font-semibold text-blue-600">
                        +{formatCurrency(item.overtimeAndSurcharges)}
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">$0</span>
                    )}
                  </td>

                  <td className="py-3 px-3 font-bold text-slate-900 bg-amber-50/50">
                    {formatCurrency(item.totalEarnings)}
                  </td>

                  <td className="py-3 px-3 text-red-600">
                    -{formatCurrency(item.healthEmployee)}
                  </td>

                  <td className="py-3 px-3 text-red-600">
                    -{formatCurrency(item.pensionEmployee)}
                  </td>

                  <td className="py-3 px-3 font-semibold text-red-700 bg-red-50/30">
                    -{formatCurrency(item.totalDeductions)}
                  </td>

                  <td className="py-3 px-3 text-right font-extrabold text-emerald-700 text-sm bg-emerald-50/60">
                    {formatCurrency(item.netPay)}
                  </td>

                  <td className="py-3 px-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setSelectedItemForStub(item)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Ver comprobante individual"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        Ver
                      </button>
                      <button
                        onClick={() => exportSinglePaystubPDF(item, companyInfo, getPeriodLabel())}
                        className="p-1 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded transition-colors cursor-pointer"
                        title="Descargar PDF directo"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 text-slate-900 font-bold border-t-2 border-slate-300">
              <tr>
                <td className="py-3 px-3">TOTAL PERÍODO</td>
                <td className="py-3 px-2 text-center">-</td>
                <td className="py-3 px-3">{formatCurrency(totals.proportionalBaseSalary)}</td>
                <td className="py-3 px-3">{formatCurrency(totals.transportAllowance)}</td>
                <td className="py-3 px-3">{formatCurrency(totals.overtimeAndSurcharges)}</td>
                <td className="py-3 px-3 text-amber-900 bg-amber-100/50">{formatCurrency(totals.totalEarnings)}</td>
                <td className="py-3 px-3 text-red-700">-{formatCurrency(totals.healthEmployee)}</td>
                <td className="py-3 px-3 text-red-700">-{formatCurrency(totals.pensionEmployee)}</td>
                <td className="py-3 px-3 text-red-800 bg-red-100/50">-{formatCurrency(totals.totalDeductions)}</td>
                <td className="py-3 px-3 text-right text-emerald-800 text-base bg-emerald-100/60">
                  {formatCurrency(totals.netPay)}
                </td>
                <td className="py-3 px-3 text-center">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Paystub Modal / Print Preview */}
      {selectedItemForStub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-2xl my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal header */}
            <div className="bg-[#0B192C] text-white p-4 flex items-center justify-between no-print">
              <span className="font-bold text-sm flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" /> Comprobante Oficial de Pago de Nómina
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportSinglePaystubPDF(selectedItemForStub, companyInfo, getPeriodLabel())}
                  className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1 shadow"
                >
                  <Download className="w-3.5 h-3.5" /> Descargar PDF
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-lg flex items-center gap-1"
                >
                  <Printer className="w-3.5 h-3.5" /> Imprimir
                </button>
                <button
                  onClick={() => setSelectedItemForStub(null)}
                  className="p-1 text-slate-400 hover:text-white ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Printable Paystub Body */}
            <div className="p-8 text-xs text-slate-800 space-y-5 print:p-0">
              {/* Company Header */}
              <div className="border-b border-slate-200 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="text-base font-extrabold text-[#0B192C] uppercase tracking-wide">
                    {companyInfo.name}
                  </h3>
                  <p className="text-[11px] text-slate-600">NIT: {companyInfo.nit}</p>
                  <p className="text-[10px] text-slate-500">{companyInfo.address} &bull; {companyInfo.city}</p>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 bg-slate-100 border border-slate-200 font-bold text-[11px] rounded text-slate-800 block">
                    VOLANTE DE NÓMINA
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1">Período: {getPeriodLabel()}</p>
                </div>
              </div>

              {/* Employee Metadata */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div>
                  <p><strong>Colaborador:</strong> {selectedItemForStub.fullName}</p>
                  <p><strong>Identificación:</strong> {selectedItemForStub.documentNumber}</p>
                  <p><strong>Cargo:</strong> {selectedItemForStub.position}</p>
                </div>
                <div>
                  <p><strong>Salario Mensual:</strong> {formatCurrency(selectedItemForStub.baseSalary)}</p>
                  <p><strong>Días Liquidados:</strong> {selectedItemForStub.daysWorked} de {selectedItemForStub.daysInPeriod} días</p>
                  <p><strong>Proyecto:</strong> {selectedItemForStub.project}</p>
                </div>
              </div>

              {/* Devengados vs Deducciones Table */}
              <div className="grid grid-cols-2 gap-4">
                {/* Devengados */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-blue-50/80 px-3 py-1.5 font-bold text-blue-900 border-b border-slate-200 flex justify-between">
                    <span>DEVENGADOS</span>
                    <span>VALOR</span>
                  </div>
                  <div className="p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span>Básico proporcional</span>
                      <span className="font-semibold">{formatCurrency(selectedItemForStub.proportionalBaseSalary)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Auxilio de transporte</span>
                      <span className="font-semibold">{formatCurrency(selectedItemForStub.transportAllowance)}</span>
                    </div>
                    {selectedItemForStub.overtimeAndSurcharges > 0 && (
                      <div className="flex justify-between text-blue-700">
                        <span>Horas extras y recargos</span>
                        <span className="font-semibold">+{formatCurrency(selectedItemForStub.overtimeAndSurcharges)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900">
                      <span>TOTAL DEVENGADO</span>
                      <span>{formatCurrency(selectedItemForStub.totalEarnings)}</span>
                    </div>
                  </div>
                </div>

                {/* Deducciones */}
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="bg-red-50/80 px-3 py-1.5 font-bold text-red-900 border-b border-slate-200 flex justify-between">
                    <span>DEDUCCIONES</span>
                    <span>VALOR</span>
                  </div>
                  <div className="p-3 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span>Salud EPS (4%)</span>
                      <span className="font-semibold text-red-600">-{formatCurrency(selectedItemForStub.healthEmployee)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pensión AFP (4%)</span>
                      <span className="font-semibold text-red-600">-{formatCurrency(selectedItemForStub.pensionEmployee)}</span>
                    </div>
                    {selectedItemForStub.solidarityPension > 0 && (
                      <div className="flex justify-between">
                        <span>Fondo Solidaridad (1%)</span>
                        <span className="font-semibold text-red-600">-{formatCurrency(selectedItemForStub.solidarityPension)}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-red-900">
                      <span>TOTAL DEDUCCIONES</span>
                      <span>-{formatCurrency(selectedItemForStub.totalDeductions)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Net Pay Callout */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider block">
                    VALOR NETO PAGADO AL TRABAJADOR
                  </span>
                  <span className="text-xs text-emerald-700">
                    Dispersión bancaria registrada a {companyInfo.bankName}
                  </span>
                </div>
                <span className="text-2xl font-extrabold text-emerald-800">
                  {formatCurrency(selectedItemForStub.netPay)}
                </span>
              </div>

              {/* Signatures */}
              <div className="pt-8 grid grid-cols-2 gap-8 text-center text-[11px] text-slate-600">
                <div>
                  <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                    {companyInfo.legalRepresentative}
                  </div>
                  <p className="text-[10px] text-slate-400">Representante Legal / Gerencia</p>
                </div>
                <div>
                  <div className="border-t border-slate-400 pt-1.5 font-bold text-slate-800">
                    {selectedItemForStub.fullName}
                  </div>
                  <p className="text-[10px] text-slate-400">C.C. {selectedItemForStub.documentNumber} - Recibí a Conformidad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
