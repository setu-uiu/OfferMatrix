import React from 'react';
import { useApp } from './context/AppContext';
import { AuthGate } from './components/auth/AuthGate';
import { Navbar } from './components/common/Navbar';
import { CustomerPortal } from './components/customer/CustomerPortal';
import { DriverPortal } from './components/driver/DriverPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { ToastContainer } from './components/common/Toast';

export const App = () => {
  const { currentScreen } = useApp();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900 transition-colors duration-200 dark:bg-neutral-950 dark:text-neutral-100">
      {currentScreen === 'auth' ? (
        <AuthGate />
      ) : (
        <>
          <Navbar />
          <main className="flex flex-1 flex-col">
            {currentScreen === 'customer' && <CustomerPortal />}
            {currentScreen === 'driver' && <DriverPortal />}
            {currentScreen === 'admin' && <AdminPortal />}
          </main>
        </>
      )}
      <ToastContainer />
    </div>
  );
};
