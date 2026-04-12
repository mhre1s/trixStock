import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

import './index.css'
import LoginScreen from './pages/loginScreen';
import AuthLayout from './layouts/AuthLayout';
import RegisterScreen from './pages/RegisterScreen';
import SystemLayout from './layouts/SystemLayout';
import Warehouse from './pages/WarehouseScreen';
import OperationalScreen from './pages/OperationalScreen';
import PurchasingScreen from './pages/PurchasingScreen';
import ProtectedRoute from './components/ProtectedRoute';


const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />
        </Route>
        <Route element={<SystemLayout/>}>
          <Route path='/itemregister' element={
            <ProtectedRoute allowedRoles={['almoxarifado', 'gestão']}>
              <Warehouse/>
            </ProtectedRoute>
          }/>
          <Route path='/operational' element={
            <ProtectedRoute allowedRoles={['operacional', 'gestão']}>
              <OperationalScreen/>
            </ProtectedRoute>
          }/>
          <Route path='/purchasing' element={
            <ProtectedRoute allowedRoles={['gestão']}>
              <PurchasingScreen/>
            </ProtectedRoute>
          }/>
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>,
);
