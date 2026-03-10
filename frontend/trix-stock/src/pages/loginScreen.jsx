import React from 'react'
import { Link } from 'react-router';
const LoginSreen = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-96 h-96 border border-gray-400 rounded-lg">
        <h1 className=" text-lg text-center">Login</h1>
        <div className="mt-12 flex flex-col gap-4">
          <div className=" flex-col flex items-center">
            <label htmlFor="user">Usuário:</label>
            <input
              id="user"
              className="w-2/3 h-8 rounded-md border border-gray-400"
              type="text"
            />
          </div>
          <div className="flex-col mt-4 flex gap-2 items-center">
            <label htmlFor="password">Senha:</label>
            <input
              id="password"
              className=" w-2/3 h-8 rounded-md border border-gray-400"
              type="text"
            />
          </div>
          <div className="flex justify-center">
            <button className="bg-green-400 w-2/3 p-2 mt-8 rounded-md border-emerald-700 border hover:bg-green-300 hover:cursor-pointer transition duration-500 ease-in-out ">
              Entrar
            </button>
          </div>
          <div className='flex justify-center gap-2'>
            <p>Ir para aba de</p>
            <Link className=' text-blue-500' to="/register">
              registrar usuário
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSreen