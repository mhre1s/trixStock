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
          <Route path='/itemregister' element={<Warehouse/>}/>
          <Route path='/operational' element={<OperationalScreen/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </QueryClientProvider>,
);
