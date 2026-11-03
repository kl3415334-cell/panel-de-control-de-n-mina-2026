import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { JobDescription } from '../../types/payroll';
import { jsPDF } from 'jspdf';
import { 
  BookOpen, 
  Download, 
  Printer, 
  Edit3, 
  Save, 
  CheckCircle, 
  Users, 
  Award, 
  FileText, 
  Plus, 
  Trash2,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export const FunctionsManualView: React.FC = () => {
  const { jobDescriptions, updateJobDescription, companyInfo, currentUser } = usePayroll();

  const [selectedJobId, setSelectedJobId] = useState<string>(jobDescriptions[0]?.id || 'job-1');
  const [isEditing, setIsEditing] = useState(false);
  const [editedJob, setEditedJob] = useState<JobDescription | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const currentJob = jobDescriptions.find((j) => j.id === selectedJobId) || jobDescriptions[0];

  const handleStartEdit = () => {
    setEditedJob(JSON.parse(JSON.stringify(currentJob)));
    setIsEditing(true);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedJob) {
      updateJobDescription(editedJob);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const handleExportPDF = (job: JobDescription) => {
    const doc = new jsPDF();

    // Brand header
    doc.setFillColor(11, 25, 44);
    doc.rect(0, 0, 210, 26, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(13);
    doc.setFont('helvetica', 'bold');
    doc.text(companyInfo.name.toUpperCase(), 14, 11);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`NIT: ${companyInfo.nit}  |  MANUAL OFICIAL DE FUNCIONES Y RESPONSABILIDADES`, 14, 17);
    doc.text(`Perfil del Cargo: ${job.position.toUpperCase()}`, 14, 22);

    let y = 35;
    doc.setTextColor(11, 25, 44);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(`FICHA TÉCNICA: ${job.position.toUpperCase()}`, 14, y);

    y += 7;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Departamento: ${job.department}  |  Supervisa a: ${job.reportsTo}`, 14, y);

    y += 10;
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(14, y, 182, 22, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('PROPÓSITO PRINCIPAL DEL CARGO:', 18, y + 6);
    doc.setFont('helvetica', 'normal');
    const purposeLines = doc.splitTextToSize(job.purpose, 174);
    doc.text(purposeLines, 18, y + 12);

    y += 30;
    doc.setFont('helvetica', 'bold');
    doc.text('REQUISITOS DEL PERFIL:', 14, y);
    doc.setFont('helvetica', 'normal');
    doc.text(`• Nivel Educativo: ${job.educationRequirements}`, 18, y + 6);
    doc.text(`• Experiencia Laboral: ${job.experienceRequirements}`, 18, y + 12);

    y += 22;
    doc.setFont('helvetica', 'bold');
    doc.text('RESPONSABILIDADES PRINCIPALES:', 14, y);
    doc.setFont('helvetica', 'normal');
    job.responsibilities.forEach((r, idx) => {
      doc.text(`• ${r}`, 18, y + 6 + idx * 6);
    });

    y += 10 + job.responsibilities.length * 6;
    doc.setFont('helvetica', 'bold');
    doc.text('FUNCIONES ESPECÍFICAS OPERATIVAS:', 14, y);
    doc.setFont('helvetica', 'normal');
    job.specificFunctions.forEach((f, idx) => {
      doc.text(`• ${f}`, 18, y + 6 + idx * 6);
    });

    y += 20 + job.specificFunctions.length * 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text('Documento institucional aprobado por la Junta Directiva de la Corporación Social Somos Uno.', 14, y);

    doc.save(`Manual_Funciones_${job.position.replace(/\s+/g, '_')}_SomosUno.pdf`);
  };

  const canEditManual = currentUser.role === 'GERENTE' || currentUser.role === 'ADMINISTRACION';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 13: Manual de Funciones
            </span>
            <span className="text-xs font-bold text-slate-500">
              4 Cargos Estructurados
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Manual de Funciones, Competencias y Responsabilidades
          </h1>
          <p className="text-xs text-slate-500">
            Descripción de actividades, requisitos y responsabilidades por cargo en la Corporación Social Somos Uno.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveSuccess && (
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" /> Guardado
            </span>
          )}
          <button
            onClick={() => handleExportPDF(currentJob)}
            className="px-4 py-2 bg-[#0B192C] hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-lg shadow transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Descargar Ficha en PDF
          </button>
        </div>
      </div>

      {/* Main Grid: Selector tabs & detailed card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Role Selector Tabs */}
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-2 pb-2 border-b border-slate-100">
            Cargos de la Organización
          </h2>
          <div className="space-y-1">
            {jobDescriptions.map((job) => {
              const isSelected = job.id === selectedJobId;
              return (
                <button
                  key={job.id}
                  onClick={() => {
                    setSelectedJobId(job.id);
                    setIsEditing(false);
                  }}
                  className={`w-full text-left p-3.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-amber-500/15 border-2 border-amber-500 text-amber-950 font-bold shadow-sm'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div>
                    <p className="font-extrabold text-sm text-slate-900">{job.position}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{job.department}</p>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Detailed Job Manual */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          {/* Header of the profile */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-700 tracking-wider">
                Perfil Oficial del Cargo
              </span>
              <h2 className="text-xl font-extrabold text-slate-900">{currentJob.position}</h2>
              <p className="text-xs text-slate-500">{currentJob.department} &bull; Reporta a: {currentJob.reportsTo}</p>
            </div>

            {canEditManual && !isEditing && (
              <button
                onClick={handleStartEdit}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5 text-blue-600" /> Editar Funciones
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-5 text-xs text-slate-700">
              {/* Purpose */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-500 block">Objetivo y Propósito del Cargo</span>
                <p className="leading-relaxed text-slate-800 text-xs">{currentJob.purpose}</p>
              </div>

              {/* Requirements & Competencies */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Requisitos del Perfil</span>
                  <p><strong>Educación:</strong> {currentJob.educationRequirements}</p>
                  <p><strong>Experiencia:</strong> {currentJob.experienceRequirements}</p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-slate-500 block">Competencias Clave</span>
                  <ul className="space-y-1">
                    {currentJob.competencies.map((comp, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        {comp}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Responsibilities */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Responsabilidades Principales
                </h3>
                <div className="space-y-1.5">
                  {currentJob.responsibilities.map((resp, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-start gap-2.5 text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{resp}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specific Functions */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-500">
                  Funciones Operativas Específicas
                </h3>
                <div className="space-y-1.5">
                  {currentJob.specificFunctions.map((fn, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 flex items-start gap-2.5 text-slate-800">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        F{idx + 1}
                      </span>
                      <p className="leading-relaxed">{fn}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Editing form */
            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Propósito del Cargo</label>
                <textarea
                  rows={3}
                  value={editedJob?.purpose || ''}
                  onChange={(e) => editedJob && setEditedJob({ ...editedJob, purpose: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requisitos de Educación</label>
                  <input
                    type="text"
                    value={editedJob?.educationRequirements || ''}
                    onChange={(e) => editedJob && setEditedJob({ ...editedJob, educationRequirements: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Requisitos de Experiencia</label>
                  <input
                    type="text"
                    value={editedJob?.experienceRequirements || ''}
                    onChange={(e) => editedJob && setEditedJob({ ...editedJob, experienceRequirements: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Responsabilidades Principales (una por línea)
                </label>
                <textarea
                  rows={4}
                  value={editedJob?.responsibilities.join('\n') || ''}
                  onChange={(e) => editedJob && setEditedJob({ ...editedJob, responsibilities: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Funciones Operativas (una por línea)
                </label>
                <textarea
                  rows={4}
                  value={editedJob?.specificFunctions.join('\n') || ''}
                  onChange={(e) => editedJob && setEditedJob({ ...editedJob, specificFunctions: e.target.value.split('\n').filter(Boolean) })}
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-semibold hover:bg-slate-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow"
                >
                  Guardar Funciones Actualizadas
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
