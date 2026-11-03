import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { Employee, ContractType, ArlRiskClass } from '../../types/payroll';
import { formatCurrency } from '../../utils/payrollCalculator';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  Building2, 
  CheckCircle, 
  X, 
  AlertCircle,
  Briefcase,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  MapPin,
  FolderOpen
} from 'lucide-react';

export const EmployeesView: React.FC = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, currentUser, legalParams } = usePayroll();

  const [search, setSearch] = useState('');
  const [filterPosition, setFilterPosition] = useState('ALL');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  // Form State
  const initialFormState: Omit<Employee, 'id'> = {
    documentNumber: '',
    documentType: 'CC',
    fullName: '',
    position: 'Auxiliar contable',
    contractType: 'Término Indefinido',
    startDate: new Date().toISOString().slice(0, 10),
    salary: 2000000,
    hasTransportAllowance: true,
    eps: 'EPS Sura',
    pensionFund: 'Porvenir S.A.',
    arl: 'ARL Sura',
    arlRiskClass: 1,
    compensationBox: 'Compensar',
    phone: '',
    email: '',
    address: '',
    project: 'Gestión Institucional',
    status: 'Activo',
  };

  const [formData, setFormData] = useState<Omit<Employee, 'id'>>(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.fullName.toLowerCase().includes(search.toLowerCase()) ||
      emp.documentNumber.includes(search) ||
      emp.position.toLowerCase().includes(search.toLowerCase()) ||
      emp.project.toLowerCase().includes(search.toLowerCase());

    const matchesPosition = filterPosition === 'ALL' || emp.position === filterPosition;

    return matchesSearch && matchesPosition;
  });

  const handleOpenAdd = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setFormData({
      documentNumber: emp.documentNumber,
      documentType: emp.documentType,
      fullName: emp.fullName,
      position: emp.position,
      contractType: emp.contractType,
      startDate: emp.startDate,
      salary: emp.salary,
      hasTransportAllowance: emp.hasTransportAllowance,
      eps: emp.eps,
      pensionFund: emp.pensionFund,
      arl: emp.arl,
      arlRiskClass: emp.arlRiskClass,
      compensationBox: emp.compensationBox,
      phone: emp.phone,
      email: emp.email,
      address: emp.address,
      project: emp.project,
      status: emp.status,
    });
    setEditingId(emp.id);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.documentNumber || formData.salary <= 0) {
      alert('Por favor complete todos los campos obligatorios.');
      return;
    }

    if (editingId) {
      updateEmployee({ ...formData, id: editingId });
    } else {
      addEmployee(formData);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (employeeToDelete) {
      deleteEmployee(employeeToDelete.id);
      setEmployeeToDelete(null);
      setIsDeleteConfirmOpen(false);
    }
  };

  // Check permissions: only Gerente, Admin or Auxiliar can modify employees
  const canEdit = currentUser.role !== 'GESTOR_PROYECTOS';

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900">Directorio de Empleados</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {employees.length} Registrados
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gestión completa de información laboral, afiliaciones al Sistema de Seguridad Social y contratos de la Corporación Social Somos Uno.
          </p>
        </div>

        {canEdit && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            Registrar Nuevo Empleado
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, documento o proyecto..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="ALL">Todos los cargos</option>
            <option value="Auxiliar contable">Auxiliar contable</option>
            <option value="Administración">Administración</option>
            <option value="Gerente">Gerente</option>
            <option value="Gestor de proyectos">Gestor de proyectos</option>
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-[#0B192C] text-white uppercase text-[10px] tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Empleado & Identificación</th>
                <th className="py-3 px-4">Cargo & Contrato</th>
                <th className="py-3 px-4">Salario Básico</th>
                <th className="py-3 px-4">Aux. Transporte</th>
                <th className="py-3 px-4">Afiliaciones (EPS / Pensiones / ARL)</th>
                <th className="py-3 px-4">Proyecto</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => {
                const getsTransport = emp.salary <= legalParams.limiteAuxTransporte && emp.hasTransportAllowance;

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                          {emp.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{emp.fullName}</p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {emp.documentType}: {emp.documentNumber}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-slate-800">{emp.position}</p>
                      <p className="text-[11px] text-slate-500">{emp.contractType}</p>
                    </td>

                    <td className="py-3 px-4 font-bold text-slate-900">
                      {formatCurrency(emp.salary)}
                      <span className="block text-[10px] text-slate-400 font-normal">mensual</span>
                    </td>

                    <td className="py-3 px-4">
                      {getsTransport ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {formatCurrency(legalParams.auxTransporte)}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-500">
                          Exento (&gt; 2 SMLMV)
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-[11px] space-y-0.5">
                      <p className="text-slate-700"><strong>EPS:</strong> {emp.eps}</p>
                      <p className="text-slate-700"><strong>AFP:</strong> {emp.pensionFund}</p>
                      <p className="text-slate-500"><strong>ARL:</strong> {emp.arl} (Riesgo {emp.arlRiskClass})</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {emp.project}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        emp.status === 'Activo'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {emp.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedEmployee(emp);
                            setIsDetailOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Ver Ficha Completa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {canEdit && (
                          <>
                            <button
                              onClick={() => handleOpenEdit(emp)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Editar Empleado"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEmployeeToDelete(emp);
                                setIsDeleteConfirmOpen(true);
                              }}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Eliminar Registro"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Employee */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#0B192C] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-400" />
                <h2 className="text-base font-bold">
                  {editingId ? 'Editar Información del Colaborador' : 'Registrar Nuevo Colaborador'}
                </h2>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto text-xs">
              {/* Sección 1: Datos Personales y Contractuales */}
              <div>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5 text-blue-900">
                  <Users className="w-4 h-4 text-blue-700" /> 1. Datos Personales y Laborales
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Nombre Completo *</label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Ej. Laura Marcela Gómez"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tipo de Documento *</label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="CE">Cédula de Extranjería (CE)</option>
                      <option value="TI">Tarjeta de Identidad (TI)</option>
                      <option value="PAS">Pasaporte (PAS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Número de Identificación *</label>
                    <input
                      type="text"
                      required
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      placeholder="Ej. 1.020.456.789"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Cargo *</label>
                    <select
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                    >
                      <option value="Auxiliar contable">Auxiliar contable</option>
                      <option value="Administración">Administración</option>
                      <option value="Gerente">Gerente</option>
                      <option value="Gestor de proyectos">Gestor de proyectos</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tipo de Contrato *</label>
                    <select
                      value={formData.contractType}
                      onChange={(e) => setFormData({ ...formData, contractType: e.target.value as ContractType })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Término Indefinido">Término Indefinido</option>
                      <option value="Término Fijo">Término Fijo</option>
                      <option value="Obra o Labor">Obra o Labor</option>
                      <option value="Aprendizaje Sena">Aprendizaje Sena</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Fecha de Ingreso *</label>
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Salario Básico Mensual (COP) *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      step={10000}
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Proyecto Asignado</label>
                    <input
                      type="text"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      placeholder="Ej. Fortalecimiento Comunitario"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="transportAllowance"
                    checked={formData.hasTransportAllowance}
                    onChange={(e) => setFormData({ ...formData, hasTransportAllowance: e.target.checked })}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <label htmlFor="transportAllowance" className="text-xs text-slate-700 font-medium">
                    Aplica Auxilio Legal de Transporte (Válido si no supera 2 SMLMV y requiere desplazamiento)
                  </label>
                </div>
              </div>

              {/* Sección 2: Afiliaciones Seguridad Social y Parafiscales */}
              <div>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5 text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" /> 2. Seguridad Social & Parafiscales
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">EPS (Entidad Promotora de Salud) *</label>
                    <input
                      type="text"
                      required
                      value={formData.eps}
                      onChange={(e) => setFormData({ ...formData, eps: e.target.value })}
                      placeholder="Ej. EPS Sura, Sanitas, Compensar"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Fondo de Pensiones (AFP) *</label>
                    <input
                      type="text"
                      required
                      value={formData.pensionFund}
                      onChange={(e) => setFormData({ ...formData, pensionFund: e.target.value })}
                      placeholder="Ej. Porvenir, Protección, Colpensiones"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">ARL (Administradora de Riesgos) *</label>
                    <input
                      type="text"
                      required
                      value={formData.arl}
                      onChange={(e) => setFormData({ ...formData, arl: e.target.value })}
                      placeholder="Ej. ARL Sura, Positiva"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Clase de Riesgo ARL *</label>
                    <select
                      value={formData.arlRiskClass}
                      onChange={(e) => setFormData({ ...formData, arlRiskClass: Number(e.target.value) as ArlRiskClass })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value={1}>Clase I (0.522% - Administrativo / Oficina)</option>
                      <option value={2}>Clase II (1.044% - Servicios / Almacén)</option>
                      <option value={3}>Clase III (2.436% - Manufactura / Talleres)</option>
                      <option value={4}>Clase IV (4.350% - Transporte / Alturas)</option>
                      <option value={5}>Clase V (6.960% - Construcción / Minería)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Caja de Compensación *</label>
                    <input
                      type="text"
                      required
                      value={formData.compensationBox}
                      onChange={(e) => setFormData({ ...formData, compensationBox: e.target.value })}
                      placeholder="Ej. Compensar, Colsubsidio, Cafam"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Estado Laboral</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    >
                      <option value="Activo">Activo</option>
                      <option value="Inactivo">Inactivo / Retirado</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección 3: Datos de Contacto */}
              <div>
                <h3 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3 pb-1 border-b border-slate-200 flex items-center gap-1.5 text-slate-800">
                  <Phone className="w-4 h-4 text-slate-700" /> 3. Datos de Contacto y Residencia
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Teléfono Móvil</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Ej. 312 458 9012"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="empleado@somosuno.org.co"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Dirección de Domicilio</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Calle 123 # 45-67"
                      className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow transition-all"
                >
                  {editingId ? 'Guardar Cambios' : 'Registrar Empleado'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail / Ficha Individual */}
      {isDetailOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#0B192C] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-extrabold flex items-center justify-center text-base">
                  {selectedEmployee.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base leading-tight">{selectedEmployee.fullName}</h3>
                  <p className="text-xs text-slate-300">{selectedEmployee.position} &bull; {selectedEmployee.documentType} {selectedEmployee.documentNumber}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsDetailOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Salario Básico</span>
                  <span className="text-sm font-extrabold text-slate-900">{formatCurrency(selectedEmployee.salary)}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Auxilio Transporte</span>
                  <span className="text-xs font-semibold text-slate-800">
                    {selectedEmployee.salary <= legalParams.limiteAuxTransporte && selectedEmployee.hasTransportAllowance
                      ? formatCurrency(legalParams.auxTransporte)
                      : 'No Aplica'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Tipo Contrato</span>
                  <span className="text-xs text-slate-800 font-medium">{selectedEmployee.contractType}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Fecha de Ingreso</span>
                  <span className="text-xs text-slate-800 font-medium">{selectedEmployee.startDate}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2 text-slate-500">Afiliaciones a Seguridad Social</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-slate-50 rounded border border-slate-100"><strong>EPS:</strong> {selectedEmployee.eps}</div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100"><strong>Fondo Pensión:</strong> {selectedEmployee.pensionFund}</div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100"><strong>ARL:</strong> {selectedEmployee.arl} (Riesgo {selectedEmployee.arlRiskClass})</div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-100"><strong>Caja Compensación:</strong> {selectedEmployee.compensationBox}</div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 uppercase text-[10px] tracking-wider mb-2 text-slate-500">Contacto y Asignación</h4>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                  <p><strong>Proyecto:</strong> {selectedEmployee.project}</p>
                  <p><strong>Teléfono:</strong> {selectedEmployee.phone || 'No registrado'}</p>
                  <p><strong>Correo:</strong> {selectedEmployee.email || 'No registrado'}</p>
                  <p><strong>Dirección:</strong> {selectedEmployee.address || 'No registrada'}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setIsDetailOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-slate-800"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && employeeToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">¿Confirmar Eliminación de Registro?</h3>
            <p className="text-xs text-slate-500 mt-2">
              Está a punto de eliminar a <strong>{employeeToDelete.fullName}</strong> ({employeeToDelete.position}). Esta acción se registrará en la bitácora de auditoría.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow"
              >
                Sí, Eliminar Registro
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
