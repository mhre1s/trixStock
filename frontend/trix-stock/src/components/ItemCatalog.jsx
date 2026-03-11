import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getItemsByCategory } from "../apis/itemApi";

const ItemCatalog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, error } = useQuery({
    queryKey: ["itemsByCategory"],
    queryFn: getItemsByCategory,
  });

  const filteredCatalog = useMemo(() => {
    if (!data) return [];

    return data
      .map((category) => {
        const uniqueItemNames = [...new Set(category.items.map((i) => i.name))];
        const matchedNames = uniqueItemNames.filter((name) =>
          name.toLowerCase().includes(searchTerm.toLowerCase()),
        );

        return {
          ...category,
          displayItems: matchedNames,
        };
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
    <div className="p-6 bg-white min-h-screen">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Catálogo de Solicitação
        </h1>
        <p className="text-gray-500 text-sm">
          Pesquise o item desejado
        </p>

        <div className="mt-4 relative max-w-md">
          <input
            type="text"
            placeholder="Digite o nome do item (ex: ONU, Caneta...)"
            className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
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
            <div className="bg-blue-600 p-3">
              <h2 className="text-white font-semibold flex justify-between items-center">
                {cat.name}
                <span className="text-xs bg-blue-500 px-2 py-1 rounded">
                  {cat.displayItems.length} tipos
                </span>
              </h2>
            </div>
            <ul className="p-4 space-y-2">
              {cat.displayItems.map((itemName, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3 p-2 bg-white rounded-md border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all cursor-default"
                >
                  <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  <span className="text-gray-700 font-medium">{itemName}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {filteredCatalog.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-xl italic">
            Nenhum item encontrado para "{searchTerm}"
          </p>
        </div>
      )}
    </div>
  );
};

export default ItemCatalog;
