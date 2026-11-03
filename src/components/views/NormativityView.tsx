import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { NORMATIVITY_ITEMS } from '../../data/initialData';
import { formatCurrency } from '../../utils/payrollCalculator';
import { 
  Scale, 
  BookOpen, 
  Sliders, 
  RotateCcw, 
  Save, 
  CheckCircle, 
  Search, 
  AlertCircle, 
  Info,
  Calendar,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const NormativityView: React.FC = () => {
  const { legalParams, updateLegalParams, resetLegalParams, currentUser } = usePayroll();

  const [search, setSearch] = useState('');
  const [paramsForm, setParamsForm] = useState(legalParams);
  const [showSavedAlert, setShowSavedAlert] = useState(false);

  const canEditParams = currentUser.role === 'GERENTE' || currentUser.role === 'ADMINISTRACION';

  const handleSaveParams = (e: React.FormEvent) => {
    e.preventDefault();
    updateLegalParams(paramsForm);
    setShowSavedAlert(true);
    setTimeout(() => setShowSavedAlert(false), 3000);
  };

  const handleReset = () => {
    resetLegalParams();
    setParamsForm(legalParams);
  };

  const filteredNorms = NORMATIVITY_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.code.toLowerCase().includes(search.toLowerCase()) ||
    item.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 8: Marco Legal y Parámetros
            </span>
            <span className="text-xs font-bold text-slate-500">
              Colombia 2026
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Normatividad Laboral Colombiana y Parámetros del Sistema
          </h1>
          <p className="text-xs text-slate-500">
            Marco jurídico regulatorio aplicable a la Corporación Social Somos Uno y configuración de salarios mínimos, auxilios y tarifas.
          </p>
        </div>

        {showSavedAlert && (
          <div className="px-4 py-2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-xs font-bold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Parámetros guardados y actualizados
          </div>
        )}
      </div>

      {/* Grid: Parámetros Legales (Left) & Catálogo Normativo (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Editable Legal Parameters */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wider">
              <Sliders className="w-4 h-4 text-amber-500" />
              Parámetros de Liquidación
            </div>
            <button
              onClick={handleReset}
              className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
              title="Restaurar a los valores del documento 2026"
            >
              <RotateCcw className="w-3 h-3" /> Restaurar 2026
            </button>
          </div>

          <form onSubmit={handleSaveParams} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Salario Mínimo Legal Mensual Vigente (SMLMV 2026)
              </label>
              <input
                type="number"
                disabled={!canEditParams}
                value={paramsForm.smlmv}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setParamsForm({ 
                    ...paramsForm, 
                    smlmv: val,
                    limiteAuxTransporte: val * 2 // auto sync 2 SMLMV
                  });
                }}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Valor referencia: {formatCurrency(paramsForm.smlmv)}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Auxilio de Transporte Legal Mensual (2026)
              </label>
              <input
                type="number"
                disabled={!canEditParams}
                value={paramsForm.auxTransporte}
                onChange={(e) => setParamsForm({ ...paramsForm, auxTransporte: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Total mínimo con auxilio: {formatCurrency(paramsForm.smlmv + paramsForm.auxTransporte)}
              </span>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Límite Salarial para Auxilio de Transporte (2 SMLMV)
              </label>
              <input
                type="number"
                disabled={!canEditParams}
                value={paramsForm.limiteAuxTransporte}
                onChange={(e) => setParamsForm({ ...paramsForm, limiteAuxTransporte: Number(e.target.value) })}
                className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Salarios iguales o inferiores a este valor reciben auxilio.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Jornada Semanal (Ley 2101)
                </label>
                <input
                  type="number"
                  disabled={!canEditParams}
                  value={paramsForm.jornadaSemanalHoras}
                  onChange={(e) => setParamsForm({ ...paramsForm, jornadaSemanalHoras: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 disabled:bg-slate-100"
                />
                <span className="text-[10px] text-slate-500">42 horas (2026)</span>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Horas Base Mensuales
                </label>
                <input
                  type="number"
                  disabled={!canEditParams}
                  value={paramsForm.horasMes}
                  onChange={(e) => setParamsForm({ ...paramsForm, horasMes: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 disabled:bg-slate-100"
                />
                <span className="text-[10px] text-slate-500">210 hrs (calculo valor hora)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-[11px]">
              <span className="font-bold text-slate-800 block">Tarifas Aportes de Ley:</span>
              <div className="flex justify-between text-slate-600">
                <span>Salud Trabajador / Empleador:</span>
                <span className="font-semibold">{paramsForm.saludTrabajadorPct}% / {paramsForm.saludEmpleadorPct}%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Pensión Trabajador / Empleador:</span>
                <span className="font-semibold">{paramsForm.pensionTrabajadorPct}% / {paramsForm.pensionEmpleadorPct}%</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Parafiscales (Caja/SENA/ICBF):</span>
                <span className="font-semibold">4% / 2% / 3% (Total 9%)</span>
              </div>
            </div>

            {canEditParams && (
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow transition-all flex items-center justify-center gap-1.5"
              >
                <Save className="w-4 h-4" /> Guardar y Aplicar a Nóminas
              </button>
            )}
          </form>
        </div>

        {/* Right 2 Columns: Colombian Labor Law Library */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                Biblioteca Legal de Normatividad Laboral Colombiana
              </h2>
              <p className="text-xs text-slate-500">
                Leyes, decretos y jurisprudencia que rigen los cálculos salariales y prestacionales de la Corporación.
              </p>
            </div>

            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrar por norma o tema..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredNorms.map((norm, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors text-xs space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-[#0B192C] text-amber-400">
                      {norm.code}
                    </span>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{norm.title}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 shrink-0">
                    {norm.status}
                  </span>
                </div>

                <p className="text-[11px] text-blue-700 font-semibold">
                  Artículos aplicables: {norm.articles}
                </p>

                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {norm.summary}
                </p>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">
                    <strong className="text-slate-700">Impacto en Nómina:</strong> {norm.impact}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
