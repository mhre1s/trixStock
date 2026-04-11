import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItemsByCategory } from "../apis/itemApi";
import { createRequest } from "../apis/requestApi";

// --- SISTEMA DE PAGINAÇÃO GLOBAL E CATÁLOGO UNIFICADO ---

// --- COMPONENTE PRINCIPAL ---
const ItemCatalog = () => {
  const queryClient = useQueryClient();
  const ITEMS_PER_PAGE = 12;

  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, error } = useQuery({
    queryKey: ["itemsByCategory"],
    queryFn: getItemsByCategory,
  });

  const mutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      alert(`Solicitação de "${selectedItemName}" enviada com sucesso!`);
      setIsModalOpen(false);
      queryClient.invalidateQueries(["itemsByCategory"]);
    },
    onError: (err) => {
      alert(
        "Erro ao solicitar item: " +
          (err.response?.data?.error || "Servidor offline"),
      );
    },
  });

  const handleOpenModal = (itemName) => {
    setSelectedItemName(itemName);
    setQuantity(1);
    setIsModalOpen(true);
  };

  const handleConfirmRequest = () => {
    mutation.mutate({
      itemName: selectedItemName,
      quantity: Number(quantity),
    });
  };

  const flatItems = useMemo(() => {
    if (!data) return [];
    const allItems = [];
    data.forEach((category) => {
      const uniqueNames = [...new Set(category.items.map((i) => i.name))];
      uniqueNames.forEach((name) => {
        allItems.push({
          name: name,
          categoryName: category.name,
          categoryId: category.id,
        });
      });
    });

    if (!searchTerm) return allItems;

    return allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [data, searchTerm]);

  // Reseta paginação ao pesquisar
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalItems = flatItems.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedItems = flatItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((p) => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((p) => p - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading)
    return (
      <div className="p-10 text-center text-blue-600 font-bold">
        Carregando catálogo...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-red-500 text-center">
        Erro ao carregar itens.
      </div>
    );

  return (
    <div className="p-6 bg-white min-h-screen font-sans">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Catálogo de Solicitação
        </h1>
        <p className="text-gray-500 text-sm">
          Pesquise e solicite o item desejado para retirada.
        </p>
        <div className="mt-4 relative max-w-md">
          <input
            type="text"
            placeholder="Digite o nome do item..."
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {paginatedItems.map((item, idx) => (
          <div key={`${item.categoryId}-${item.name}-${idx}`} className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-200 transition-all flex flex-col overflow-hidden group">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest truncate">{item.categoryName}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between gap-4">
              <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2">{item.name}</h3>
              <button
                onClick={() => handleOpenModal(item.name)}
                className="w-full mt-auto bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-4 py-2 rounded-lg font-bold transition-colors shadow-sm focus:ring-4 focus:ring-blue-100 active:scale-95"
              >
                Solicitar
              </button>
            </div>
          </div>
        ))}
        {flatItems.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Nenhum item encontrado no catálogo.
          </div>
        )}
      </div>

      {/* Seção de Controle de Paginação */}
      {totalPages > 1 && (
        <div className="mt-12 mb-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm border border-gray-100">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-label="Voltar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            <div className="flex items-center gap-1 mx-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${
                    currentPage === i + 1 
                      ? "bg-gray-800 text-white shadow-md" 
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
              aria-label="Avançar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <span className="text-sm font-medium text-gray-400">Página {currentPage} de {totalPages} • Total de {totalItems} itens</span>
        </div>
      )}

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Confirmar Solicitação
            </h2>
            <p className="text-gray-600 mb-4">
              Item:{" "}
              <span className="font-bold text-blue-600">
                "{selectedItemName}"
              </span>
            </p>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quantidade Desejada:
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              >
                Cancelar
              </button>
              <button
                disabled={mutation.isPending}
                onClick={handleConfirmRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold disabled:bg-gray-400"
              >
                {mutation.isPending ? "Enviando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCatalog;
