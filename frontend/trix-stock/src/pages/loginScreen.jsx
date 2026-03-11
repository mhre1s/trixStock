import React from 'react'
import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';

const LoginSreen = () => {

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setUserMsg] = useState('')
  const navigate = useNavigate();
  const handleSubmit = () => {
    if(username === "matheus.henrique" && password === "12345678"){
      navigate("/itemregister");
    }
    else{
      setUserMsg('Usuário ou senha inválidos')
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-104 h-104 border border-gray-400 rounded-lg">
        <h1 className=" text-lg text-center mt-4">Login</h1>
        <div className="mt-12 flex flex-col gap-4">
          <div className=" flex-col gap-2 flex items-center">
            <label htmlFor="user">Usuário:</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              id="user"
              className="w-2/3 h-8 rounded-md border border-gray-400 outline-0 p-1"
              type="text"
            />
          </div>
          <div className="flex-col mt-4 flex gap-2 items-center">
            <label htmlFor="password">Senha:</label>
            <input
              value={password}
              onChange={e => setPassword(e.target.value)}
              id="password"
              className=" w-2/3 h-8 rounded-md border border-gray-400 outline-0 p-1"
              type="password"
            />
          </div>
          <div className="flex flex-col items-center">
            <button onClick={handleSubmit} className="bg-green-400 w-2/3 p-2 mt-8 rounded-md border-emerald-700 border 
            hover:bg-green-300 hover:cursor-pointer transition duration-500 ease-in-out ">
              Entrar
            </button>
            <p className={`${errorMsg === 'Usuário ou senha inválidos'? `block` : `hidden`} text-red-500`}>Usuário ou senha inválidos</p>
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