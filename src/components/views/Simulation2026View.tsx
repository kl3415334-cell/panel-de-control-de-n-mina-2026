import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { formatCurrency } from '../../utils/payrollCalculator';
import { 
  PieChart, 
  RotateCcw, 
  Info, 
  Edit3, 
  CheckCircle2, 
  TrendingUp, 
  FileText, 
  ArrowRight,
  Sparkles,
  Calculator
} from 'lucide-react';

export const Simulation2026View: React.FC = () => {
  const { legalParams, employees, updateEmployee } = usePayroll();

  const [activeTab, setActiveTab] = useState<'base' | 'decenal' | 'financial_summary' | 'novelties'>('financial_summary');
  const [editingSalaries, setEditingSalaries] = useState<Record<string, number>>({
    'emp-1': 2000000,
    'emp-2': 2500000,
    'emp-3': 4500000,
    'emp-4': 3000000,
  });

  const handleSalaryChange = (empId: string, newSalary: number) => {
    setEditingSalaries((prev) => ({ ...prev, [empId]: newSalary }));
    const target = employees.find((e) => e.id === empId);
    if (target) {
      updateEmployee({
        ...target,
        salary: newSalary,
        hasTransportAllowance: newSalary <= legalParams.limiteAuxTransporte,
      });
    }
  };

  const handleResetToPDF = () => {
    handleSalaryChange('emp-1', 2000000);
    handleSalaryChange('emp-2', 2500000);
    handleSalaryChange('emp-3', 4500000);
    handleSalaryChange('emp-4', 3000000);
  };

  // Base salaries
  const sAux = editingSalaries['emp-1'] ?? 2000000;
  const sAdm = editingSalaries['emp-2'] ?? 2500000;
  const sGer = editingSalaries['emp-3'] ?? 4500000;
  const sGes = editingSalaries['emp-4'] ?? 3000000;

  const totalSalarios = sAux + sAdm + sGer + sGes;

  // Transport allowance
  const tAux = sAux <= legalParams.limiteAuxTransporte ? legalParams.auxTransporte : 0;
  const tAdm = sAdm <= legalParams.limiteAuxTransporte ? legalParams.auxTransporte : 0;
  const tGer = sGer <= legalParams.limiteAuxTransporte ? legalParams.auxTransporte : 0;
  const tGes = sGes <= legalParams.limiteAuxTransporte ? legalParams.auxTransporte : 0;
  const totalAuxilio = tAux + tAdm + tGer + tGes;

  // Social Security Employer
  const saludEmpleador = Math.round(totalSalarios * (legalParams.saludEmpleadorPct / 100)); // 8.5%
  const pensionEmpleador = Math.round(totalSalarios * (legalParams.pensionEmpleadorPct / 100)); // 12%
  const arlSimulada = Math.round(totalSalarios * (0.522 / 100)); // Riesgo I 0.522%
  const parafiscales9 = Math.round(totalSalarios * 0.09); // 9%

  // Social Benefits Provisions
  const basePrestAux = sAux + tAux;
  const basePrestAdm = sAdm + tAdm;
  const basePrestGer = sGer + tGer;
  const basePrestGes = sGes + tGes;
  const totalBasePrest = basePrestAux + basePrestAdm + basePrestGer + basePrestGes;

  const provCesantias = Math.round((totalBasePrest * 30) / 360);
  const provIntereses = Math.round((provCesantias * 30 * 0.12) / 360 * 12);
  const provPrimas = Math.round((totalBasePrest * 30) / 360);
  const provVacaciones = Math.round((totalSalarios * 30) / 720);

  const costoMensualEstimado =
    totalSalarios +
    totalAuxilio +
    saludEmpleador +
    pensionEmpleador +
    arlSimulada +
    parafiscales9 +
    provCesantias +
    provIntereses +
    provPrimas +
    provVacaciones;

  // Decenal payments (each 10 days = 1/3 of net monthly)
  const calc10DaysNet = (sal: number, transp: number) => {
    const devengado10 = (sal / 3) + (transp / 3);
    const ibc10 = sal / 3;
    const deduc10 = ibc10 * 0.08; // 4% salud + 4% pensión
    return Math.round(devengado10 - deduc10);
  };

  const decenalAux = calc10DaysNet(sAux, tAux);
  const decenalAdm = calc10DaysNet(sAdm, tAdm);
  const decenalGer = calc10DaysNet(sGer, tGer);
  const decenalGes = calc10DaysNet(sGes, tGes);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 12: Simulación Oficial
            </span>
            <span className="text-xs font-bold text-slate-500">
              Documento Académico 2026
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Simulacro de Nómina para Cuatro Trabajadores
          </h1>
          <p className="text-xs text-slate-500">
            Replicación interactiva del caso de estudio de la propuesta con recálculo dinámico en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetToPDF}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            title="Restaurar a los valores originales del PDF"
          >
            <RotateCcw className="w-3.5 h-3.5 text-blue-600" />
            Restablecer Valores PDF
          </button>
        </div>
      </div>

      {/* Navigation tabs for simulation */}
      <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
        <button
          onClick={() => setActiveTab('financial_summary')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'financial_summary' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          13. Resumen Financiero Consolidado ($19.1M)
        </button>
        <button
          onClick={() => setActiveTab('base')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'base' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          6. Salarios Base y Auxilios
        </button>
        <button
          onClick={() => setActiveTab('decenal')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'decenal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          9. Pagos Decenales (Cada 10 días)
        </button>
        <button
          onClick={() => setActiveTab('novelties')}
          className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
            activeTab === 'novelties' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          7. Novedades del Simulacro
        </button>
      </div>

      {/* Tab: Resumen Financiero (Section 13 of PDF) */}
      {activeTab === 'financial_summary' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Salarios Básicos</span>
              <span className="text-2xl font-extrabold text-slate-900">{formatCurrency(totalSalarios)}</span>
              <span className="text-xs text-slate-500 block mt-1">+ Aux. Transporte: {formatCurrency(totalAuxilio)}</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Seg. Social & Parafiscales</span>
              <span className="text-2xl font-extrabold text-blue-900">
                {formatCurrency(saludEmpleador + pensionEmpleador + arlSimulada + parafiscales9)}
              </span>
              <span className="text-xs text-slate-500 block mt-1">Salud, Pensión, ARL I, Parafiscales</span>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm bg-gradient-to-br from-amber-50 to-white">
              <span className="text-[10px] text-amber-700 uppercase font-bold block">Costo Mensual Estimado Total</span>
              <span className="text-2xl font-extrabold text-amber-900">{formatCurrency(costoMensualEstimado)}</span>
              <span className="text-xs text-amber-800 block mt-1">Exacto valor de referencia PDF ($19.101.946)</span>
            </div>
          </div>

          {/* Section 13 Official Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                13. Resumen Financiero del Simulacro (Octubre 2026)
              </span>
              <span className="text-[11px] text-slate-500">Valores proyectados mensuales</span>
            </div>

            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left text-slate-700">
                <thead className="bg-[#0B192C] text-white uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Concepto de Costo Laboral</th>
                    <th className="py-3 px-4">Tasa / Base de Referencia</th>
                    <th className="py-3 px-4 text-right">Total Mensual Estimado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Salarios Básicos</td>
                    <td className="py-2.5 px-4 text-slate-500">4 colaboradores jornada completa</td>
                    <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(totalSalarios)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Auxilios de Transporte</td>
                    <td className="py-2.5 px-4 text-slate-500">Reconocido a 3 trabajadores con salario ≤ 2 SMLMV</td>
                    <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(totalAuxilio)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Salud Empleador</td>
                    <td className="py-2.5 px-4 text-slate-500">8,5% sobre IBC de salarios ($12.000.000)</td>
                    <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(saludEmpleador)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Pensión Empleador</td>
                    <td className="py-2.5 px-4 text-slate-500">12% sobre IBC de salarios ($12.000.000)</td>
                    <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(pensionEmpleador)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">ARL Simulada (Riesgo I)</td>
                    <td className="py-2.5 px-4 text-slate-500">0,522% sobre IBC laboral</td>
                    <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(arlSimulada)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Aportes Parafiscales</td>
                    <td className="py-2.5 px-4 text-slate-500">9% (Caja 4% + SENA 2% + ICBF 3%)</td>
                    <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(parafiscales9)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Provisión de Cesantías</td>
                    <td className="py-2.5 px-4 text-slate-500">8,33% sobre base con auxilio ($12.747.285)</td>
                    <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(provCesantias)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Provisión de Intereses de Cesantías</td>
                    <td className="py-2.5 px-4 text-slate-500">1% mensual sobre cesantías devengadas</td>
                    <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(provIntereses)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Provisión de Prima de Servicios</td>
                    <td className="py-2.5 px-4 text-slate-500">8,33% sobre base con auxilio ($12.747.285)</td>
                    <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(provPrimas)}</td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-4 font-semibold text-slate-900">Provisión de Vacaciones</td>
                    <td className="py-2.5 px-4 text-slate-500">4,16% sobre salarios básicos ($12.000.000)</td>
                    <td className="py-2.5 px-4 text-right font-medium">{formatCurrency(provVacaciones)}</td>
                  </tr>
                </tbody>
                <tfoot className="bg-[#0B192C] text-white font-extrabold text-sm">
                  <tr>
                    <td className="py-3 px-4">COSTO MENSUAL ESTIMADO</td>
                    <td className="py-3 px-4 font-normal text-slate-300 text-xs">Carga laboral y prestacional total</td>
                    <td className="py-3 px-4 text-right text-amber-400 text-base">{formatCurrency(costoMensualEstimado)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Salarios Base y Auxilios (Section 6 of PDF) */}
      {activeTab === 'base' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                6. Simulacro de Nómina para Cuatro Trabajadores (Edición Interactiva)
              </h3>
              <p className="text-xs text-slate-500">
                Modifique los salarios para observar cómo se recalculan inmediatamente todas las prestaciones y aportes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <label className="font-bold text-slate-900 block">Auxiliar Contable</label>
              <input
                type="number"
                step={50000}
                value={sAux}
                onChange={(e) => handleSalaryChange('emp-1', Number(e.target.value))}
                className="w-full border border-slate-300 rounded p-2 text-xs font-bold"
              />
              <p className="text-[11px] text-slate-500">
                Auxilio de transporte: {formatCurrency(tAux)} ({tAux > 0 ? 'Recibe' : 'No recibe'})
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <label className="font-bold text-slate-900 block">Administración</label>
              <input
                type="number"
                step={50000}
                value={sAdm}
                onChange={(e) => handleSalaryChange('emp-2', Number(e.target.value))}
                className="w-full border border-slate-300 rounded p-2 text-xs font-bold"
              />
              <p className="text-[11px] text-slate-500">
                Auxilio de transporte: {formatCurrency(tAdm)} ({tAdm > 0 ? 'Recibe' : 'No recibe'})
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <label className="font-bold text-slate-900 block">Gerente</label>
              <input
                type="number"
                step={50000}
                value={sGer}
                onChange={(e) => handleSalaryChange('emp-3', Number(e.target.value))}
                className="w-full border border-slate-300 rounded p-2 text-xs font-bold"
              />
              <p className="text-[11px] text-slate-500">
                Auxilio de transporte: {formatCurrency(tGer)} ({tGer > 0 ? 'Recibe' : 'No recibe por superar 2 SMLMV'})
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <label className="font-bold text-slate-900 block">Gestor de Proyectos</label>
              <input
                type="number"
                step={50000}
                value={sGes}
                onChange={(e) => handleSalaryChange('emp-4', Number(e.target.value))}
                className="w-full border border-slate-300 rounded p-2 text-xs font-bold"
              />
              <p className="text-[11px] text-slate-500">
                Auxilio de transporte: {formatCurrency(tGes)} ({tGes > 0 ? 'Recibe por ser menor a $3.501.810' : 'No recibe'})
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Pagos Decenales (Section 9 of PDF) */}
      {activeTab === 'decenal' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              9. Pago de Nómina cada 10 días y Descuentos al Trabajador
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              La organización realiza tres pagos al mes de 10 días cada uno. Descuento ordinario: 4% salud + 4% pensión = 8% sobre IBC.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-slate-700">
              <thead className="bg-[#0B192C] text-white uppercase text-[10px] font-bold">
                <tr>
                  <th className="py-2.5 px-4">Cargo</th>
                  <th className="py-2.5 px-4">Salario Mensual</th>
                  <th className="py-2.5 px-4">Aux. Transp. Mensual</th>
                  <th className="py-2.5 px-4 text-right font-extrabold text-amber-400">
                    Pago Neto Aprox. por cada 10 días
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Auxiliar contable</td>
                  <td className="py-3 px-4">{formatCurrency(sAux)}</td>
                  <td className="py-3 px-4">{formatCurrency(tAux)}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 text-sm">
                    {formatCurrency(decenalAux)}
                    <span className="block text-[10px] text-slate-400 font-normal">PDF ref: $696.365</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Administración</td>
                  <td className="py-3 px-4">{formatCurrency(sAdm)}</td>
                  <td className="py-3 px-4">{formatCurrency(tAdm)}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 text-sm">
                    {formatCurrency(decenalAdm)}
                    <span className="block text-[10px] text-slate-400 font-normal">PDF ref: $849.698</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Gerente</td>
                  <td className="py-3 px-4">{formatCurrency(sGer)}</td>
                  <td className="py-3 px-4">{formatCurrency(tGer)}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 text-sm">
                    {formatCurrency(decenalGer)}
                    <span className="block text-[10px] text-slate-400 font-normal">PDF ref: $1.380.000</span>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-3 px-4 font-bold text-slate-900">Gestor de proyectos</td>
                  <td className="py-3 px-4">{formatCurrency(sGes)}</td>
                  <td className="py-3 px-4">{formatCurrency(tGes)}</td>
                  <td className="py-3 px-4 text-right font-extrabold text-slate-900 text-sm">
                    {formatCurrency(decenalGes)}
                    <span className="block text-[10px] text-slate-400 font-normal">PDF ref: $1.003.032</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Novedades simuladas (Section 7 of PDF) */}
      {activeTab === 'novelties' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">
              7. Novedades de Nómina Simuladas para Cada Persona
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Escenarios descritos en el documento académico oficial:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-1.5">
              <span className="font-bold text-amber-900 block">Auxiliar contable</span>
              <p className="text-xs font-semibold text-slate-800">Un día de incapacidad por enfermedad general.</p>
              <p className="text-[11px] text-slate-500">
                Tratamiento: Los primeros 2 días los asume la corporación al 66.67% de su salario ordinario, soportado con certificado médico expedido o transcrito por la EPS.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 space-y-1.5">
              <span className="font-bold text-blue-900 block">Administración</span>
              <p className="text-xs font-semibold text-slate-800">Dos horas extras diurnas.</p>
              <p className="text-[11px] text-slate-500">
                Tratamiento: Recargo del 25% sobre el valor de la hora ordinaria calculada con base en la reducción de jornada a 42 horas semanales.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1.5">
              <span className="font-bold text-emerald-900 block">Gerente</span>
              <p className="text-xs font-semibold text-slate-800">Sin novedades registradas.</p>
              <p className="text-[11px] text-slate-500">
                Tratamiento: Devenga su salario integral/ordinario básico de $4.500.000 de manera completa sin alteraciones ni deducciones por ausencias.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 space-y-1.5">
              <span className="font-bold text-purple-900 block">Gestor de proyectos</span>
              <p className="text-xs font-semibold text-slate-800">Un día de permiso no remunerado.</p>
              <p className="text-[11px] text-slate-500">
                Tratamiento: Descuento de un día de salario ordinario ($100.000) y proporcional de auxilio de transporte, suspendiendo temporalmente el deber de remuneración.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
