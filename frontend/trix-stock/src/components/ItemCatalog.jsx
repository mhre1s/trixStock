import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getItemsByCategory } from "../apis/itemApi";
import { createRequest } from "../apis/requestApi"; // Importando sua API de request

const ItemCatalog = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [quantity, setQuantity] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItemName, setSelectedItemName] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["itemsByCategory"],
    queryFn: getItemsByCategory,
  });

  const mutation = useMutation({
    mutationFn: createRequest,
    onSuccess: () => {
      alert(`Solicitação de "${selectedItemName}" enviada com sucesso!`);
      setIsModalOpen(false);
      // Invalida o cache para atualizar as quantidades se necessário
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

  if (isLoading)
    return <div className="p-10 text-center">Carregando catálogo...</div>;
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
        {filteredCatalog.map((cat) => (
          <div
            key={cat.id}
            className="border border-gray-100 rounded-xl shadow-sm bg-gray-50 overflow-hidden"
          >
            <div className="bg-blue-600 p-3 flex justify-between items-center text-white">
              <h2 className="font-semibold">{cat.name}</h2>
              <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                {cat.displayItems.length} modelos
              </span>
            </div>
            <ul className="p-4 space-y-2">
              {cat.displayItems.map((itemName, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-2 bg-white rounded-md border border-gray-200 hover:border-blue-300 transition-all"
                >
                  <span className="text-gray-700 font-medium">{itemName}</span>
                  <button
                    onClick={() => handleOpenModal(itemName)}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-md font-bold transition-colors shadow-sm"
                  >
                    Solicitar
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm animate-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Confirmar Solicitação
            </h2>

            <p className="text-gray-600 mb-4">
              Item:{" "}
              <span className="font-bold text-blue-600">
                "{selectedItemName}"
              </span>
            </p>

            {/* CAMPO DE QUANTIDADE */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quantidade Desejada:
              </label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1 italic">
                *Para itens com serial, solicite 1 unidade por vez.
              </p>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button
                disabled={mutation.isPending || quantity < 1}
                onClick={handleConfirmRequest}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md disabled:bg-gray-400"
              >
                {mutation.isPending ? "Processando..." : "Confirmar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemCatalog;
