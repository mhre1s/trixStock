import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItemsByCategory } from "../apis/itemApi";
import { createRequest } from "../apis/requestApi";

// --- SUB-COMPONENTE PARA A CATEGORIA ---
const CategoryCard = ({ cat, handleOpenModal }) => {
  const INITIAL_COUNT = 4;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  return (
    <div className="border border-gray-100 rounded-xl shadow-sm bg-gray-50 overflow-hidden h-fit flex flex-col">
      <div className="bg-blue-600 p-3 flex justify-between items-center text-white">
        <h2 className="font-semibold">{cat.name}</h2>
        <span className="text-xs bg-blue-500 px-2 py-1 rounded">
          {cat.displayItems.length} modelos
        </span>
      </div>

      <ul className="p-4 space-y-2 flex-grow">
        {cat.displayItems.slice(0, visibleCount).map((itemName, index) => (
          <li
            key={index}
            className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200 hover:border-blue-300 transition-all"
          >
            <span className="text-gray-700 font-medium text-sm">
              {itemName}
            </span>
            <button
              onClick={() => handleOpenModal(itemName)}
              className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-md font-bold transition-colors shadow-sm"
            >
              Solicitar
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-col border-t border-gray-200 bg-white">
        {/* Botão de Ver Mais Modelos */}
        {visibleCount < cat.displayItems.length && (
          <button
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="w-full p-2 text-xs text-blue-600 font-bold hover:bg-blue-50 transition-colors"
          >
            + Ver mais modelos ({cat.displayItems.length - visibleCount})
          </button>
        )}

        {/* Botão de Ver Menos Modelos */}
        {visibleCount > INITIAL_COUNT && (
          <button
            onClick={() => setVisibleCount(INITIAL_COUNT)}
            className="w-full p-2 text-xs text-gray-400 font-bold hover:bg-red-50 hover:text-red-500 transition-colors border-t border-gray-100"
          >
            - Ver menos
          </button>
        )}
      </div>
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---
const ItemCatalog = () => {
  const queryClient = useQueryClient();
  const INITIAL_CATEGORIES = 6;

  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");
  const [categoriesLimit, setCategoriesLimit] = useState(INITIAL_CATEGORIES);

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

  const filteredCatalog = useMemo(() => {
    if (!data) return [];
    return data
      .map((category) => {
        const uniqueItemNames = [...new Set(category.items.map((i) => i.name))];
        const matchedNames = uniqueItemNames.filter((name) =>
          name.toLowerCase().includes(searchTerm.toLowerCase()),
        );
        return { ...category, displayItems: matchedNames };
      })
      .filter((cat) => cat.displayItems.length > 0);
  }, [data, searchTerm]);

  // Reseta o limite ao pesquisar
  useMemo(() => {
    setCategoriesLimit(INITIAL_CATEGORIES);
  }, [searchTerm]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCatalog.slice(0, categoriesLimit).map((cat) => (
          <CategoryCard
            key={cat.id}
            cat={cat}
            handleOpenModal={handleOpenModal}
          />
        ))}
      </div>

      {/* Seção de Controle das Categorias */}
      <div className="mt-12 mb-8 flex flex-col items-center gap-4">
        {categoriesLimit < filteredCatalog.length && (
          <button
            onClick={() => setCategoriesLimit((prev) => prev + 6)}
            className="hover:cursor-pointer px-10 py-3 bg-gray-800 text-white rounded-full font-bold hover:bg-gray-700 transition-all shadow-lg flex items-center gap-3"
          >
            Ver mais categorias
            <span className="bg-gray-600 px-2 py-0.5 rounded-full text-xs">
              {filteredCatalog.length - categoriesLimit}
            </span>
          </button>
        )}

        {categoriesLimit > INITIAL_CATEGORIES && (
          <button
            onClick={() => {
              setCategoriesLimit(INITIAL_CATEGORIES);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="hover:cursor-pointer text-sm text-gray-400 font-semibold hover:text-red-500 transition-colors underline underline-offset-4"
          >
            Recolher categorias
          </button>
        )}
      </div>

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
