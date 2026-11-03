import { Employee, Novelty, LegalParameters, EmployeePayrollCalculation, PeriodType } from '../types/payroll';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(Math.round(amount));
};

export const formatNumber = (val: number): string => {
  return new Intl.NumberFormat('es-CO').format(Math.round(val));
};

export function calculateNoveltyAmount(
  noveltyType: string,
  units: number,
  baseSalary: number,
  legalParams: LegalParameters
): number {
  const hourlyRate = baseSalary / legalParams.horasMes;
  const dailyRate = baseSalary / 30;

  switch (noveltyType) {
    case 'Horas Extras Diurnas (25%)':
      return units * hourlyRate * 1.25;
    case 'Horas Extras Nocturnas (75%)':
      return units * hourlyRate * 1.75;
    case 'Horas Extras Festivas Diurnas (100%)':
      return units * hourlyRate * 2.0;
    case 'Horas Extras Festivas Nocturnas (150%)':
      return units * hourlyRate * 2.5;
    case 'Recargo Nocturno (35%)':
      return units * hourlyRate * 0.35;
    case 'Recargo Dominical / Festivo (75%)':
      return units * hourlyRate * 0.75;
    case 'Incapacidad General':
      // En Colombia, primeros 2 días asumidos por el empleador al 66.67%
      return Math.round(units * (dailyRate * 0.6667));
    case 'Incapacidad Laboral':
      // Asumida por ARL al 100%
      return Math.round(units * dailyRate);
    case 'Permiso No Remunerado':
    case 'Ausencia Injustificada':
      return Math.round(units * dailyRate);
    case 'Vacaciones Disfrutadas':
      return Math.round(units * dailyRate);
    case 'Llegada Tarde':
      return Math.round(units * hourlyRate);
    default:
      return 0;
  }
}

export function calculateEmployeePayroll(
  employee: Employee,
  periodType: PeriodType,
  novelties: Novelty[],
  legalParams: LegalParameters
): EmployeePayrollCalculation {
  let daysInPeriod = 30;
  let fractionOfMonth = 1.0;

  if (periodType === '10_DIAS') {
    daysInPeriod = 10;
    fractionOfMonth = 10 / 30; // 1/3
  } else if (periodType === 'QUINCENAL') {
    daysInPeriod = 15;
    fractionOfMonth = 15 / 30; // 1/2
  } else {
    daysInPeriod = 30;
    fractionOfMonth = 1.0;
  }

  // Filter novelties relevant to this employee
  const empNovelties = novelties.filter(
    (n) => n.employeeId === employee.id && n.status === 'Aprobada'
  );

  let unpaidDays = 0;
  let sickDays = 0;
  let overtimeAndSurcharges = 0;
  let bonusesAndCommissions = 0;
  let otherEarnings = 0;

  empNovelties.forEach((n) => {
    if (n.type === 'Permiso No Remunerado' || n.type === 'Ausencia Injustificada') {
      unpaidDays += n.units;
    } else if (n.type === 'Incapacidad General' || n.type === 'Incapacidad Laboral') {
      sickDays += n.units;
    } else if (
      n.type.includes('Horas Extras') ||
      n.type.includes('Recargo')
    ) {
      overtimeAndSurcharges += n.calculatedAmount;
    } else if (n.type === 'Bonificación Salarial' || n.type === 'Comisión') {
      bonusesAndCommissions += n.calculatedAmount;
    } else if (n.type === 'Bonificación No Salarial') {
      otherEarnings += n.calculatedAmount;
    }
  });

  const daysWorked = Math.max(0, daysInPeriod - unpaidDays);
  const baseSalary = employee.salary;
  const proportionalBaseSalary = Math.round((baseSalary / 30) * daysWorked);

  // Auxilio de transporte
  // Aplica si salario <= 2 SMLMV y el flag está activo
  const qualifiesForTransport =
    employee.salary <= legalParams.limiteAuxTransporte && employee.hasTransportAllowance;
  
  const transportAllowance = qualifiesForTransport
    ? Math.round((legalParams.auxTransporte / 30) * daysWorked)
    : 0;

  // Total Devengado
  const totalEarnings =
    proportionalBaseSalary +
    transportAllowance +
    overtimeAndSurcharges +
    bonusesAndCommissions +
    otherEarnings;

  // Ingreso Base de Cotización (IBC)
  // No incluye auxilio de transporte ni bonos no salariales
  let ibc = proportionalBaseSalary + overtimeAndSurcharges + bonusesAndCommissions;
  
  // En Colombia el IBC mensual no puede ser inferior a 1 SMLMV proporcional
  const minIbcProportional = (legalParams.smlmv / 30) * daysWorked;
  if (ibc < minIbcProportional && daysWorked > 0) {
    ibc = minIbcProportional;
  }

  // Deducciones del Trabajador
  const healthEmployee = Math.round(ibc * (legalParams.saludTrabajadorPct / 100));
  const pensionEmployee = Math.round(ibc * (legalParams.pensionTrabajadorPct / 100));

  // Fondo de Solidaridad Pensional (1% si IBC mensual equivalente > 4 SMLMV)
  const monthlyEquivalentIbc = ibc / fractionOfMonth;
  let solidarityPension = 0;
  if (monthlyEquivalentIbc > legalParams.smlmv * 4) {
    solidarityPension = Math.round(ibc * 0.01);
  }

  // Retención en la fuente estimada (simplificada para salarios estándar colombianos)
  let withholdingTax = 0;
  if (monthlyEquivalentIbc > legalParams.smlmv * 6) {
    withholdingTax = Math.round((ibc - legalParams.smlmv * 4) * 0.05);
  }

  const unpaidLeaveDeductions = Math.round((baseSalary / 30) * unpaidDays);
  const otherDeductions = 0;

  const totalDeductions =
    healthEmployee +
    pensionEmployee +
    solidarityPension +
    withholdingTax +
    otherDeductions;

  // Neto a Pagar
  const netPay = totalEarnings - totalDeductions;

  // Aportes de Seguridad Social del Empleador
  // Exoneración Art. 114-1 Estatuto Tributario aplica a salud si el empleado gana < 10 SMLMV
  const exemptArt114 =
    legalParams.exoneracionArt114_1 &&
    monthlyEquivalentIbc < legalParams.smlmv * 10;

  const employerHealth = exemptArt114
    ? 0
    : Math.round(ibc * (legalParams.saludEmpleadorPct / 100));

  const employerPension = Math.round(ibc * (legalParams.pensionEmpleadorPct / 100));

  // ARL
  const arlRate = legalParams.arlTarifas[employee.arlRiskClass] || 0.522;
  const employerArl = Math.round(ibc * (arlRate / 100));

  // Parafiscales (Caja, SENA, ICBF)
  // Base parafiscal = IBC (excluye auxilio de transporte)
  const employerCaja = Math.round(ibc * (legalParams.parafiscales.caja / 100));
  const employerSena = exemptArt114
    ? 0
    : Math.round(ibc * (legalParams.parafiscales.sena / 100));
  const employerIcbf = exemptArt114
    ? 0
    : Math.round(ibc * (legalParams.parafiscales.icbf / 100));

  const totalEmployerContributions =
    employerHealth +
    employerPension +
    employerArl +
    employerCaja +
    employerSena +
    employerIcbf;

  // Provisiones de Prestaciones Sociales
  // Base cesantías y prima = Salario + Auxilio de transporte + devengados salariales
  const basePrestacionesConAuxilio =
    proportionalBaseSalary + transportAllowance + overtimeAndSurcharges + bonusesAndCommissions;
  // Base vacaciones = Salario devengado (sin auxilio de transporte)
  const baseVacaciones = proportionalBaseSalary;

  // Fórmulas legales:
  // Cesantías = Base * días / 360
  const provisionCesantias = Math.round(
    (basePrestacionesConAuxilio * daysWorked) / 360
  );
  // Intereses a las cesantías = Cesantías * días * 12% / 360
  const provisionInteresesCesantias = Math.round(
    (provisionCesantias * daysWorked * 0.12) / 360 * 12 // o directamente 1% mensual: provisionCesantias * 0.12 * (daysWorked/30)
  );
  // Prima de servicios = Base * días / 360
  const provisionPrima = Math.round(
    (basePrestacionesConAuxilio * daysWorked) / 360
  );
  // Vacaciones = Base * días / 720
  const provisionVacaciones = Math.round((baseVacaciones * daysWorked) / 720);

  const totalSocialProvisions =
    provisionCesantias +
    provisionInteresesCesantias +
    provisionPrima +
    provisionVacaciones;

  // Costo Laboral Total para la Corporación
  const totalLaborCost =
    totalEarnings + totalEmployerContributions + totalSocialProvisions;

  return {
    employeeId: employee.id,
    fullName: employee.fullName,
    documentNumber: employee.documentNumber,
    position: employee.position,
    project: employee.project,
    daysInPeriod,
    daysWorked,
    baseSalary,
    proportionalBaseSalary,
    transportAllowance,
    overtimeAndSurcharges,
    bonusesAndCommissions,
    otherEarnings,
    totalEarnings,
    healthEmployee,
    pensionEmployee,
    solidarityPension,
    withholdingTax,
    unpaidLeaveDeductions,
    otherDeductions,
    totalDeductions,
    netPay,
    employerHealth,
    employerPension,
    employerArl,
    employerCaja,
    employerSena,
    employerIcbf,
    totalEmployerContributions,
    provisionCesantias,
    provisionInteresesCesantias,
    provisionPrima,
    provisionVacaciones,
    totalSocialProvisions,
    totalLaborCost,
  };
}

export function calculateConsolidatedPayroll(
  employees: Employee[],
  periodType: PeriodType,
  novelties: Novelty[],
  legalParams: LegalParameters
) {
  const activeEmployees = employees.filter((e) => e.status === 'Activo');
  const items = activeEmployees.map((emp) =>
    calculateEmployeePayroll(emp, periodType, novelties, legalParams)
  );

  const totals = items.reduce(
    (acc, item) => ({
      baseSalary: acc.baseSalary + item.baseSalary,
      proportionalBaseSalary: acc.proportionalBaseSalary + item.proportionalBaseSalary,
      transportAllowance: acc.transportAllowance + item.transportAllowance,
      overtimeAndSurcharges: acc.overtimeAndSurcharges + item.overtimeAndSurcharges,
      bonusesAndCommissions: acc.bonusesAndCommissions + item.bonusesAndCommissions,
      totalEarnings: acc.totalEarnings + item.totalEarnings,
      healthEmployee: acc.healthEmployee + item.healthEmployee,
      pensionEmployee: acc.pensionEmployee + item.pensionEmployee,
      solidarityPension: acc.solidarityPension + item.solidarityPension,
      withholdingTax: acc.withholdingTax + item.withholdingTax,
      totalDeductions: acc.totalDeductions + item.totalDeductions,
      netPay: acc.netPay + item.netPay,
      employerHealth: acc.employerHealth + item.employerHealth,
      employerPension: acc.employerPension + item.employerPension,
      employerArl: acc.employerArl + item.employerArl,
      employerCaja: acc.employerCaja + item.employerCaja,
      employerSena: acc.employerSena + item.employerSena,
      employerIcbf: acc.employerIcbf + item.employerIcbf,
      totalEmployerContributions:
        acc.totalEmployerContributions + item.totalEmployerContributions,
      provisionCesantias: acc.provisionCesantias + item.provisionCesantias,
      provisionInteresesCesantias:
        acc.provisionInteresesCesantias + item.provisionInteresesCesantias,
      provisionPrima: acc.provisionPrima + item.provisionPrima,
      provisionVacaciones: acc.provisionVacaciones + item.provisionVacaciones,
      totalSocialProvisions: acc.totalSocialProvisions + item.totalSocialProvisions,
      totalLaborCost: acc.totalLaborCost + item.totalLaborCost,
    }),
    {
      baseSalary: 0,
      proportionalBaseSalary: 0,
      transportAllowance: 0,
      overtimeAndSurcharges: 0,
      bonusesAndCommissions: 0,
      totalEarnings: 0,
      healthEmployee: 0,
      pensionEmployee: 0,
      solidarityPension: 0,
      withholdingTax: 0,
      totalDeductions: 0,
      netPay: 0,
      employerHealth: 0,
      employerPension: 0,
      employerArl: 0,
      employerCaja: 0,
      employerSena: 0,
      employerIcbf: 0,
      totalEmployerContributions: 0,
      provisionCesantias: 0,
      provisionInteresesCesantias: 0,
      provisionPrima: 0,
      provisionVacaciones: 0,
      totalSocialProvisions: 0,
      totalLaborCost: 0,
    }
  );

  return { items, totals, count: items.length };
}
