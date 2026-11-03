import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { 
  GitBranch, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  ArrowDown, 
  FileText, 
  RotateCcw, 
  Users, 
  Calculator, 
  ShieldCheck, 
  AlertTriangle,
  Sparkles,
  ClipboardCheck
} from 'lucide-react';

interface PhvaFlowViewProps {
  setActiveTab: (tab: string) => void;
}

export const PhvaFlowView: React.FC<PhvaFlowViewProps> = ({ setActiveTab }) => {
  const { getPeriodLabel, payrollStatus } = usePayroll();

  const [activeStep, setActiveStep] = useState<'P' | 'H' | 'V' | 'A'>('H');

  const [checklist, setChecklist] = useState({
    // Planear
    p1: true,
    p2: true,
    p3: true,
    p4: true,
    // Hacer
    h1: true,
    h2: true,
    h3: payrollStatus === 'PAGADO',
    // Verificar
    v1: true,
    v2: true,
    v3: true,
    // Actuar
    a1: true,
    a2: true,
    a3: false,
  });

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const steps = [
    {
      id: 'P',
      name: 'P - PLANEAR',
      subtitle: 'Organización contractual y normativa previa',
      color: 'blue',
      borderColor: 'border-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-900',
      badgeColor: 'bg-blue-600 text-white',
      desc: 'Identificar empleados, modalidades de contrato, salarios vigentes, calendario de pagos y fechas límite legales.',
      tasks: [
        { key: 'p1', label: 'Identificar empleados activos y contratos laborales vigentes.' },
        { key: 'p2', label: 'Establecer salarios básicos y validar derecho al auxilio de transporte.' },
        { key: 'p3', label: 'Definir el calendario de pago decenal (10, 20 y 30 de cada mes).' },
        { key: 'p4', label: 'Identificar obligaciones parafiscales y fechas de vencimiento de planilla PILA.' },
      ],
      quickAction: { label: 'Revisar Empleados', tab: 'employees' },
    },
    {
      id: 'H',
      name: 'H - HACER',
      subtitle: 'Ejecución operativa y dispersión',
      color: 'amber',
      borderColor: 'border-amber-500',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-900',
      badgeColor: 'bg-amber-500 text-slate-950',
      desc: 'Registrar novedades con soportes, ejecutar las fórmulas de devengados y deducciones, y emitir comprobantes.',
      tasks: [
        { key: 'h1', label: 'Registrar novedades del período (incapacidades, horas extras, permisos).' },
        { key: 'h2', label: 'Calcular automáticamente devengados, deducciones y neto a pagar.' },
        { key: 'h3', label: 'Liquidar aportes a seguridad social, parafiscales y realizar dispersión bancaria.' },
      ],
      quickAction: { label: 'Ir a Liquidación', tab: 'payroll' },
    },
    {
      id: 'V',
      name: 'V - VERIFICAR',
      subtitle: 'Auditoría, control y cotejo documental',
      color: 'emerald',
      borderColor: 'border-emerald-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-900',
      badgeColor: 'bg-emerald-600 text-white',
      desc: 'Revisar minuciosamente los cálculos, comparar pagos con contratos, verificar aportes y validar informes.',
      tasks: [
        { key: 'v1', label: 'Revisar cálculos de nómina frente a las novedades y turnos efectivamente laborados.' },
        { key: 'v2', label: 'Cotejar deducciones aplicadas para salud y pensión (4% sobre IBC).' },
        { key: 'v3', label: 'Verificar la planilla integrada PILA y soportes documentales de incapacidades.' },
      ],
      quickAction: { label: 'Consultar Informes', tab: 'reports' },
    },
    {
      id: 'A',
      name: 'A - ACTUAR',
      subtitle: 'Mejora continua y actualización de parámetros',
      color: 'indigo',
      borderColor: 'border-indigo-500',
      bgColor: 'bg-indigo-50',
      textColor: 'text-indigo-900',
      badgeColor: 'bg-indigo-600 text-white',
      desc: 'Corregir inconsistencias, retroalimentar políticas internas, actualizar parámetros y reiniciar el ciclo para el nuevo período.',
      tasks: [
        { key: 'a1', label: 'Corregir cualquier inconsistencia detectada antes de archivar contablemente.' },
        { key: 'a2', label: 'Actualizar parámetros legales o salarios mínimos ante reformas legislativas.' },
        { key: 'a3', label: 'Implementar controles preventivos y reiniciar el ciclo para el siguiente período de nómina.' },
      ],
      quickAction: { label: 'Actualizar Parámetros', tab: 'normativity' },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 9: Sistema de Gestión de Calidad
            </span>
            <span className="text-xs font-bold text-slate-500">
              Ciclo PHVA de Nómina
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Flujograma del Proceso de Nómina con el Ciclo PHVA
          </h1>
          <p className="text-xs text-slate-500">
            Metodología de mejora continua: Planear → Hacer → Verificar → Actuar → Reiniciar ciclo para el siguiente período.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Período en control:</span>
          <span className="px-3 py-1 bg-[#0B192C] text-amber-400 font-bold rounded-lg shadow-sm">
            {getPeriodLabel()}
          </span>
        </div>
      </div>

      {/* Interactive Visual Flow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {steps.map((step, idx) => {
          const isSelected = activeStep === step.id;
          return (
            <div
              key={step.id}
              onClick={() => setActiveStep(step.id as any)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? `${step.borderColor} ${step.bgColor} shadow-lg scale-[1.02]`
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold ${step.badgeColor}`}>
                    {step.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Paso 0{idx + 1}</span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm">{step.subtitle}</h3>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{step.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-500">
                  {step.tasks.filter((t) => (checklist as any)[t.key]).length} / {step.tasks.length} Tareas
                </span>
                <span className={`font-bold ${isSelected ? 'text-slate-900' : 'text-blue-600'}`}>
                  Ver tareas →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Flow arrow banner */}
      <div className="p-3 bg-gradient-to-r from-blue-900 via-amber-800 to-indigo-900 text-white rounded-xl text-center text-xs font-bold tracking-wide flex items-center justify-center gap-2 shadow">
        <span>P - PLANEAR</span>
        <ArrowRight className="w-4 h-4 text-amber-400" />
        <span>H - HACER</span>
        <ArrowRight className="w-4 h-4 text-amber-400" />
        <span>V - VERIFICAR</span>
        <ArrowRight className="w-4 h-4 text-amber-400" />
        <span>A - ACTUAR</span>
        <ArrowRight className="w-4 h-4 text-amber-400" />
        <span className="text-amber-300">Reiniciar Ciclo Nuevo Período</span>
      </div>

      {/* Selected Step Detail & Interactive Checklist */}
      {(() => {
        const current = steps.find((s) => s.id === activeStep) || steps[0];
        return (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className={`px-2.5 py-1 rounded text-xs font-bold ${current.badgeColor}`}>
                  Detalle Operativo: {current.name}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 mt-2">
                  {current.subtitle}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{current.desc}</p>
              </div>

              <button
                onClick={() => setActiveTab(current.quickAction.tab)}
                className="px-4 py-2 bg-[#0B192C] hover:bg-slate-800 text-amber-400 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shadow self-start sm:self-auto cursor-pointer"
              >
                <ClipboardCheck className="w-4 h-4" />
                {current.quickAction.label}
              </button>
            </div>

            {/* Checklist items */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Lista de Chequeo y Auditoría del Período
              </h4>
              <div className="space-y-2">
                {current.tasks.map((task) => {
                  const isChecked = (checklist as any)[task.key];
                  return (
                    <div
                      key={task.key}
                      onClick={() => toggleCheck(task.key as any)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between text-xs ${
                        isChecked
                          ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                          : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isChecked ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                        )}
                        <span>{task.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        isChecked ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {isChecked ? 'Cumplido' : 'Pendiente'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
