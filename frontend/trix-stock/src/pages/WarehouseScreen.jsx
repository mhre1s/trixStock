import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { registerItem, getItems } from "../apis/itemApi";
import { createCategory, getCategories } from "../apis/categoryApi";
import { getRequests, approveRequest, rejectRequest } from "../apis/requestApi"; 
import CategoryTable from "../components/CategoryTable";

const WarehouseScreen = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryModal, setCategoryModal] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [historyPage, setHistoryPage] = useState(1);
  const [name, setName] = useState("");
  const [tableSearch, setTableSearch] = useState("");
  const [patrimony, setPatrimony] = useState("");
  const [category, setCategory] = useState(1);
  const [balance, setBalance] = useState(0);
  const [description, setDescription] = useState("");
  const [newCategory, setNewCategory] = useState('')
  const [minimum, setMinimum] = useState(0)

  const { data: items } = useQuery({ queryKey: ["items"], queryFn: getItems });

  const { data: requests, isLoading: loadingReqs } = useQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  });

  const {data: categories} = useQuery({queryKey: ['categories'], queryFn: getCategories})

  const createCat = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(["categories"]);
      closeCatModal();
    },
    onError: (error) => {
      // 3. Melhorar a mensagem de erro pegando o que vem do seu Backend
      const msg = error.response?.data?.error || error.message;
      alert("Erro ao cadastrar categoria: " + msg);
    },
  });
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
    onError: (error) => {
      alert(`ERRO NO CADASTRO: Verifique se a serial/patrimônio já existe ${error}`);
    },
  });

 const formatForSearch = (str) => str.replace(/\s+/g, "").toUpperCase();
 const termoLimpo = formatForSearch(name);
 const sugestoes =
   name.length > 1
     ? [
         ...new Set(
           items
             ?.filter((i) => formatForSearch(i.name).includes(termoLimpo))
             .map((i) => i.name),
         ),
       ]
         .map((nomeUnico) => items.find((i) => i.name === nomeUnico))
         .slice(0, 5)
     : [];
  const itemExistente = items?.find(
    (i) => formatForSearch(i.name) === termoLimpo,
  );

  const selecionarSugestao = (item) => {
    setName(item.name);
    setCategory(item.category_id);
  };

  const closeCatModal = () =>{
    setCategoryModal(false)
    setNewCategory('')
    setMinimum(0)
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setPatrimony("");
    setBalance(0);
    setDescription("");
  };

  const handleCatSubmit = (e) =>{
    e.preventDefault()
    createCat.mutate({
      name: newCategory,
      minimum,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const serials = patrimony
      ? patrimony
          .split(/[;]+/)
          .map((s) => s.trim())
          .filter((s) => s !== "")
      : [];
    const qtyTotal = patrimony ? serials.length : balance;
    if (
      patrimony &&
      qtyTotal !== Number(balance) &&
      !patrimony.includes(serials[0])
    ) {
    }

    registerMutation.mutate({
      name,
      category_id: category,
      description,
      serials: serials,
      balance: qtyTotal,
      patrimony: patrimony.trim(),
    });
  };
  const countSerials = () => {
  if (!patrimony) return balance;
  return patrimony.split(/[;]+/).map(s => s.trim()).filter(s => s !== "").length;
};

  // Histórico de Paginação
  const HISTORY_ITEMS_PER_PAGE = 10;
  const historyRequests = requests ? [...requests] : [];
  historyRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
  const historyTotalItems = historyRequests.length;
  const historyTotalPages = Math.ceil(historyTotalItems / HISTORY_ITEMS_PER_PAGE) || 1;
  const paginatedHistory = historyRequests.slice(
    (historyPage - 1) * HISTORY_ITEMS_PER_PAGE,
    historyPage * HISTORY_ITEMS_PER_PAGE
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
            Painel Almoxarifado
          </h1>
          <div className="flex flex-wrap gap-3 mt-4 sm:mt-0">
            <button
              className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md transition-all flex items-center gap-2"
              onClick={() => setIsHistoryModalOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Ver Relatório
            </button>
            <button
              className="hover:bg-blue-700 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all"
              onClick={() => setCategoryModal(true)}
            >
              + Criar categoria
            </button>
            <button
              className="hover:bg-blue-700 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transition-all"
              onClick={() => setIsModalOpen(true)}
            >
              + Adicionar produtos
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2">
                📦 Inventário por Categoria
              </h2>
              <input
                type="text"
                placeholder="Buscar item..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                className="p-2 border rounded shadow-sm mb-4 w-full md:w-80"
              />
              <CategoryTable searchTerm={tableSearch} />
            </section>
          </div>
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
      {categoryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-lg font-bold">Criar nova categoria</h2>
              <button
                onClick={closeCatModal}
                className="text-2xl hover:text-gray-200 hover:cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleCatSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Nova categoria
                </label>
                <input
                  type="text"
                  required
                  placeholder="Digite o nome da nova categoria"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Estoque mínimo
                </label>
                <input
                  type="number"
                  required
                  value={minimum}
                  onChange={(e) => setMinimum(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeCatModal}
                  className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg hover:cursor-pointer font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white px-4 py-2 rounded-lg font-bold"
                >
                  Salvar no Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-lg font-bold">Nova Entrada de Estoque</h2>
              <button
                onClick={closeModal}
                className="text-2xl hover:text-gray-200 hover:cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-semibold text-gray-700">
                  Nome do Item
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: ONU ZTE, Roteador TP-Link..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                />
                {sugestoes.length > 0 && !itemExistente && (
                  <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {sugestoes.map((item) => (
                      <div
                        key={item.id}
                        className="p-2 hover:bg-gray-100 cursor-pointer text-sm"
                        onClick={() => selecionarSugestao(item)}
                      >
                        {item.name} (Sugerido)
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                >
                  {
                    categories?.map((cat) =>(
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  }
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Patrimônio / SN (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Deixe vazio se não houver serial"
                  value={patrimony}
                  onChange={(e) => setPatrimony(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                />
                <p className="text-sm text-gray-500 italic">
                  *Para cadastrar mais de um item com serial, digitar separados
                  por ";" exemplo: ztegnsjhz;ztegfhh;ztegklasjkd*
                </p>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Quantidade{" "}
                  {patrimony ? `(Detectados: ${countSerials()} un.)` : ""}
                </label>
                <input
                  type="number"
                  value={patrimony ? countSerials() : balance}
                  disabled={!!patrimony}
                  onChange={(e) => {
                    const val = e.target.value;
                    setBalance(val === "" ? "" : Number(val));
                  }}
                  className={`mt-1 block w-full p-2 border rounded-md ${
                    patrimony ? "bg-gray-100 font-bold text-blue-600" : ""
                  }`}
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Descrição/Obs
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                  rows="3"
                ></textarea>
              </div>

              <div className="md:col-span-3 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg hover:cursor-pointer font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 hover:cursor-pointer text-white px-4 py-2 rounded-lg font-bold"
                >
                  Salvar no Estoque
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* MODAL DE HISTÓRICO GERAL */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-gray-800 p-5 flex justify-between items-center text-white shrink-0">
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h2 className="text-xl font-bold">Relatório de Requisições</h2>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Fechar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-auto bg-gray-50/50 p-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto min-h-[400px]">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs tracking-wider uppercase font-bold border-b border-gray-100">
                        <th className="px-6 py-4">Usuário</th>
                        <th className="px-6 py-4">Item Solicitado</th>
                        <th className="px-6 py-4 text-center">Qtd</th>
                        <th className="px-6 py-4">Data</th>
                        <th className="px-6 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {paginatedHistory.length > 0 ? (
                        paginatedHistory.map((req) => (
                          <tr key={req.id} className="text-sm hover:bg-blue-50/50 transition-colors">
                            <td className="px-6 py-4 font-semibold text-gray-800">
                              {req.user?.name || req.user?.username || "Desconhecido"}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-600">
                              {req.item?.name || "Item Removido"}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="font-bold text-gray-700 bg-gray-100 px-2.5 py-1 rounded-md">{req.quantity}</span>
                            </td>
                            
                            <td className="px-6 py-4 text-gray-500">
                              {new Date(req.createdAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-center">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${
                                    req.status === "aprovado"
                                      ? "bg-green-50 text-green-600 border-green-200"
                                      : req.status === "rejeitado"
                                        ? "bg-red-50 text-red-600 border-red-200"
                                        : "bg-amber-50 text-amber-600 border-amber-200"
                                  }`}
                                >
                                  {req.status}
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-gray-400">
                            Nenhum registro de requisição encontrado no sistema.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Pagination Controls para Histórico */}
            {historyTotalItems > 0 && (
              <div className="bg-white border-t border-gray-200 px-6 py-4 flex items-center justify-between shrink-0">
                <span className="text-sm font-medium text-gray-500">
                  Total de <span className="font-bold text-gray-800">{historyTotalItems}</span> registros documentados
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setHistoryPage(p => Math.max(1, p - 1))}
                    disabled={historyPage === 1}
                    className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <span className="text-sm font-semibold px-2">
                    {historyPage} / {historyTotalPages}
                  </span>
                  <button
                    onClick={() => setHistoryPage(p => Math.min(historyTotalPages, p + 1))}
                    disabled={historyPage === historyTotalPages}
                    className="p-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehouseScreen;
