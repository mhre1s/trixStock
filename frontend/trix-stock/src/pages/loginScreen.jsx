import React, { useState } from "react";
import { Link, useNavigate } from "react-router";

const LoginSreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "matheus.henrique" && password === "12345678") {
      navigate("/itemregister");
    } else {
      setErrorMsg("Usuário ou senha inválidos");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Login
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
              placeholder="Digite seu usuário"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none transition-all
                         focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              type="text"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              d
              className="text-sm font-medium text-gray-700 ml-1"
            >
              Senha
            </label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="password"
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 outline-none transition-all
                         focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
              type="password"
            />
          </div>
          <div className="h-5 text-center">
            {errorMsg && (
              <p className="text-sm text-red-500 font-medium animate-bounce">
                {errorMsg}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="w-full py-3 mt-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md
                       hover:bg-emerald-600 active:scale-[0.98] transition-all cursor-pointer"
          >
            Entrar
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
          <p>
            Ainda não tem conta?{" "}
            <Link
              className="text-emerald-600 font-bold hover:underline"
              to="/register"
            >
              Registrar usuário
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginSreen;
