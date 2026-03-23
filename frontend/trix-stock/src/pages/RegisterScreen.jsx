import React, { useState } from "react";
import { Link, useNavigate } from "react-router"; // Se estiver usando v6 é 'react-router-dom'
import { useMutation } from "@tanstack/react-query";
import { registerUser } from "../apis/userApi";

const RegisterScreen = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [level, setLevel] = useState("operacional");

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      alert(`Usuário ${username} criado com sucesso!`);
      // Limpa os campos
      setName("");
      setUsername("");
      setPassword("");
      setLevel("operacional");
      // Redireciona para o login
      navigate("/");
    },
    onError: (error) => {
      alert(
        "Erro ao registrar usuário: " +
          (error.response?.data?.error || "Servidor offline ou erro de rede"),
      );
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Envia os dados para a mutation
    const userData = { name, username, password, level };
    mutation.mutate(userData);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-4">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Registrar Usuário
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Campo Nome */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-medium text-gray-700 ml-1"
            >
              Nome completo
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              placeholder="Ex: João Silva"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              type="text"
              required
            />
          </div>

          {/* Campo Usuário */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="user"
              className="text-sm font-medium text-gray-700 ml-1"
            >
              Usuário
            </label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              id="user"
              placeholder="nome.sobrenome"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              type="text"
              required
            />
          </div>

          {/* Campo Senha */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 ml-1"
            >
              Senha
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              type="password"
              required
            />
          </div>

          {/* Campo Nível */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="level"
              className="text-sm font-medium text-gray-700 ml-1"
            >
              Nível hierárquico
            </label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              id="level"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 cursor-pointer shadow-sm"
            >
              <option value="operacional">Operacional</option>
              <option value="almoxarifado">Almoxarifado</option>
              <option value="gestão">Gestão</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className={`w-full py-3 mt-4 font-semibold rounded-lg shadow-md transition-all 
              ${
                mutation.isPending
                  ? "bg-gray-400 cursor-not-allowed text-gray-200"
                  : "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] cursor-pointer"
              }`}
          >
            {mutation.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Registrando...
              </span>
            ) : (
              "Registrar"
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          <p>
            Já possui uma conta?{" "}
            <Link className="text-emerald-600 font-bold hover:underline" to="/">
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterScreen;
