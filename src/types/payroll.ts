export type ContractType = 
  | 'Término Indefinido'
  | 'Término Fijo'
  | 'Obra o Labor'
  | 'Aprendizaje Sena';

export type UserRole = 
  | 'AUXILIAR_CONTABLE'
  | 'ADMINISTRACION'
  | 'GERENTE'
  | 'GESTOR_PROYECTOS';

export type ArlRiskClass = 1 | 2 | 3 | 4 | 5;

export interface Employee {
  id: string;
  documentNumber: string;
  documentType: 'CC' | 'CE' | 'TI' | 'PAS';
  fullName: string;
  position: 'Auxiliar contable' | 'Administración' | 'Gerente' | 'Gestor de proyectos' | string;
  contractType: ContractType;
  startDate: string;
  salary: number;
  hasTransportAllowance: boolean;
  eps: string;
  pensionFund: string;
  arl: string;
  arlRiskClass: ArlRiskClass;
  compensationBox: string;
  phone: string;
  email: string;
  address: string;
  project: string;
  status: 'Activo' | 'Inactivo';
}

export type NoveltyType =
  | 'Incapacidad General'
  | 'Incapacidad Laboral'
  | 'Permiso Remunerado'
  | 'Permiso No Remunerado'
  | 'Licencia Maternidad / Paternidad'
  | 'Licencia de Luto'
  | 'Vacaciones Disfrutadas'
  | 'Horas Extras Diurnas (25%)'
  | 'Horas Extras Nocturnas (75%)'
  | 'Horas Extras Festivas Diurnas (100%)'
  | 'Horas Extras Festivas Nocturnas (150%)'
  | 'Recargo Nocturno (35%)'
  | 'Recargo Dominical / Festivo (75%)'
  | 'Ausencia Injustificada'
  | 'Llegada Tarde'
  | 'Bonificación Salarial'
  | 'Bonificación No Salarial'
  | 'Comisión';

export interface Novelty {
  id: string;
  employeeId: string;
  employeeName: string;
  type: NoveltyType;
  date: string;
  endDate?: string;
  units: number; // días u horas
  unitType: 'días' | 'horas' | 'valor';
  calculatedAmount: number;
  description: string;
  documentSupportName?: string;
  status: 'Aprobada' | 'Pendiente' | 'Rechazada';
  createdAt: string;
}

export type PeriodType = '10_DIAS' | 'QUINCENAL' | 'MENSUAL';

export interface LegalParameters {
  smlmv: number;
  auxTransporte: number;
  limiteAuxTransporte: number; // Por lo general 2 SMLMV
  jornadaSemanalHoras: number; // 42 hrs Ley 2101
  horasMes: number; // 210 hrs mensuales (42 hrs/semana * 5 semanas promedio aprox o 240 estándar)
  saludTrabajadorPct: number; // 4%
  pensionTrabajadorPct: number; // 4%
  saludEmpleadorPct: number; // 8.5%
  pensionEmpleadorPct: number; // 12%
  exoneracionArt114_1: boolean; // Si aplica exoneración para <10 SMLMV
  arlTarifas: {
    1: number; // 0.522%
    2: number; // 1.044%
    3: number; // 2.436%
    4: number; // 4.350%
    5: number; // 6.960%
  };
  parafiscales: {
    caja: number; // 4%
    sena: number; // 2%
    icbf: number; // 3%
  };
  prestaciones: {
    cesantias: number; // 8.333% (1/12)
    interesesCesantias: number; // 12% anual (1% mensual)
    prima: number; // 8.333% (1/12)
    vacaciones: number; // 4.167% (15 días por año = 1/24)
  };
}

export interface PayrollSettlement {
  periodType: PeriodType;
  periodNumber: number; // 1, 2, 3 para decenal; 1, 2 para quincenal; 1 para mensual
  month: number; // 1-12
  year: number;
  periodLabel: string;
  status: 'BORRADOR' | 'EN_REVISION' | 'APROBADO' | 'PAGADO';
  approvedBy?: string;
  approvedAt?: string;
  paidAt?: string;
  items: EmployeePayrollCalculation[];
}

export interface EmployeePayrollCalculation {
  employeeId: string;
  fullName: string;
  documentNumber: string;
  position: string;
  project: string;
  daysInPeriod: number;
  daysWorked: number;
  baseSalary: number;
  proportionalBaseSalary: number;
  transportAllowance: number;
  overtimeAndSurcharges: number;
  bonusesAndCommissions: number;
  otherEarnings: number;
  totalEarnings: number; // Total Devengado
  // Deducciones
  healthEmployee: number;
  pensionEmployee: number;
  solidarityPension: number;
  withholdingTax: number;
  unpaidLeaveDeductions: number;
  otherDeductions: number;
  totalDeductions: number;
  // Neto
  netPay: number;
  // Seguridad Social Empleador
  employerHealth: number;
  employerPension: number;
  employerArl: number;
  employerCaja: number;
  employerSena: number;
  employerIcbf: number;
  totalEmployerContributions: number;
  // Provisiones Prestaciones Sociales
  provisionCesantias: number;
  provisionInteresesCesantias: number;
  provisionPrima: number;
  provisionVacaciones: number;
  totalSocialProvisions: number;
  // Costo Laboral Total
  totalLaborCost: number;
}

export interface JobDescription {
  id: string;
  position: string;
  department: string;
  reportsTo: string;
  purpose: string;
  educationRequirements: string;
  experienceRequirements: string;
  competencies: string[];
  responsibilities: string[];
  specificFunctions: string[];
}

export interface SystemUser {
  id: string;
  name: string;
  username: string;
  role: UserRole;
  email: string;
  avatarColor: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  role: UserRole;
  action: string;
  module: string;
  details: string;
}

export interface CompanyInfo {
  name: string;
  nit: string;
  legalRepresentative: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  bankName: string;
  bankAccountType: string;
  bankAccountNumber: string;
}
