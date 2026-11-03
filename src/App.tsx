import React, { useState } from 'react';
import { PayrollProvider } from './context/PayrollContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/views/DashboardView';
import { EmployeesView } from './components/views/EmployeesView';
import { PayrollSettlementView } from './components/views/PayrollSettlementView';
import { NoveltiesView } from './components/views/NoveltiesView';
import { SocialBenefitsView } from './components/views/SocialBenefitsView';
import { SocialSecurityView } from './components/views/SocialSecurityView';
import { ReportsView } from './components/views/ReportsView';
import { NormativityView } from './components/views/NormativityView';
import { PhvaFlowView } from './components/views/PhvaFlowView';
import { RolesPermissionsView } from './components/views/RolesPermissionsView';
import { Simulation2026View } from './components/views/Simulation2026View';
import { FunctionsManualView } from './components/views/FunctionsManualView';
import { SystemInstallView } from './components/views/SystemInstallView';
import { UserManualView } from './components/views/UserManualView';
import { AuditView } from './components/views/AuditView';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      {/* Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <div className="max-w-7xl mx-auto pb-12">
            {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
            {activeTab === 'employees' && <EmployeesView />}
            {activeTab === 'payroll' && <PayrollSettlementView />}
            {activeTab === 'novelties' && <NoveltiesView />}
            {activeTab === 'benefits' && <SocialBenefitsView />}
            {activeTab === 'security' && <SocialSecurityView />}
            {activeTab === 'simulation' && <Simulation2026View />}
            {activeTab === 'reports' && <ReportsView />}
            {activeTab === 'phva' && <PhvaFlowView setActiveTab={setActiveTab} />}
            {activeTab === 'functions' && <FunctionsManualView />}
            {activeTab === 'normativity' && <NormativityView />}
            {activeTab === 'users' && <RolesPermissionsView />}
            {activeTab === 'system' && <SystemInstallView />}
            {activeTab === 'manual' && <UserManualView />}
            {activeTab === 'audit' && <AuditView />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <PayrollProvider>
      <MainLayout />
    </PayrollProvider>
  );
}
