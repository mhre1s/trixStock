import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { registerItem, getItems } from "../apis/itemApi";
import { getRequests, approveRequest, rejectRequest } from "../apis/requestApi"; // Certifique-se de criar/exportar essas funções na sua API
import CategoryTable from "../components/CategoryTable";

const OperationalScreen = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados do Formulário (Mantidos)
  const [name, setName] = useState("");
  const [patrimony, setPatrimony] = useState("");
  const [category, setCategory] = useState(1);
  const [balance, setBalance] = useState(0);
  const [description, setDescription] = useState("");

  // Queries
  const { data: items } = useQuery({ queryKey: ["items"], queryFn: getItems });

  // BUSCA AS SOLICITAÇÕES
  const { data: requests, isLoading: loadingReqs } = useQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  });

  // MUTATIONS (Ações do Almoxarifado)
  const approveMutation = useMutation({
    mutationFn: approveRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["requests", "items"]);
      alert("Solicitação aprovada e estoque atualizado!");
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(["requests"]);
      alert("Solicitação rejeitada.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerItem,
    onSuccess: () => {
      alert(`Estoque atualizado com sucesso!`);
      queryClient.invalidateQueries(["items"]);
      closeModal();
    },
  });

  // Lógica de sugestões (Mantida)
  const sugestoes =
    name.length > 1
      ? items?.filter((i) => i.name.toUpperCase().includes(name.toUpperCase()))
      : [];
  const itemExistente = items?.find(
    (i) => i.name.toUpperCase() === name.toUpperCase(),
  );

  const selecionarSugestao = (item) => {
    setName(item.name);
    setCategory(item.category_id);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setPatrimony("");
    setBalance(0);
    setDescription("");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate({
      name,
      patrimony: patrimony.trim(),
      category_id: category,
      balance: patrimony ? 1 : balance,
      description,
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Painel Almoxarifado
          </h1>
          <button
            className="hover:bg-blue-700 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all transform hover:scale-105"
            onClick={() => setIsModalOpen(true)}
          >
            + Nova Entrada de Estoque
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUNA DA ESQUERDA: TABELAS DE ESTOQUE */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                📦 Inventário por Categoria
              </h2>
              <CategoryTable />
            </section>
          </div>

          {/* COLUNA DA DIREITA: SOLICITAÇÕES PENDENTES */}
          <div className="lg:col-span-1">
            <section className="bg-white p-5 rounded-2xl shadow-md border-t-4 border-orange-400 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex justify-between items-center">
                🔔 Pedidos Pendentes
                <span className="bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                  {requests?.filter((r) => r.status === "pendente").length || 0}
                </span>
              </h2>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {requests
                  ?.filter((r) => r.status === "pendente")
                  .map((req) => (
                    <div
                      key={req.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          #REQ-{req.id}
                        </span>
                        <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded font-bold">
                          {new Date(req.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h3 className="font-bold text-gray-800 text-lg leading-tight">
                        {req.item?.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Solicitado por:{" "}
                        <span className="font-semibold text-gray-700">
                          {req.user?.name || "Técnico"}
                        </span>
                        <br />
                        Quantidade:{" "}
                        <span className="font-bold text-blue-600">
                          {req.quantity} un.
                        </span>
                      </p>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => rejectMutation.mutate(req.id)}
                          className="px-3 py-2 bg-white border border-red-200 text-red-500 rounded-lg text-sm font-bold hover:bg-red-50 transition-colors"
                        >
                          Recusar
                        </button>
                        <button
                          onClick={() => approveMutation.mutate(req.id)}
                          className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-bold hover:bg-green-600 shadow-sm transition-colors"
                        >
                          Aprovar
                        </button>
                      </div>
                    </div>
                  ))}

                {requests?.filter((r) => r.status === "pendente").length ===
                  0 && (
                  <div className="text-center py-10 text-gray-400 italic">
                    Nenhuma solicitação aguardando.
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* MODAL DE ENTRADA (Mantida com os estilos originais) */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
            {/* ... conteúdo do form que você já tinha ... */}
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-lg font-bold">Gerenciar Estoque</h2>
              <button
                onClick={closeModal}
                className="text-2xl hover:text-gray-200 cursor-pointer"
              >
                &times;
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* (Mesmos campos de Nome, Patrimônio, etc) */}
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-semibold text-gray-700">
                  Nome do Item
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              {/* ... resto do form ... */}
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold"
                >
                  Salvar no Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationalScreen;
