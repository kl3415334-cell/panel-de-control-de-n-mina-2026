import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  Novelty,
  LegalParameters,
  CompanyInfo,
  SystemUser,
  JobDescription,
  AuditLogEntry,
  PeriodType,
} from '../types/payroll';
import {
  INITIAL_EMPLOYEES,
  INITIAL_NOVELTIES,
  INITIAL_LEGAL_PARAMETERS_2026,
  INITIAL_COMPANY_INFO,
  INITIAL_USERS,
  INITIAL_JOB_DESCRIPTIONS,
} from '../data/initialData';

interface PayrollContextType {
  employees: Employee[];
  novelties: Novelty[];
  legalParams: LegalParameters;
  companyInfo: CompanyInfo;
  currentUser: SystemUser;
  jobDescriptions: JobDescription[];
  auditLogs: AuditLogEntry[];
  periodType: PeriodType;
  periodNumber: number;
  selectedMonth: number;
  selectedYear: number;
  payrollStatus: 'BORRADOR' | 'EN_REVISION' | 'APROBADO' | 'PAGADO';
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setPeriodType: (type: PeriodType) => void;
  setPeriodNumber: (num: number) => void;
  setSelectedMonth: (m: number) => void;
  setSelectedYear: (y: number) => void;
  setPayrollStatus: (status: 'BORRADOR' | 'EN_REVISION' | 'APROBADO' | 'PAGADO') => void;
  setCurrentUser: (user: SystemUser) => void;
  // CRUD Employees
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (emp: Employee) => void;
  deleteEmployee: (id: string) => void;
  // CRUD Novelties
  addNovelty: (nov: Omit<Novelty, 'id' | 'createdAt'>) => void;
  updateNovelty: (nov: Novelty) => void;
  deleteNovelty: (id: string) => void;
  // Legal Params
  updateLegalParams: (params: Partial<LegalParameters>) => void;
  resetLegalParams: () => void;
  // Company Info
  updateCompanyInfo: (info: Partial<CompanyInfo>) => void;
  // Job Descriptions
  updateJobDescription: (job: JobDescription) => void;
  // Workflow
  approvePayroll: () => void;
  payPayroll: () => void;
  // Backup / Reset
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonData: string) => boolean;
  resetDatabase: () => void;
  getPeriodLabel: () => string;
}

const PayrollContext = createContext<PayrollContextType | undefined>(undefined);

const STORAGE_KEY = 'somos_uno_nomina_storage_v1';

export const PayrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or default
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_employees`);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [novelties, setNovelties] = useState<Novelty[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_novelties`);
    return saved ? JSON.parse(saved) : INITIAL_NOVELTIES;
  });

  const [legalParams, setLegalParams] = useState<LegalParameters>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_legalParams`);
    return saved ? JSON.parse(saved) : INITIAL_LEGAL_PARAMETERS_2026;
  });

  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_companyInfo`);
    return saved ? JSON.parse(saved) : INITIAL_COMPANY_INFO;
  });

  const [currentUser, setCurrentUser] = useState<SystemUser>(INITIAL_USERS[2]); // Gerente by default for full preview
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_jobs`);
    return saved ? JSON.parse(saved) : INITIAL_JOB_DESCRIPTIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      user: 'Dra. Elena Valenzuela (Gerente)',
      role: 'GERENTE',
      action: 'Inicio de Sesión',
      module: 'Seguridad',
      details: 'Ingreso al sistema empresarial de nómina Corporación Social Somos Uno.',
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      user: 'Carlos Rodríguez (Administración)',
      role: 'ADMINISTRACION',
      action: 'Aprobación Novedades',
      module: 'Novedades',
      details: 'Aprobación de 3 novedades registradas para el período en curso.',
    },
  ]);

  const [periodType, setPeriodType] = useState<PeriodType>('10_DIAS');
  const [periodNumber, setPeriodNumber] = useState<number>(1);
  const [selectedMonth, setSelectedMonth] = useState<number>(10); // Octubre 2026
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [payrollStatus, setPayrollStatus] = useState<'BORRADOR' | 'EN_REVISION' | 'APROBADO' | 'PAGADO'>('APROBADO');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_employees`, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_novelties`, JSON.stringify(novelties));
  }, [novelties]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_legalParams`, JSON.stringify(legalParams));
  }, [legalParams]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_companyInfo`, JSON.stringify(companyInfo));
  }, [companyInfo]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_jobs`, JSON.stringify(jobDescriptions));
  }, [jobDescriptions]);

  const addAudit = (action: string, moduleName: string, details: string) => {
    const newEntry: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: currentUser.name,
      role: currentUser.role,
      action,
      module: moduleName,
      details,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const getPeriodLabel = (): string => {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    const monthName = months[selectedMonth - 1] || 'Octubre';

    if (periodType === '10_DIAS') {
      const ranges = ['1 al 10', '11 al 20', '21 al 30'];
      return `Decena ${periodNumber} (${ranges[periodNumber - 1]} de ${monthName} ${selectedYear})`;
    } else if (periodType === 'QUINCENAL') {
      const ranges = ['1 al 15 (Primera Quincena)', '16 al 30 (Segunda Quincena)'];
      return `${ranges[periodNumber - 1]} de ${monthName} ${selectedYear}`;
    } else {
      return `Mes Completo (1 al 30 de ${monthName} ${selectedYear})`;
    }
  };

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`,
    };
    setEmployees((prev) => [...prev, newEmp]);
    addAudit('Creación de Empleado', 'Empleados', `Se registró al empleado ${empData.fullName} (${empData.position}).`);
  };

  const updateEmployee = (emp: Employee) => {
    setEmployees((prev) => prev.map((e) => (e.id === emp.id ? emp : e)));
    addAudit('Edición de Empleado', 'Empleados', `Se actualizó la información de ${emp.fullName}.`);
  };

  const deleteEmployee = (id: string) => {
    const target = employees.find((e) => e.id === id);
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    if (target) {
      addAudit('Eliminación de Empleado', 'Empleados', `Se dio de baja al registro de ${target.fullName}.`);
    }
  };

  const addNovelty = (novData: Omit<Novelty, 'id' | 'createdAt'>) => {
    const newNov: Novelty = {
      ...novData,
      id: `nov-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setNovelties((prev) => [newNov, ...prev]);
    addAudit('Registro de Novedad', 'Novedades', `${novData.type} para ${novData.employeeName} (${novData.units} ${novData.unitType}).`);
  };

  const updateNovelty = (nov: Novelty) => {
    setNovelties((prev) => prev.map((n) => (n.id === nov.id ? nov : n)));
    addAudit('Actualización de Novedad', 'Novedades', `Modificación en novedad ${nov.type} de ${nov.employeeName}.`);
  };

  const deleteNovelty = (id: string) => {
    const target = novelties.find((n) => n.id === id);
    setNovelties((prev) => prev.filter((n) => n.id !== id));
    if (target) {
      addAudit('Eliminación de Novedad', 'Novedades', `Se eliminó novedad de ${target.employeeName}.`);
    }
  };

  const updateLegalParams = (params: Partial<LegalParameters>) => {
    setLegalParams((prev) => ({ ...prev, ...params }));
    addAudit('Modificación Parámetros Legales', 'Normatividad', 'Actualización de bases o tarifas normativas colombianas.');
  };

  const resetLegalParams = () => {
    setLegalParams(INITIAL_LEGAL_PARAMETERS_2026);
    addAudit('Restablecimiento Parámetros', 'Normatividad', 'Se restauraron los valores legales 2026 del documento oficial.');
  };

  const updateCompanyInfo = (info: Partial<CompanyInfo>) => {
    setCompanyInfo((prev) => ({ ...prev, ...info }));
    addAudit('Configuración Institucional', 'Sistema', 'Datos de la Corporación Social Somos Uno modificados.');
  };

  const updateJobDescription = (job: JobDescription) => {
    setJobDescriptions((prev) => prev.map((j) => (j.id === job.id ? job : j)));
    addAudit('Actualización Manual de Funciones', 'Manual de Funciones', `Modificación del perfil para cargo: ${job.position}.`);
  };

  const approvePayroll = () => {
    setPayrollStatus('APROBADO');
    addAudit('Aprobación de Nómina', 'Liquidación', `Nómina ${getPeriodLabel()} autorizada formalmente por ${currentUser.name}.`);
  };

  const payPayroll = () => {
    setPayrollStatus('PAGADO');
    addAudit('Dispersión de Pagos', 'Liquidación', `Desembolso y pagos bancarios de nómina registrados con éxito para ${getPeriodLabel()}.`);
  };

  const exportDatabaseJSON = () => {
    const data = {
      version: '2026.1',
      exportedAt: new Date().toISOString(),
      companyInfo,
      legalParams,
      employees,
      novelties,
      jobDescriptions,
      auditLogs,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Backup_Nomina_SomosUno_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addAudit('Copia de Seguridad', 'Sistema', 'Exportación de respaldo completo en archivo JSON.');
  };

  const importDatabaseJSON = (jsonData: string): boolean => {
    try {
      const parsed = JSON.parse(jsonData);
      if (parsed.employees && parsed.legalParams) {
        if (parsed.employees) setEmployees(parsed.employees);
        if (parsed.novelties) setNovelties(parsed.novelties);
        if (parsed.legalParams) setLegalParams(parsed.legalParams);
        if (parsed.companyInfo) setCompanyInfo(parsed.companyInfo);
        if (parsed.jobDescriptions) setJobDescriptions(parsed.jobDescriptions);
        addAudit('Restauración de Sistema', 'Sistema', 'Se restauró copia de seguridad JSON correctamente.');
        return true;
      }
      return false;
    } catch (e) {
      console.error('Error importing JSON backup:', e);
      return false;
    }
  };

  const resetDatabase = () => {
    setEmployees(INITIAL_EMPLOYEES);
    setNovelties(INITIAL_NOVELTIES);
    setLegalParams(INITIAL_LEGAL_PARAMETERS_2026);
    setCompanyInfo(INITIAL_COMPANY_INFO);
    setJobDescriptions(INITIAL_JOB_DESCRIPTIONS);
    setPayrollStatus('APROBADO');
    localStorage.clear();
    addAudit('Reinicio del Sistema', 'Sistema', 'Restablecimiento de la base de datos a los valores iniciales oficiales.');
  };

  return (
    <PayrollContext.Provider
      value={{
        employees,
        novelties,
        legalParams,
        companyInfo,
        currentUser,
        jobDescriptions,
        auditLogs,
        periodType,
        periodNumber,
        selectedMonth,
        selectedYear,
        payrollStatus,
        searchQuery,
        setSearchQuery,
        setPeriodType,
        setPeriodNumber,
        setSelectedMonth,
        setSelectedYear,
        setPayrollStatus,
        setCurrentUser,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        addNovelty,
        updateNovelty,
        deleteNovelty,
        updateLegalParams,
        resetLegalParams,
        updateCompanyInfo,
        updateJobDescription,
        approvePayroll,
        payPayroll,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetDatabase,
        getPeriodLabel,
      }}
    >
      {children}
    </PayrollContext.Provider>
  );
};

export const usePayroll = () => {
  const context = useContext(PayrollContext);
  if (!context) {
    throw new Error('usePayroll must be used within a PayrollProvider');
  }
  return context;
};
