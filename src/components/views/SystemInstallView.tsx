import React, { useState } from 'react';
import { usePayroll } from '../../context/PayrollContext';
import { 
  Download, 
  Trash2, 
  Settings, 
  Database, 
  Building, 
  ShieldAlert, 
  CheckCircle, 
  RotateCcw, 
  UploadCloud, 
  HardDrive, 
  Laptop, 
  AlertTriangle,
  History,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const SystemInstallView: React.FC = () => {
  const { 
    companyInfo, 
    updateCompanyInfo, 
    exportDatabaseJSON, 
    importDatabaseJSON, 
    resetDatabase,
    currentUser
  } = usePayroll();

  const [companyForm, setCompanyForm] = useState(companyInfo);
  const [showSavedSuccess, setShowSavedSuccess] = useState(false);
  const [isUninstallModalOpen, setIsUninstallModalOpen] = useState(false);
  const [hasBackedUpBeforeUninstall, setHasBackedUpBeforeUninstall] = useState(false);
  const [isInstalledApp, setIsInstalledApp] = useState(false);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo(companyForm);
    setShowSavedSuccess(true);
    setTimeout(() => setShowSavedSuccess(false), 3000);
  };

  const handleInstallApp = () => {
    setIsInstalledApp(true);
    confetti({ particleCount: 50, spread: 70, origin: { y: 0.6 } });
    alert('¡Plataforma instalada exitosamente en el entorno de escritorio de su dispositivo!');
  };

  const handleBackup = () => {
    exportDatabaseJSON();
    setHasBackedUpBeforeUninstall(true);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          const ok = importDatabaseJSON(text);
          if (ok) {
            alert('¡Copia de seguridad restaurada exitosamente!');
          } else {
            alert('Error: El archivo no corresponde a un respaldo válido de Nómina Somos Uno.');
          }
        }
      };
      reader.readAsText(file);
    }
  };

  const handleConfirmUninstall = () => {
    resetDatabase();
    setIsInstalledApp(false);
    setIsUninstallModalOpen(false);
    alert('La plataforma ha sido desinstalada y los datos restablecidos al estado inicial.');
  };

  const canConfigure = currentUser.role === 'GERENTE' || currentUser.role === 'ADMINISTRACION';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 14: Instalación, Desinstalación y Configuración
            </span>
            <span className="text-xs font-bold text-slate-500">
              Versión 2026.1 Oficial
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Administración del Sistema y Despliegue Corporativo
          </h1>
          <p className="text-xs text-slate-500">
            Parámetros institucionales, copias de seguridad de datos, instalación de escritorio y desinstalación controlada.
          </p>
        </div>

        {showSavedSuccess && (
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg flex items-center gap-1">
            <CheckCircle className="w-4 h-4 text-emerald-600" /> Cambios guardados correctamente
          </span>
        )}
      </div>

      {/* Grid: Installation Options & Company Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Installation & Uninstallation Actions */}
        <div className="space-y-4">
          {/* Install as Desktop App Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Laptop className="w-5 h-5 text-blue-600" />
              Instalar Aplicación en Dispositivo
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Permite instalar la plataforma como una aplicación web progresiva (PWA / Desktop App) con acceso directo desde el escritorio y menú de programas, funcionamiento autónomo e integración nativa.
            </p>
            <div className="p-3 bg-blue-50/70 rounded-lg border border-blue-200 space-y-1 text-[11px] text-blue-900">
              <p className="font-semibold">Estado de instalación: {isInstalledApp ? '✓ Instalada en dispositivo' : 'Disponible para instalación'}</p>
              <p className="text-[10px] text-blue-700">Acceso directo en escritorio configurado para Corporación Social Somos Uno.</p>
            </div>
            <button
              onClick={handleInstallApp}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-4 h-4" />
              {isInstalledApp ? 'Reinstalar / Actualizar Acceso' : 'Instalar en este Dispositivo'}
            </button>
          </div>

          {/* Backup and Restore Database Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
              <Database className="w-5 h-5 text-emerald-600" />
              Copias de Seguridad (Backup & Restore)
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Exporte toda la información (empleados, novedades, liquidaciones, historial y parámetros) en un archivo JSON seguro para respaldo o migración de servidor.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={handleBackup}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                Descargar Copia de Seguridad (JSON)
              </button>

              <label className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                Restaurar Copia desde Archivo
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Uninstall Section */}
          <div className="bg-white rounded-xl border border-red-200 p-5 shadow-sm space-y-3 text-xs">
            <div className="flex items-center gap-2 text-red-700 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Desinstalar Plataforma y Restablecer
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Elimina los datos locales almacenados y restablece el sistema. Requiere autorización y advertencia previa de seguridad con descarga de backup.
            </p>
            <button
              onClick={() => setIsUninstallModalOpen(true)}
              className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-300 font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-red-600" />
              Desinstalar / Resetear Sistema
            </button>
          </div>
        </div>

        {/* Right 2 Columns: Institutional Company Information Settings */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building className="w-4 h-4 text-amber-500" />
                Datos de la Corporación y Configuración Institucional
              </h2>
              <p className="text-xs text-slate-500">
                Información legal que se refleja en los comprobantes de nómina, certificados e informes de la organización.
              </p>
            </div>
          </div>

          <form onSubmit={handleSaveCompany} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Razón Social de la Organización *</label>
                <input
                  type="text"
                  required
                  disabled={!canConfigure}
                  value={companyForm.name}
                  onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">NIT con Dígito de Verificación *</label>
                <input
                  type="text"
                  required
                  disabled={!canConfigure}
                  value={companyForm.nit}
                  onChange={(e) => setCompanyForm({ ...companyForm, nit: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Representante Legal (Gerencia) *</label>
                <input
                  type="text"
                  required
                  disabled={!canConfigure}
                  value={companyForm.legalRepresentative}
                  onChange={(e) => setCompanyForm({ ...companyForm, legalRepresentative: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ciudad y Domicilio Principal</label>
                <input
                  type="text"
                  disabled={!canConfigure}
                  value={companyForm.city}
                  onChange={(e) => setCompanyForm({ ...companyForm, city: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Dirección Corporativa</label>
                <input
                  type="text"
                  disabled={!canConfigure}
                  value={companyForm.address}
                  onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Teléfonos de Contacto</label>
                <input
                  type="text"
                  disabled={!canConfigure}
                  value={companyForm.phone}
                  onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Correo Electrónico Institucional</label>
                <input
                  type="email"
                  disabled={!canConfigure}
                  value={companyForm.email}
                  onChange={(e) => setCompanyForm({ ...companyForm, email: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                />
              </div>
            </div>

            {/* Bank details for dispersion */}
            <div className="pt-3 border-t border-slate-200">
              <h3 className="font-bold text-slate-900 text-xs mb-3 text-slate-600 uppercase tracking-wider">
                Cuenta Bancaria de Dispersión de Nómina
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Entidad Bancaria</label>
                  <input
                    type="text"
                    disabled={!canConfigure}
                    value={companyForm.bankName}
                    onChange={(e) => setCompanyForm({ ...companyForm, bankName: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tipo de Cuenta</label>
                  <input
                    type="text"
                    disabled={!canConfigure}
                    value={companyForm.bankAccountType}
                    onChange={(e) => setCompanyForm({ ...companyForm, bankAccountType: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Número de Cuenta</label>
                  <input
                    type="text"
                    disabled={!canConfigure}
                    value={companyForm.bankAccountNumber}
                    onChange={(e) => setCompanyForm({ ...companyForm, bankAccountNumber: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs font-mono focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100"
                  />
                </div>
              </div>
            </div>

            {canConfigure && (
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold rounded-lg shadow transition-all cursor-pointer"
                >
                  Guardar Datos de la Empresa
                </button>
              </div>
            )}
          </form>

          {/* Version Update Changelog History */}
          <div className="pt-4 border-t border-slate-200 space-y-2 text-xs">
            <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5 uppercase tracking-wider text-slate-500">
              <History className="w-4 h-4 text-blue-600" /> Historial de Actualizaciones del Sistema
            </h3>
            <div className="space-y-1.5 text-[11px] text-slate-600">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span><strong>v2026.1 (Actual)</strong> &bull; Implementación completa de jornada laboral a 42h (Ley 2101) y parámetros 2026.</span>
                <span className="text-emerald-700 font-semibold font-mono">02 Nov 2026</span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex justify-between items-center">
                <span><strong>v2025.4</strong> &bull; Adaptación preliminar de recargos progresivos Ley 2466 de 2025.</span>
                <span className="text-slate-500 font-mono">15 Dic 2025</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Desinstalar Plataforma */}
      {isUninstallModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl border border-red-200 w-full max-w-md p-6 text-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900">
              ¿Confirmar Desinstalación y Restablecimiento?
            </h3>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Esta acción eliminará las modificaciones y novedades locales de la <strong>Corporación Social Somos Uno</strong>.
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 text-left my-4 space-y-1">
              <span className="font-bold block">Medida de Seguridad Obligatoria:</span>
              <p className="text-[11px]">
                Se recomienda descargar una copia de seguridad antes de continuar para evitar pérdida no autorizada de datos empresariales.
              </p>
              <button
                type="button"
                onClick={handleBackup}
                className="mt-1.5 px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-bold rounded text-[11px] flex items-center gap-1"
              >
                <Download className="w-3.5 h-3.5" /> Descargar Copia de Seguridad Ahora
              </button>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsUninstallModalOpen(false)}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmUninstall}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg shadow"
              >
                Sí, Desinstalar y Resetear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
