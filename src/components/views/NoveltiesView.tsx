import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { Novelty, NoveltyType } from '../../types/payroll';
import { formatCurrency, calculateNoveltyAmount } from '../../utils/payrollCalculator';
import { 
  FileSpreadsheet, 
  PlusCircle, 
  Trash2, 
  FileText, 
  CheckCircle, 
  Clock, 
  UploadCloud, 
  X, 
  AlertCircle, 
  Calendar,
  FileCheck2,
  Paperclip,
  Check,
  Ban
} from 'lucide-react';

export const NoveltiesView: React.FC = () => {
  const { novelties, addNovelty, updateNovelty, deleteNovelty, employees, legalParams, currentUser } = usePayroll();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL');

  // New novelty state
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const [noveltyType, setNoveltyType] = useState<NoveltyType>('Incapacidad General');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState('');
  const [units, setUnits] = useState(1);
  const [unitType, setUnitType] = useState<'días' | 'horas' | 'valor'>('días');
  const [description, setDescription] = useState('');
  const [docSupportName, setDocSupportName] = useState('');

  const selectedEmp = employees.find((e) => e.id === selectedEmpId);

  // Automatically update unitType depending on novelty type
  const handleTypeChange = (type: NoveltyType) => {
    setNoveltyType(type);
    if (type.includes('Horas Extras') || type.includes('Recargo') || type === 'Llegada Tarde') {
      setUnitType('horas');
      setUnits(2);
    } else if (type === 'Bonificación Salarial' || type === 'Bonificación No Salarial' || type === 'Comisión') {
      setUnitType('valor');
      setUnits(100000);
    } else {
      setUnitType('días');
      setUnits(1);
    }
  };

  const calculatedPreview = selectedEmp
    ? unitType === 'valor'
      ? units
      : calculateNoveltyAmount(noveltyType, units, selectedEmp.salary, legalParams)
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    addNovelty({
      employeeId: selectedEmp.id,
      employeeName: selectedEmp.fullName,
      type: noveltyType,
      date,
      endDate: endDate || undefined,
      units,
      unitType,
      calculatedAmount: calculatedPreview,
      description: description || 'Novedad registrada con verificación documental.',
      documentSupportName: docSupportName || `Soporte_${noveltyType.slice(0, 6)}_${Date.now()}.pdf`,
      status: 'Aprobada',
    });

    setIsModalOpen(false);
    setDescription('');
    setDocSupportName('');
  };

  const filteredNovelties = novelties.filter((n) => {
    if (filterType === 'ALL') return true;
    return n.type.toLowerCase().includes(filterType.toLowerCase());
  });

  const canManage = currentUser.role !== 'GESTOR_PROYECTOS';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 4: Novedades de Personal
            </span>
            <span className="text-xs font-bold text-slate-500">
              {novelties.length} Registradas
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Registro y Control de Novedades de Nómina
          </h1>
          <p className="text-xs text-slate-500">
            Incapacidades, horas extras, permisos remunerados y no remunerados, vacaciones y licencias con soporte legal.
          </p>
        </div>

        {canManage && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 text-amber-400" />
            Registrar Novedad
          </button>
        )}
      </div>

      {/* Filter and stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 uppercase text-[10px] font-bold">Total Novedades</p>
            <p className="text-xl font-extrabold text-slate-900">{novelties.length}</p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            #
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 uppercase text-[10px] font-bold">Incapacidades</p>
            <p className="text-xl font-extrabold text-amber-600">
              {novelties.filter((n) => n.type.includes('Incapacidad')).length}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            EPS
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 uppercase text-[10px] font-bold">Horas Extras</p>
            <p className="text-xl font-extrabold text-blue-600">
              {novelties.filter((n) => n.type.includes('Horas Extras') || n.type.includes('Recargo')).length}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            H.E
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-400 uppercase text-[10px] font-bold">Permisos / Ausencias</p>
            <p className="text-xl font-extrabold text-slate-700">
              {novelties.filter((n) => n.type.includes('Permiso') || n.type.includes('Ausencia')).length}
            </p>
          </div>
          <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            P
          </div>
        </div>
      </div>

      {/* Novelties Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
            Bitácora de Novedades del Período
          </span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-slate-300 rounded px-2.5 py-1 text-xs text-slate-700 focus:outline-none bg-white"
          >
            <option value="ALL">Todas las novedades</option>
            <option value="Incapacidad">Incapacidades Médicas</option>
            <option value="Horas Extras">Horas Extras y Recargos</option>
            <option value="Permiso">Permisos y Licencias</option>
            <option value="Vacaciones">Vacaciones</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#0B192C] text-white uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Colaborador</th>
                <th className="py-3 px-3">Tipo de Novedad</th>
                <th className="py-3 px-3">Fecha Radicación</th>
                <th className="py-3 px-3 text-center">Magnitud</th>
                <th className="py-3 px-3">Valor / Liquidación</th>
                <th className="py-3 px-4">Descripción / Justificación</th>
                <th className="py-3 px-3">Soporte Documental</th>
                <th className="py-3 px-3">Estado</th>
                <th className="py-3 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredNovelties.map((nov) => (
                <tr key={nov.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">
                    {nov.employeeName}
                  </td>

                  <td className="py-3 px-3">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      nov.type.includes('Incapacidad') 
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : nov.type.includes('Horas Extras')
                        ? 'bg-blue-50 text-blue-800 border border-blue-200'
                        : nov.type.includes('No Remunerado')
                        ? 'bg-red-50 text-red-800 border border-red-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}>
                      {nov.type}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-slate-700">
                    {nov.date}
                  </td>

                  <td className="py-3 px-3 text-center font-bold text-slate-800">
                    {nov.units} {nov.unitType}
                  </td>

                  <td className="py-3 px-3 font-bold text-slate-900">
                    {formatCurrency(nov.calculatedAmount)}
                  </td>

                  <td className="py-3 px-4 text-slate-500 max-w-xs truncate" title={nov.description}>
                    {nov.description}
                  </td>

                  <td className="py-3 px-3">
                    {nov.documentSupportName ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:underline cursor-pointer">
                        <Paperclip className="w-3.5 h-3.5" />
                        {nov.documentSupportName.slice(0, 18)}...
                      </span>
                    ) : (
                      <span className="text-slate-400 italic text-[11px]">Sin soporte</span>
                    )}
                  </td>

                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {nov.status}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    {canManage && (
                      <button
                        onClick={() => deleteNovelty(nov.id)}
                        className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar novedad"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Novelty */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#0B192C] text-white px-5 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-amber-400" />
                Registrar Novedad de Nómina
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Colaborador Afectado *</label>
                <select
                  value={selectedEmpId}
                  onChange={(e) => setSelectedEmpId(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                      {emp.fullName} - {emp.position} (Salario: {formatCurrency(emp.salary)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tipo de Novedad *</label>
                <select
                  value={noveltyType}
                  onChange={(e) => handleTypeChange(e.target.value as NoveltyType)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <optgroup label="Incapacidades">
                    <option value="Incapacidad General">Incapacidad General (EPS - 66.67%)</option>
                    <option value="Incapacidad Laboral">Incapacidad Laboral (ARL - 100%)</option>
                  </optgroup>
                  <optgroup label="Permisos y Licencias">
                    <option value="Permiso Remunerado">Permiso Remunerado</option>
                    <option value="Permiso No Remunerado">Permiso No Remunerado (Descuento de salario)</option>
                    <option value="Licencia Maternidad / Paternidad">Licencia Maternidad / Paternidad (100%)</option>
                    <option value="Licencia de Luto">Licencia de Luto (5 días hábiles)</option>
                    <option value="Ausencia Injustificada">Ausencia Injustificada</option>
                  </optgroup>
                  <optgroup label="Horas Extras y Recargos">
                    <option value="Horas Extras Diurnas (25%)">Horas Extras Diurnas (25%)</option>
                    <option value="Horas Extras Nocturnas (75%)">Horas Extras Nocturnas (75%)</option>
                    <option value="Horas Extras Festivas Diurnas (100%)">Horas Extras Festivas Diurnas (100%)</option>
                    <option value="Horas Extras Festivas Nocturnas (150%)">Horas Extras Festivas Nocturnas (150%)</option>
                    <option value="Recargo Nocturno (35%)">Recargo Nocturno (35%)</option>
                    <option value="Recargo Dominical / Festivo (75%)">Recargo Dominical / Festivo (75% / Ley 2466)</option>
                  </optgroup>
                  <optgroup label="Vacaciones y Pagos Adicionales">
                    <option value="Vacaciones Disfrutadas">Vacaciones Disfrutadas</option>
                    <option value="Bonificación Salarial">Bonificación Salarial (Constitutiva de salario)</option>
                    <option value="Bonificación No Salarial">Bonificación No Salarial (Mera liberalidad)</option>
                    <option value="Comisión">Comisión por Gestión</option>
                  </optgroup>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fecha Inicio *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Fecha Fin (Opcional)</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Cantidad ({unitType}) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={units}
                    onChange={(e) => setUnits(Number(e.target.value))}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>

                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex flex-col justify-center">
                  <span className="text-[10px] text-slate-500 uppercase font-bold">Valor Calculado</span>
                  <span className="text-sm font-extrabold text-blue-900">
                    {formatCurrency(calculatedPreview)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Descripción / Justificación</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Motivo, número de radicado médico de la EPS o autorización..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Soporte Documental (PDF / Imagen)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={docSupportName}
                    onChange={(e) => setDocSupportName(e.target.value)}
                    placeholder="Certificado_EPS_001.pdf"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg cursor-pointer text-slate-700 shrink-0 font-medium flex items-center gap-1">
                    <UploadCloud className="w-3.5 h-3.5" /> Adjuntar
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setDocSupportName(e.target.files[0].name);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold rounded-lg shadow"
                >
                  Guardar Novedad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
