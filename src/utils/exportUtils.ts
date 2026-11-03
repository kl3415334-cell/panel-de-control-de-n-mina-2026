import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import { EmployeePayrollCalculation, CompanyInfo, PeriodType } from '../types/payroll';
import { formatCurrency } from './payrollCalculator';

export function exportPayrollToExcel(
  items: EmployeePayrollCalculation[],
  company: CompanyInfo,
  periodName: string
) {
  const wb = XLSX.utils.book_new();

  // 1. Resumen General de Nómina
  const dataPayroll = items.map((item, idx) => ({
    'No.': idx + 1,
    'Identificación': item.documentNumber,
    'Empleado': item.fullName,
    'Cargo': item.position,
    'Proyecto': item.project,
    'Días Trab.': item.daysWorked,
    'Salario Básico': item.baseSalary,
    'Básico Período': item.proportionalBaseSalary,
    'Aux. Transporte': item.transportAllowance,
    'Horas Extras / Recargos': item.overtimeAndSurcharges,
    'Bonificaciones': item.bonusesAndCommissions,
    'TOTAL DEVENGADO': item.totalEarnings,
    'Salud Trab. (4%)': item.healthEmployee,
    'Pensión Trab. (4%)': item.pensionEmployee,
    'Fondo Solidaridad': item.solidarityPension,
    'Retención Fuente': item.withholdingTax,
    'TOTAL DEDUCCIONES': item.totalDeductions,
    'NETO A PAGAR': item.netPay,
  }));

  const wsPayroll = XLSX.utils.json_to_sheet(dataPayroll);
  XLSX.utils.book_append_sheet(wb, wsPayroll, 'Liquidación Nómina');

  // 2. Seguridad Social y Parafiscales Empleador
  const dataSocial = items.map((item, idx) => ({
    'No.': idx + 1,
    'Empleado': item.fullName,
    'Cargo': item.position,
    'Salud Empleador (8.5%)': item.employerHealth,
    'Pensión Empleador (12%)': item.employerPension,
    'ARL Empleador': item.employerArl,
    'Caja Compensación (4%)': item.employerCaja,
    'SENA (2%)': item.employerSena,
    'ICBF (3%)': item.employerIcbf,
    'TOTAL APORTES EMPLEADOR': item.totalEmployerContributions,
  }));
  const wsSocial = XLSX.utils.json_to_sheet(dataSocial);
  XLSX.utils.book_append_sheet(wb, wsSocial, 'Seguridad Social & Parafiscales');

  // 3. Provisiones Prestaciones Sociales
  const dataBenefits = items.map((item, idx) => ({
    'No.': idx + 1,
    'Empleado': item.fullName,
    'Cargo': item.position,
    'Cesantías (8.33%)': item.provisionCesantias,
    'Intereses Cesantías (1%)': item.provisionInteresesCesantias,
    'Prima de Servicios (8.33%)': item.provisionPrima,
    'Vacaciones (4.16%)': item.provisionVacaciones,
    'TOTAL PROVISIÓN': item.totalSocialProvisions,
    'COSTO LABORAL TOTAL': item.totalLaborCost,
  }));
  const wsBenefits = XLSX.utils.json_to_sheet(dataBenefits);
  XLSX.utils.book_append_sheet(wb, wsBenefits, 'Prestaciones Sociales');

  const fileName = `Nomina_${company.name.replace(/\s+/g, '_')}_${periodName.replace(/\s+/g, '_')}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

export function exportSinglePaystubPDF(
  item: EmployeePayrollCalculation,
  company: CompanyInfo,
  periodName: string
) {
  const doc = new jsPDF();

  // Header Colors & Theme
  doc.setFillColor(11, 25, 44); // Deep Navy #0B192C
  doc.rect(0, 0, 210, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(company.name.toUpperCase(), 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`NIT: ${company.nit}  |  COMPROBANTE OFICIAL DE PAGO DE NÓMINA`, 14, 18);
  doc.text(`Período Liquidado: ${periodName}`, 14, 24);

  // Employee details card
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 34, 182, 30, 2, 2, 'F');

  doc.setTextColor(30, 41, 59);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('EMPLEADO:', 18, 41);
  doc.setFont('helvetica', 'normal');
  doc.text(item.fullName, 42, 41);

  doc.setFont('helvetica', 'bold');
  doc.text('DOCUMENTO:', 120, 41);
  doc.setFont('helvetica', 'normal');
  doc.text(item.documentNumber, 150, 41);

  doc.setFont('helvetica', 'bold');
  doc.text('CARGO:', 18, 49);
  doc.setFont('helvetica', 'normal');
  doc.text(item.position, 42, 49);

  doc.setFont('helvetica', 'bold');
  doc.text('PROYECTO:', 120, 49);
  doc.setFont('helvetica', 'normal');
  doc.text(item.project, 150, 49);

  doc.setFont('helvetica', 'bold');
  doc.text('SALARIO BÁSICO:', 18, 57);
  doc.setFont('helvetica', 'normal');
  doc.text(formatCurrency(item.baseSalary), 52, 57);

  doc.setFont('helvetica', 'bold');
  doc.text('DÍAS TRABAJADOS:', 120, 57);
  doc.setFont('helvetica', 'normal');
  doc.text(`${item.daysWorked} de ${item.daysInPeriod} días`, 155, 57);

  // Table Columns
  // Devengados (Left)
  let y = 72;
  doc.setFillColor(234, 242, 250);
  doc.rect(14, y, 88, 7, 'F');
  doc.setTextColor(11, 44, 90);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text('CONCEPTO DEVENGADO', 16, y + 5);
  doc.text('VALOR', 80, y + 5);

  // Deducciones (Right)
  doc.setFillColor(254, 242, 242);
  doc.rect(108, y, 88, 7, 'F');
  doc.setTextColor(153, 27, 27);
  doc.text('CONCEPTO DEDUCCIÓN', 110, y + 5);
  doc.text('VALOR', 174, y + 5);

  y += 12;
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'normal');

  // Rows Left
  doc.text('Salario Básico Período', 16, y);
  doc.text(formatCurrency(item.proportionalBaseSalary), 75, y);

  // Rows Right
  doc.text('Aporte Salud (4%)', 110, y);
  doc.text(formatCurrency(item.healthEmployee), 168, y);

  y += 7;
  doc.text('Auxilio de Transporte', 16, y);
  doc.text(formatCurrency(item.transportAllowance), 75, y);

  doc.text('Aporte Pensión (4%)', 110, y);
  doc.text(formatCurrency(item.pensionEmployee), 168, y);

  y += 7;
  doc.text('Horas Extras / Recargos', 16, y);
  doc.text(formatCurrency(item.overtimeAndSurcharges), 75, y);

  if (item.solidarityPension > 0) {
    doc.text('Fondo Solidaridad Pensional', 110, y);
    doc.text(formatCurrency(item.solidarityPension), 168, y);
  }

  y += 7;
  doc.text('Bonificaciones y Comisiones', 16, y);
  doc.text(formatCurrency(item.bonusesAndCommissions), 75, y);

  if (item.withholdingTax > 0) {
    doc.text('Retención en la Fuente', 110, y);
    doc.text(formatCurrency(item.withholdingTax), 168, y);
  }

  // Totals Row
  y += 10;
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, 88, 7, 'F');
  doc.rect(108, y, 88, 7, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('TOTAL DEVENGADOS:', 16, y + 5);
  doc.text(formatCurrency(item.totalEarnings), 68, y + 5);

  doc.text('TOTAL DEDUCCIONES:', 110, y + 5);
  doc.text(formatCurrency(item.totalDeductions), 162, y + 5);

  // Big Net Pay Box
  y += 15;
  doc.setFillColor(245, 250, 245);
  doc.setDrawColor(34, 197, 94);
  doc.roundedRect(14, y, 182, 16, 2, 2, 'FD');

  doc.setTextColor(21, 128, 61);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('NETO A RECIBIR:', 20, y + 10.5);
  doc.setFontSize(13);
  doc.text(formatCurrency(item.netPay), 150, y + 10.5);

  // Legal and banking note
  y += 24;
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Dispersión electrónica de nómina radicada en ${company.bankName} - ${company.bankAccountType}.`,
    14,
    y
  );
  doc.text(
    'Comprobante expedido de conformidad con el Art. 139 del Código Sustantivo del Trabajo de Colombia.',
    14,
    y + 5
  );

  // Signatures
  y += 30;
  doc.setDrawColor(148, 163, 184);
  doc.line(20, y, 85, y);
  doc.line(125, y, 190, y);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text('AUTORIZADO POR', 35, y + 5);
  doc.text(`${company.legalRepresentative} - Gerencia`, 22, y + 9);

  doc.text('RECIBIDO A CONFORMIDAD', 135, y + 5);
  doc.text(`${item.fullName} - C.C. ${item.documentNumber}`, 125, y + 9);

  doc.save(`Comprobante_${item.fullName.replace(/\s+/g, '_')}_${periodName.replace(/\s+/g, '_')}.pdf`);
}
