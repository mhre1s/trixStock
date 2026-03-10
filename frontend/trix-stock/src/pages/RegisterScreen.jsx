import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router';
import { useMutation} from '@tanstack/react-query'
import { registerUser } from '../apis/userApi';

const RegisterScreen = () => {

  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState('operacional')

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: ()=>{
      alert(`Usuário ${username} criado com sucesso!`)
      setName("");
      setUsername("");
      setPassword("");
      setLevel("operacional");
    },
    onError: (error) => {
      alert('Erro ao registrar usuário '
         + (error.response?.data?.error || "servidor offline"))
    }
  })

  const handleSubmit = () =>{
    const userData = {
      name, 
      username, 
      password, 
      level}
      mutation.mutate(userData)
  }

  return (
    <div>
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-96 h-125 border border-gray-400 rounded-lg">
          <h1 className=" text-lg text-center">Registrar usuário</h1>
          <div className="mt-12 flex flex-col">
            {/*input de nome*/}
            <div className=" flex-col flex items-center gap-2">
              <label htmlFor="name">Nome completo:</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                id="name"
                className="w-2/3 h-8 rounded-md border border-gray-400"
                type="text"
              />
            </div>
            {/*input de usuario*/}
            <div className=" flex-col flex items-center gap-2 mt-4">
              <label htmlFor="user">Usuário:</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                id="user"
                className="w-2/3 h-8 rounded-md border border-gray-400"
                type="text"
              />
            </div>
            {/*input de senha */}
            <div className="flex-col mt-4 flex gap-2 items-center">
              <label htmlFor="password">Senha:</label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                id="password"
                className=" w-2/3 h-8 rounded-md border border-gray-400"
                type="password"
              />
            </div>
            {/* menu dropdown */}
            <div className="flex-col mt-4 flex gap-2 items-center">
              <label htmlFor="level">Nível hierárquico:</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="hover:cursor-pointer"
                name="level"
                id="level"
              >
                <option value="operacional">Operacional</option>
                <option value="almoxarifado">Almoxarifado</option>
                <option value="gestão">Gestão</option>
              </select>
            </div>
            {/*botao para enviar as informacoes*/}
            <div className="flex justify-center">
              <button
                onClick={handleSubmit}
                className={`w-2/3 p-2 mt-8 
                rounded-md  border 
              ${mutation.isPending ? "bg-gray-400" : "bg-green-400 border-emerald-700 hover:bg-green-300 hover:cursor-pointer transition duration-500 ease-in-out"}`}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Registrando..." :" Registrar"}
              </button>
            </div>
            <div className="flex justify-center gap-2 mt-3">
              <p>Ir para aba de</p>
              <Link className=" text-blue-500" to="/">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterScreen