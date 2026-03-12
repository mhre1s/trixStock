import React from 'react'
import { Link, Outlet } from 'react-router';

const SystemLayout = () => {
  return (
    <div className="min-h-screen min-w-full">
      <div className="h-14 pl-10 flex justify-between items-center border-b border-b-gray-300">
        <div className="flex gap-5">
          <Link to="/operational" className="text-blue-400">
            <p>Tela operacional</p>
          </Link>
          <Link className="text-blue-400" to="/itemregister">
            <p>Tela almoxarifado</p>
          </Link>
          <Link className="text-blue-400" to="/purchasing">
            <p>Tela compras</p>
          </Link>
        </div>
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default SystemLayout