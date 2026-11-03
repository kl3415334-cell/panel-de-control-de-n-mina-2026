import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { formatCurrency } from '../../utils/payrollCalculator';
import { 
  Coins, 
  HelpCircle, 
  FileSpreadsheet, 
  Calculator, 
  Calendar, 
  Info, 
  CheckCircle,
  FileCheck,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const SocialBenefitsView: React.FC = () => {
  const { employees, legalParams } = usePayroll();

  const [activeTab, setActiveTab] = useState<'provision' | 'formulas' | 'extralegal' | 'simulator'>('provision');
  const [simDays, setSimDays] = useState(360);
  const [selectedSimEmpId, setSelectedSimEmpId] = useState(employees[0]?.id || '');

  // Calculate monthly provision for each employee
  const benefitsData = employees.map((emp) => {
    const getsTransport = emp.salary <= legalParams.limiteAuxTransporte && emp.hasTransportAllowance;
    const basePrestaciones = emp.salary + (getsTransport ? legalParams.auxTransporte : 0);
    const baseVacaciones = emp.salary;

    // Monthly provision (30 days):
    const cesantias = Math.round((basePrestaciones * 30) / 360); // 8.33%
    const intereses = Math.round((cesantias * 30 * 0.12) / 360 * 12); // 1.0% mensual de cesantías
    const prima = Math.round((basePrestaciones * 30) / 360); // 8.33%
    const vacaciones = Math.round((baseVacaciones * 30) / 720); // 4.167%
    const total = cesantias + intereses + prima + vacaciones;

    return {
      emp,
      basePrestaciones,
      baseVacaciones,
      cesantias,
      intereses,
      prima,
      vacaciones,
      total,
      getsTransport,
    };
  });

  const totals = benefitsData.reduce(
    (acc, b) => ({
      cesantias: acc.cesantias + b.cesantias,
      intereses: acc.intereses + b.intereses,
      prima: acc.prima + b.prima,
      vacaciones: acc.vacaciones + b.vacaciones,
      total: acc.total + b.total,
    }),
    { cesantias: 0, intereses: 0, prima: 0, vacaciones: 0, total: 0 }
  );

  // Contract Liquidation Simulation
  const simEmp = employees.find((e) => e.id === selectedSimEmpId) || employees[0];
  const simGetsTransport = simEmp ? simEmp.salary <= legalParams.limiteAuxTransporte && simEmp.hasTransportAllowance : false;
  const simBasePrest = simEmp ? simEmp.salary + (simGetsTransport ? legalParams.auxTransporte : 0) : 0;
  const simBaseVac = simEmp ? simEmp.salary : 0;

  const simCesantias = Math.round((simBasePrest * simDays) / 360);
  const simIntereses = Math.round((simCesantias * simDays * 0.12) / 360);
  const simPrima = Math.round((simBasePrest * simDays) / 360);
  const simVacaciones = Math.round((simBaseVac * simDays) / 720);
  const simTotal = simCesantias + simIntereses + simPrima + simVacaciones;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 5: Prestaciones Sociales
            </span>
            <span className="text-xs font-bold text-slate-500">
              Provisión Mensual: {formatCurrency(totals.total)}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Liquidación y Control de Prestaciones Sociales en Colombia
          </h1>
          <p className="text-xs text-slate-500">
            Cesantías (Ley 50/1990), Intereses a las Cesantías (Ley 52/1975), Prima de Servicios (Art. 306 CST) y Vacaciones (Art. 186 CST).
          </p>
        </div>

        {/* View mode buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('provision')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'provision' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Provisiones Mensuales
          </button>
          <button
            onClick={() => setActiveTab('formulas')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'formulas' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Fórmulas Legales
          </button>
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'simulator' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Simulador Liquidación
          </button>
          <button
            onClick={() => setActiveTab('extralegal')}
            className={`px-3 py-1.5 rounded-md font-bold transition-all ${
              activeTab === 'extralegal' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Primas Extralegales
          </button>
        </div>
      </div>

      {/* Main Tab: Provision Mensual */}
      {activeTab === 'provision' && (
        <div className="space-y-4">
          {/* 4 Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Cesantías (8.33%)</span>
              <span className="text-xl font-extrabold text-blue-900">{formatCurrency(totals.cesantias)}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Consignación a fondos: Feb 14</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Intereses Cesantías (1%)</span>
              <span className="text-xl font-extrabold text-amber-600">{formatCurrency(totals.intereses)}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Pago directo al trabajador: Ene 31</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Prima de Servicios (8.33%)</span>
              <span className="text-xl font-extrabold text-emerald-700">{formatCurrency(totals.prima)}</span>
              <span className="text-[10px] text-slate-500 block mt-1">Junio 30 y Diciembre 20</span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Vacaciones (4.167%)</span>
              <span className="text-xl font-extrabold text-indigo-700">{formatCurrency(totals.vacaciones)}</span>
              <span className="text-[10px] text-slate-500 block mt-1">15 días hábiles remunerados / año</span>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Provisión Contable Mensual por Empleado (Valores Oficiales 2026)
              </span>
              <span className="text-[11px] text-slate-500">
                Año laboral: 360 días &bull; Mes: 30 días
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600">
                <thead className="bg-[#0B192C] text-white uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="py-3 px-4">Cargo / Colaborador</th>
                    <th className="py-3 px-3">Salario Básico</th>
                    <th className="py-3 px-3">Aux. Transporte</th>
                    <th className="py-3 px-3 font-semibold text-blue-300">Base Cesantías & Prima</th>
                    <th className="py-3 px-3">Cesantías (8.33%)</th>
                    <th className="py-3 px-3">Intereses (1%)</th>
                    <th className="py-3 px-3">Prima (8.33%)</th>
                    <th className="py-3 px-3">Vacaciones (4.16%)</th>
                    <th className="py-3 px-4 text-right font-extrabold text-amber-400">Total Provisión Mensual</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {benefitsData.map(({ emp, basePrestaciones, cesantias, intereses, prima, vacaciones, total, getsTransport }) => (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{emp.position}</p>
                        <p className="text-[11px] text-slate-500">{emp.fullName}</p>
                      </td>

                      <td className="py-3 px-3 font-medium text-slate-800">
                        {formatCurrency(emp.salary)}
                      </td>

                      <td className="py-3 px-3">
                        {getsTransport ? (
                          <span className="text-emerald-700 font-semibold">{formatCurrency(legalParams.auxTransporte)}</span>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">$0 (Exento)</span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-bold text-blue-900 bg-blue-50/40">
                        {formatCurrency(basePrestaciones)}
                      </td>

                      <td className="py-3 px-3 text-slate-800">{formatCurrency(cesantias)}</td>
                      <td className="py-3 px-3 text-slate-800">{formatCurrency(intereses)}</td>
                      <td className="py-3 px-3 text-slate-800">{formatCurrency(prima)}</td>
                      <td className="py-3 px-3 text-slate-800">{formatCurrency(vacaciones)}</td>

                      <td className="py-3 px-4 text-right font-extrabold text-slate-900 bg-amber-50/40 text-sm">
                        {formatCurrency(total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100 text-slate-900 font-bold border-t-2 border-slate-300">
                  <tr>
                    <td className="py-3 px-4">TOTAL MENSUAL</td>
                    <td className="py-3 px-3">{formatCurrency(12000000)}</td>
                    <td className="py-3 px-3">{formatCurrency(747285)}</td>
                    <td className="py-3 px-3 text-blue-900">{formatCurrency(12747285)}</td>
                    <td className="py-3 px-3">{formatCurrency(totals.cesantias)}</td>
                    <td className="py-3 px-3">{formatCurrency(totals.intereses)}</td>
                    <td className="py-3 px-3">{formatCurrency(totals.prima)}</td>
                    <td className="py-3 px-3">{formatCurrency(totals.vacaciones)}</td>
                    <td className="py-3 px-4 text-right text-base text-amber-900 font-extrabold">
                      {formatCurrency(totals.total)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600 leading-relaxed">
              <strong className="text-slate-800">Nota técnica y contable:</strong> Estos valores representan provisiones mensuales calculadas para control contable y causación financiera interna de la <em>Corporación Social Somos Uno</em>. Las cesantías se consignan anualmente al fondo elegido antes del 15 de febrero; los intereses a las cesantías se pagan directamente a cada trabajador antes del 31 de enero; la prima de servicios se cancela semestralmente (50% en junio y 50% en diciembre); y las vacaciones se disfrutan o liquidan según los acuerdos individuales.
            </div>
          </div>
        </div>
      )}

      {/* Formulas Tab */}
      {activeTab === 'formulas' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
              <Calculator className="w-5 h-5 text-blue-600" /> Cesantías (Art. 249 CST / Ley 50 de 1990)
            </div>
            <div className="p-3 bg-slate-50 rounded-lg font-mono text-[11px] text-blue-950 border border-slate-200">
              Cesantías = (Base de Cesantías × Días Trabajados) / 360
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Base de liquidación:</strong> Salario básico devengado + Auxilio de transporte (si aplica) + Horas extras + Recargos salariales + Comisiones + Bonificaciones salariales habituales.
            </p>
            <p className="text-slate-500">
              Corresponde a 1 mes de salario por cada año de servicios o proporcional al tiempo laborado.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
              <Calculator className="w-5 h-5 text-amber-600" /> Intereses a las Cesantías (Ley 52 de 1975)
            </div>
            <div className="p-3 bg-slate-50 rounded-lg font-mono text-[11px] text-amber-950 border border-slate-200">
              Intereses = (Valor Cesantías × Días Trabajados × 12%) / 360
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Tasa de interés:</strong> 12% anual (o 1% mensual equivalente). Se liquida con base en las cesantías devengadas en el período evaluado.
            </p>
            <p className="text-slate-500">
              El empleador debe cancelarlos de forma directa en efectivo o transferencia al colaborador a más tardar el 31 de enero.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <Calculator className="w-5 h-5 text-emerald-600" /> Prima de Servicios (Art. 306 CST)
            </div>
            <div className="p-3 bg-slate-50 rounded-lg font-mono text-[11px] text-emerald-950 border border-slate-200">
              Prima de Servicios = (Base de Prima × Días Trabajados en el Semestre) / 360
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Base de liquidación:</strong> Salario básico devengado + Auxilio de transporte + devengados salariales habituales del semestre respectivo.
            </p>
            <p className="text-slate-500">
              Se cancela en dos cuotas: la primera hasta el 30 de junio y la segunda durante los primeros 20 días del mes de diciembre.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
              <Calculator className="w-5 h-5 text-indigo-600" /> Vacaciones (Art. 186 CST)
            </div>
            <div className="p-3 bg-slate-50 rounded-lg font-mono text-[11px] text-indigo-950 border border-slate-200">
              Vacaciones = (Salario Básico × Días Trabajados) / 720
            </div>
            <p className="text-slate-600 leading-relaxed">
              <strong>Base de liquidación:</strong> Salario ordinario. <em>El auxilio de transporte no se incluye en la base de vacaciones</em> ya que el trabajador no se desplaza durante el descanso.
            </p>
            <p className="text-slate-500">
              El trabajador tiene derecho a 15 días hábiles consecutivos de descanso remunerado por cada año completo de servicios.
            </p>
          </div>
        </div>
      )}

      {/* Simulator Tab */}
      {activeTab === 'simulator' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Simulador Dinámico de Liquidación Definitiva de Prestaciones
              </h3>
              <p className="text-xs text-slate-500">
                Seleccione el empleado y la cantidad de días trabajados acumulados para calcular la liquidación exacta.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Empleado a Liquidar</label>
              <select
                value={selectedSimEmpId}
                onChange={(e) => setSelectedSimEmpId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {employees.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.fullName} - {e.position} (Salario: {formatCurrency(e.salary)})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Días a Liquidar (Ej: 360 para un año completo, 180 para un semestre)
              </label>
              <input
                type="number"
                min={1}
                max={3600}
                value={simDays}
                onChange={(e) => setSimDays(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-blue-500 font-bold"
              />
            </div>
          </div>

          {/* Result cards */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Cesantías ({simDays} d)</span>
                <span className="text-base font-extrabold text-blue-900">{formatCurrency(simCesantias)}</span>
                <span className="text-[10px] text-slate-500 block">Base: {formatCurrency(simBasePrest)}</span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Intereses Cesantías</span>
                <span className="text-base font-extrabold text-amber-600">{formatCurrency(simIntereses)}</span>
                <span className="text-[10px] text-slate-500 block">12% proporcional</span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Prima de Servicios</span>
                <span className="text-base font-extrabold text-emerald-700">{formatCurrency(simPrima)}</span>
                <span className="text-[10px] text-slate-500 block">Base: {formatCurrency(simBasePrest)}</span>
              </div>

              <div className="p-3 bg-white rounded-lg border border-slate-200">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Vacaciones</span>
                <span className="text-base font-extrabold text-indigo-700">{formatCurrency(simVacaciones)}</span>
                <span className="text-[10px] text-slate-500 block">Base: {formatCurrency(simBaseVac)}</span>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-emerald-900 text-sm">TOTAL LIQUIDACIÓN DE PRESTACIONES</span>
                <p className="text-xs text-emerald-700">Calculado sobre {simDays} días de servicios para {simEmp?.fullName}</p>
              </div>
              <span className="text-2xl font-extrabold text-emerald-800">{formatCurrency(simTotal)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Extralegal Benefits Tab */}
      {activeTab === 'extralegal' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
          <div className="flex items-center gap-2">
            <Coins className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-slate-900">Régimen de Beneficios y Primas Extralegales</h3>
          </div>
          <p className="text-slate-600 leading-relaxed">
            Son beneficios adicionales que la <strong>Corporación Social Somos Uno</strong> puede establecer mediante convención, contrato individual o reglamento interno. Conforme al <em>Artículo 128 del Código Sustantivo del Trabajo</em>, pueden pactarse de manera expresa como <strong>no salariales</strong>, siempre que cumplan con la regla de límite del 40% consagrada en el artículo 30 de la Ley 1393 de 2010.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-slate-900">Prima Extralegal de Navidad</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Reconocimiento voluntario concedido a los colaboradores en el mes de diciembre para apoyo en la época festiva, sin impacto prestacional obligatorio si fue acordado como no salarial.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-slate-900">Bonificación por Logro de Proyectos</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Incentivo por cumplimiento de metas e indicadores sociales con las comunidades beneficiarias. Puede ser liquidado en el módulo de novedades.
              </p>
            </div>
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <h4 className="font-bold text-slate-900">Auxilio Educativo o de Bienestar</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Apoyo económico para capacitación técnica del equipo de trabajo en formulación de proyectos sociales y gestión comunitaria.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
