import React from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { formatCurrency } from '../../utils/payrollCalculator';
import { 
  ShieldCheck, 
  Building, 
  HelpCircle, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  DollarSign
} from 'lucide-react';

export const SocialSecurityView: React.FC = () => {
  const { employees, legalParams, updateLegalParams, companyInfo } = usePayroll();

  // Calculate monthly contributions for each employee
  const reportData = employees.map((emp) => {
    const ibc = emp.salary; // monthly base
    const isExempt = legalParams.exoneracionArt114_1 && ibc < legalParams.smlmv * 10;

    // Empleador
    const saludEmpleador = isExempt ? 0 : Math.round(ibc * (legalParams.saludEmpleadorPct / 100));
    const pensionEmpleador = Math.round(ibc * (legalParams.pensionEmpleadorPct / 100));
    const arlTarifa = legalParams.arlTarifas[emp.arlRiskClass] || 0.522;
    const arlEmpleador = Math.round(ibc * (arlTarifa / 100));

    // Parafiscales
    const caja = Math.round(ibc * (legalParams.parafiscales.caja / 100));
    const sena = isExempt ? 0 : Math.round(ibc * (legalParams.parafiscales.sena / 100));
    const icbf = isExempt ? 0 : Math.round(ibc * (legalParams.parafiscales.icbf / 100));
    const totalParafiscales = caja + sena + icbf;

    const totalAportesPatronales = saludEmpleador + pensionEmpleador + arlEmpleador + totalParafiscales;

    // Trabajador
    const saludTrabajador = Math.round(ibc * (legalParams.saludTrabajadorPct / 100));
    const pensionTrabajador = Math.round(ibc * (legalParams.pensionTrabajadorPct / 100));
    const totalTrabajador = saludTrabajador + pensionTrabajador;

    return {
      emp,
      ibc,
      saludEmpleador,
      pensionEmpleador,
      arlEmpleador,
      arlTarifa,
      caja,
      sena,
      icbf,
      totalParafiscales,
      totalAportesPatronales,
      saludTrabajador,
      pensionTrabajador,
      totalTrabajador,
      totalGeneral: totalAportesPatronales + totalTrabajador,
    };
  });

  const totals = reportData.reduce(
    (acc, row) => ({
      ibc: acc.ibc + row.ibc,
      saludEmpleador: acc.saludEmpleador + row.saludEmpleador,
      pensionEmpleador: acc.pensionEmpleador + row.pensionEmpleador,
      arlEmpleador: acc.arlEmpleador + row.arlEmpleador,
      caja: acc.caja + row.caja,
      sena: acc.sena + row.sena,
      icbf: acc.icbf + row.icbf,
      totalParafiscales: acc.totalParafiscales + row.totalParafiscales,
      totalAportesPatronales: acc.totalAportesPatronales + row.totalAportesPatronales,
      saludTrabajador: acc.saludTrabajador + row.saludTrabajador,
      pensionTrabajador: acc.pensionTrabajador + row.pensionTrabajador,
      totalTrabajador: acc.totalTrabajador + row.totalTrabajador,
      totalGeneral: acc.totalGeneral + row.totalGeneral,
    }),
    {
      ibc: 0,
      saludEmpleador: 0,
      pensionEmpleador: 0,
      arlEmpleador: 0,
      caja: 0,
      sena: 0,
      icbf: 0,
      totalParafiscales: 0,
      totalAportesPatronales: 0,
      saludTrabajador: 0,
      pensionTrabajador: 0,
      totalTrabajador: 0,
      totalGeneral: 0,
    }
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 6: Seguridad Social & Parafiscales
            </span>
            <span className="text-xs font-bold text-slate-500">
              Planilla PILA Integrada
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Aportes a Seguridad Social Integral y Aportes Parafiscales
          </h1>
          <p className="text-xs text-slate-500">
            Control de cotizaciones a Salud, Pensión, Riesgos Laborales (ARL) y Parafiscales (Caja, SENA, ICBF) conforme a la normatividad colombiana.
          </p>
        </div>

        {/* Exoneration toggle */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 self-start sm:self-auto">
          <div className="text-xs text-right">
            <span className="font-bold text-slate-800 block">Exoneración Art. 114-1 E.T.</span>
            <span className="text-[10px] text-slate-500">
              {legalParams.exoneracionArt114_1 ? 'Activa (Exonera Salud, SENA e ICBF)' : 'Inactiva (Tarifa plena 100%)'}
            </span>
          </div>
          <button
            onClick={() => updateLegalParams({ exoneracionArt114_1: !legalParams.exoneracionArt114_1 })}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              legalParams.exoneracionArt114_1 ? 'bg-emerald-600 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <div className="bg-white w-4 h-4 rounded-full shadow-md" />
          </button>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">IBC Total Mensual</span>
          <span className="text-xl font-extrabold text-slate-900">{formatCurrency(totals.ibc)}</span>
          <span className="text-[10px] text-slate-500 block">Base salarial de cotización</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Seguridad Social Empleador</span>
          <span className="text-xl font-extrabold text-blue-900">
            {formatCurrency(totals.saludEmpleador + totals.pensionEmpleador + totals.arlEmpleador)}
          </span>
          <span className="text-[10px] text-slate-500 block">Salud (8.5%) + Pensión (12%) + ARL</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 font-bold uppercase text-[10px] block">Aportes Parafiscales (9%)</span>
          <span className="text-xl font-extrabold text-amber-700">{formatCurrency(totals.totalParafiscales)}</span>
          <span className="text-[10px] text-slate-500 block">Caja (4%) + SENA (2%) + ICBF (3%)</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm bg-gradient-to-br from-indigo-50/50 to-white">
          <span className="text-indigo-800 font-bold uppercase text-[10px] block">Total Aportes Patronales</span>
          <span className="text-xl font-extrabold text-indigo-900">{formatCurrency(totals.totalAportesPatronales)}</span>
          <span className="text-[10px] text-indigo-600 block">Aporte exclusivo de la corporación</span>
        </div>
      </div>

      {/* Main Table: Empleador & Parafiscales Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Planilla de Aportes Patronales (Seguridad Social + Parafiscales)
          </span>
          <span className="text-[11px] text-slate-500">
            {companyInfo.name} &bull; NIT {companyInfo.nit}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#0B192C] text-white uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Cargo / Colaborador</th>
                <th className="py-3 px-3">IBC Mensual</th>
                <th className="py-3 px-3">Salud Pat. (8.5%)</th>
                <th className="py-3 px-3">Pensión Pat. (12%)</th>
                <th className="py-3 px-3">ARL Pat.</th>
                <th className="py-3 px-3">Caja (4%)</th>
                <th className="py-3 px-3">SENA (2%)</th>
                <th className="py-3 px-3">ICBF (3%)</th>
                <th className="py-3 px-4 text-right font-extrabold text-amber-400">Total Patrón</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reportData.map(({ emp, ibc, saludEmpleador, pensionEmpleador, arlEmpleador, arlTarifa, caja, sena, icbf, totalAportesPatronales }) => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900">{emp.position}</p>
                    <p className="text-[11px] text-slate-500">{emp.fullName}</p>
                  </td>

                  <td className="py-3 px-3 font-medium text-slate-800">
                    {formatCurrency(ibc)}
                  </td>

                  <td className="py-3 px-3 font-medium text-slate-800">
                    {formatCurrency(saludEmpleador)}
                  </td>

                  <td className="py-3 px-3 font-medium text-slate-800">
                    {formatCurrency(pensionEmpleador)}
                  </td>

                  <td className="py-3 px-3 font-medium text-slate-800">
                    {formatCurrency(arlEmpleador)}
                    <span className="block text-[10px] text-slate-400">Clase {emp.arlRiskClass} ({arlTarifa}%)</span>
                  </td>

                  <td className="py-3 px-3 text-slate-700">{formatCurrency(caja)}</td>
                  <td className="py-3 px-3 text-slate-700">{formatCurrency(sena)}</td>
                  <td className="py-3 px-3 text-slate-700">{formatCurrency(icbf)}</td>

                  <td className="py-3 px-4 text-right font-bold text-slate-900 bg-amber-50/40 text-sm">
                    {formatCurrency(totalAportesPatronales)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-slate-100 text-slate-900 font-bold border-t-2 border-slate-300">
              <tr>
                <td className="py-3 px-4">TOTAL APORTES PATRONALES</td>
                <td className="py-3 px-3">{formatCurrency(totals.ibc)}</td>
                <td className="py-3 px-3">{formatCurrency(totals.saludEmpleador)}</td>
                <td className="py-3 px-3">{formatCurrency(totals.pensionEmpleador)}</td>
                <td className="py-3 px-3">{formatCurrency(totals.arlEmpleador)}</td>
                <td className="py-3 px-3">{formatCurrency(totals.caja)}</td>
                <td className="py-3 px-3">{formatCurrency(totals.sena)}</td>
                <td className="py-3 px-3">{formatCurrency(totals.icbf)}</td>
                <td className="py-3 px-4 text-right text-base text-amber-900 font-extrabold">
                  {formatCurrency(totals.totalAportesPatronales)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* ARL Risk Classes Reference Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Tabla de Clases de Riesgo ARL (Decreto 1295 de 1994 y Decreto 1072 de 2015)
        </h3>
        <p className="text-slate-600">
          La tarifa de ARL depende directamente de la clasificación del riesgo de la actividad laboral del centro de trabajo y cargo:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <span className="font-extrabold text-emerald-800 block">Clase I (0.522%)</span>
            <span className="text-[10px] text-emerald-700">Administrativo, finanzas, oficina</span>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <span className="font-extrabold text-blue-800 block">Clase II (1.044%)</span>
            <span className="text-[10px] text-blue-700">Servicios, comercio, almacenes</span>
          </div>
          <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200">
            <span className="font-extrabold text-yellow-800 block">Clase III (2.436%)</span>
            <span className="text-[10px] text-yellow-700">Manufactura, procesos técnicos</span>
          </div>
          <div className="p-3 rounded-lg bg-orange-50 border border-orange-200">
            <span className="font-extrabold text-orange-800 block">Clase IV (4.350%)</span>
            <span className="text-[10px] text-orange-700">Transporte, seguridad privada</span>
          </div>
          <div className="p-3 rounded-lg bg-red-50 border border-red-200">
            <span className="font-extrabold text-red-800 block">Clase V (6.960%)</span>
            <span className="text-[10px] text-red-700">Construcción, minería, alturas</span>
          </div>
        </div>
      </div>
    </div>
  );
};
