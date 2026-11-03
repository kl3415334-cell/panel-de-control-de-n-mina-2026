import React, { useState } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronRight, 
  UserCheck, 
  UserPlus, 
  Edit3, 
  FileSpreadsheet, 
  Calculator, 
  Coins, 
  ShieldCheck, 
  FileText, 
  Download, 
  Laptop, 
  CheckCircle,
  Search,
  BookOpen
} from 'lucide-react';

export const UserManualView: React.FC = () => {
  const [search, setSearch] = useState('');
  const [expandedSection, setExpandedSection] = useState<number | null>(1);

  const sections = [
    {
      id: 1,
      title: '1. Cómo ingresar a la plataforma y roles de acceso',
      icon: UserCheck,
      color: 'text-blue-600',
      content: (
        <div className="space-y-3">
          <p>
            Para acceder al sistema de nómina de la <strong>Corporación Social Somos Uno</strong>:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-2">
            <li>Ubique el selector de perfil en la esquina superior derecha del encabezado (o ingrese al módulo <em>Usuarios y Permisos</em>).</li>
            <li>Seleccione el perfil deseado según sus funciones:
              <ul className="list-disc list-inside ml-4 mt-1 text-[11px] text-slate-600 space-y-1">
                <li><strong>Auxiliar contable:</strong> Encargado de registrar novedades, alimentar colaboradores y generar pre-liquidaciones.</li>
                <li><strong>Administración:</strong> Verifica contratos, revisa soportes de novedades y aprueba la nómina administrativa.</li>
                <li><strong>Gerente:</strong> Máxima autoridad; autoriza el desembolso y consulta informes financieros consolidados.</li>
                <li><strong>Gestor de proyectos:</strong> Consulta exclusivamente costos de talento humano por proyecto social.</li>
              </ul>
            </li>
            <li>El sistema adaptará dinámicamente los botones y permisos en pantalla según el rol seleccionado.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 2,
      title: '2. Cómo registrar un nuevo empleado',
      icon: UserPlus,
      color: 'text-emerald-600',
      content: (
        <div className="space-y-3">
          <p>Para vincular un colaborador laboral a la nómina institucional:</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-2">
            <li>Diríjase al módulo <strong>Empleados</strong> en el menú lateral.</li>
            <li>Haga clic en el botón superior derecho <strong>"Registrar Nuevo Empleado"</strong>.</li>
            <li>Diligencie el formulario organizado en tres fases:
              <ul className="list-disc list-inside ml-4 mt-1 text-[11px] text-slate-600 space-y-1">
                <li><strong>Datos Personales y Laborales:</strong> Nombre completo, documento de identidad, cargo, tipo de contrato, fecha de inicio y salario básico pactado.</li>
                <li><strong>Seguridad Social:</strong> Afiliación obligatoria a EPS, Fondo de Pensiones, ARL (especificando Clase de Riesgo I a V) y Caja de Compensación.</li>
                <li><strong>Datos de Contacto:</strong> Teléfono móvil, correo electrónico institucional y dirección de residencia.</li>
              </ul>
            </li>
            <li>Verifique si aplica el <em>Auxilio Legal de Transporte</em> (se marca automáticamente si el salario no supera 2 SMLMV de referencia 2026).</li>
            <li>Haga clic en <strong>"Registrar Empleado"</strong>. El colaborador quedará disponible para liquidación inmediata.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 3,
      title: '3. Cómo modificar información laboral de colaboradores',
      icon: Edit3,
      color: 'text-amber-600',
      content: (
        <div className="space-y-3">
          <p>Para actualizar un salario, cargo, proyecto o información de seguridad social:</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-2">
            <li>En la tabla del módulo <strong>Empleados</strong>, localice al trabajador mediante la barra de búsqueda rápida.</li>
            <li>Haga clic en el icono de <strong>lápiz (Editar)</strong> ubicado en la columna de acciones.</li>
            <li>Modifique los campos correspondientes. Si el salario se eleva por encima de los 2 SMLMV ($3.501.810 en 2026), el sistema deshabilitará automáticamente el auxilio de transporte según la ley.</li>
            <li>Haga clic en <strong>"Guardar Cambios"</strong>. La acción se registrará en la bitácora de auditoría.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 4,
      title: '4. Cómo registrar y soportar novedades',
      icon: FileSpreadsheet,
      color: 'text-blue-600',
      content: (
        <div className="space-y-3">
          <p>El módulo de novedades permite reflejar eventos que alteran los devengados o deducciones:</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-2">
            <li>Ingrese a <strong>Novedades Laborales</strong> y presione <strong>"Registrar Novedad"</strong>.</li>
            <li>Seleccione al colaborador afectado y el concepto legal:
              <ul className="list-disc list-inside ml-4 mt-1 text-[11px] text-slate-600 space-y-1">
                <li><strong>Incapacidad General:</strong> Primeros 2 días pagados al 66.67% por la corporación.</li>
                <li><strong>Horas Extras Diurnas (25%), Nocturnas (75%), Festivas (100% o 150%):</strong> El sistema calcula el valor hora sobre la jornada vigente de 42 horas semanales.</li>
                <li><strong>Permisos No Remunerados:</strong> Descuenta proporcionalmente los días de salario no laborados.</li>
              </ul>
            </li>
            <li>Ingrese la cantidad (días u horas). El sistema calcula el valor económico automáticamente en tiempo real.</li>
            <li>Adjunte o mencione el nombre del archivo de soporte (ej. <em>Incapacidad_EPS_001.pdf</em>).</li>
            <li>Haga clic en <strong>"Guardar Novedad"</strong> para que impacte la pre-liquidación.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 5,
      title: '5. Cómo liquidar la nómina periódica',
      icon: Calculator,
      color: 'text-purple-600',
      content: (
        <div className="space-y-3">
          <p>Para procesar el pago decenal, quincenal o mensual:</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-2">
            <li>Abra el módulo <strong>Liquidación Nómina</strong>.</li>
            <li>Elija la periodicidad en la pestaña superior:
              <ul className="list-disc list-inside ml-4 mt-1 text-[11px] text-slate-600 space-y-1">
                <li><strong>Cada 10 días (Propuesta Corporativa):</strong> Decena 1 (días 1 al 10), Decena 2 (días 11 al 20) o Decena 3 (días 21 al 30).</li>
                <li><strong>Quincenal:</strong> Primera quincena (1-15) o Segunda quincena (16-30).</li>
                <li><strong>Mensual:</strong> Mes completo (30 días).</li>
              </ul>
            </li>
            <li>Verifique en la tabla los devengados, auxilio proporcional, deducciones de salud (4%) y pensión (4%).</li>
            <li>Siga el flujo de calidad PHVA:
              <ul className="list-disc list-inside ml-4 mt-1 text-[11px] text-slate-600 space-y-1">
                <li>El <strong>Auxiliar Contable</strong> prepara el borrador.</li>
                <li><strong>Administración</strong> verifica y da visto bueno.</li>
                <li>El <strong>Gerente</strong> presiona <em>"Aprobar Nómina"</em> y posteriormente <em>"Ejecutar Desembolso de Pagos"</em>.</li>
              </ul>
            </li>
          </ol>
        </div>
      ),
    },
    {
      id: 6,
      title: '6. Cómo calcular y consultar prestaciones sociales',
      icon: Coins,
      color: 'text-amber-600',
      content: (
        <div className="space-y-3">
          <p>En el módulo <strong>Prestaciones Sociales</strong>:</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-2">
            <li>Consulte la pestaña <strong>"Provisiones Mensuales"</strong> para ver la causación mensual exacta:
              <ul className="list-disc list-inside ml-4 mt-1 text-[11px] text-slate-600 space-y-1">
                <li>Cesantías (8.333%): Base con auxilio de transporte × días / 360.</li>
                <li>Intereses a las Cesantías (1% mensual / 12% anual): Cesantías × días × 12% / 360.</li>
                <li>Prima de Servicios (8.333%): Base con auxilio de transporte × días / 360.</li>
                <li>Vacaciones (4.167%): Salario básico (sin auxilio) × días / 720.</li>
              </ul>
            </li>
            <li>Use la pestaña <strong>"Simulador Liquidación"</strong> para proyectar la liquidación contractual de cualquier trabajador por un número específico de días trabajados.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 7,
      title: '7. Cómo consultar seguridad social y aportes parafiscales',
      icon: ShieldCheck,
      color: 'text-emerald-600',
      content: (
        <div className="space-y-3">
          <p>En el módulo <strong>Seguridad Social & Parafiscales</strong>:</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-2">
            <li>Observe la planilla consolidada tipo PILA con aportes del empleador (Salud 8.5%, Pensión 12%, ARL según riesgo) y parafiscales (Caja 4%, SENA 2%, ICBF 3%).</li>
            <li>Puede activar o desactivar el interruptor de <em>Exoneración Art. 114-1 del Estatuto Tributario</em> para verificar el impacto tributario de contar o no con la calificación especial.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 8,
      title: '8. Cómo generar informes y descargar comprobantes de pago',
      icon: FileText,
      color: 'text-blue-600',
      content: (
        <div className="space-y-3">
          <p>Para emitir reportes contables o volantes individuales:</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-2">
            <li>Ingrese a <strong>Informes y Certificados</strong>.</li>
            <li>Seleccione uno de los 10 tipos de informe disponibles (Nómina General, Comprobantes, Deducciones, Novedades, Costos por Proyecto, etc.).</li>
            <li>Para descargar en hoja de cálculo, presione el botón verde <strong>"Exportar Excel (.xlsx)"</strong>. Se generará un archivo formateado con múltiples hojas.</li>
            <li>Para comprobantes individuales, haga clic en el botón <strong>"PDF"</strong> al lado de cada colaborador. Se descargará el volante oficial con espacio para firmas de Gerencia y del trabajador.</li>
          </ol>
        </div>
      ),
    },
    {
      id: 9,
      title: '9. Cómo instalar, actualizar y gestionar copias de seguridad',
      icon: Laptop,
      color: 'text-indigo-600',
      content: (
        <div className="space-y-3">
          <p>En el módulo <strong>Instalación y Sistema</strong>:</p>
          <ol className="list-decimal list-inside space-y-2 text-slate-700 ml-2">
            <li><strong>Instalar Aplicación:</strong> Presione <em>"Instalar en este Dispositivo"</em> para crear el acceso de escritorio corporativo.</li>
            <li><strong>Descargar Copia de Seguridad:</strong> Presione <em>"Descargar Copia de Seguridad (JSON)"</em> para obtener un respaldo completo de la base de datos.</li>
            <li><strong>Restaurar Sistema:</strong> Seleccione un archivo JSON previamente descargado para recuperar información tras un cambio de equipo.</li>
            <li><strong>Desinstalar con Seguridad:</strong> Si requiere reiniciar los datos, utilice el botón de desinstalación previa verificación y confirmación del administrador.</li>
          </ol>
        </div>
      ),
    },
  ];

  const filteredSections = sections.filter((s) =>
    s.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-900 border border-amber-500/30">
              Módulo 15: Documentación y Guía
            </span>
            <span className="text-xs font-bold text-slate-500">
              Manual Interactivo
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mt-1">
            Manual de Usuario de la Plataforma Somos Uno
          </h1>
          <p className="text-xs text-slate-500">
            Guía explicativa paso a paso para el uso operativo, legal, administrativo y de seguridad del sistema de nómina.
          </p>
        </div>

        {/* Search inside manual */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar tema o procedimiento..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredSections.map((sec) => {
          const isExpanded = expandedSection === sec.id;
          const Icon = sec.icon;

          return (
            <div
              key={sec.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedSection(isExpanded ? null : sec.id)}
                className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center ${sec.color} shrink-0`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{sec.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    {isExpanded ? 'Ocultar' : 'Ver detalle'}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 pt-2 border-t border-slate-100 text-xs leading-relaxed text-slate-600 animate-in fade-in duration-200">
                  {sec.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
