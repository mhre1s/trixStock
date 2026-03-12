import { useState } from "react";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getItemsByCategory } from "../apis/itemApi";

const CategoryTable = ({ searchTerm }) => { // 1. Recebe a prop aqui
  const [expandedId, setExpandedId] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["itemsByCategory"],
    queryFn: getItemsByCategory,
  });

  if (isLoading)
    return <div className="p-10 text-center">Carregando estoque...</div>;
  if (error)
    return (
      <div className="p-10 text-red-500 text-center">
        Erro ao carregar dados.
      </div>
    );

  const toggleCategory = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Estoque por Categoria
      </h1>

      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
        <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
          <thead className="bg-gray-100 text-gray-700 uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Categoria</th>
              <th className="px-6 py-4 text-center">Total em Estoque</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((cat) => {
              // --- 2. LÓGICA DE FILTRAGEM DOS ITENS ---
              const filteredItems = cat.items?.filter((item) => {
                const search = searchTerm?.toLowerCase() || "";
                return (
                  item.name.toLowerCase().includes(search) ||
                  (item.patrimony && item.patrimony.toLowerCase().includes(search)) ||
                  (item.description && item.description.toLowerCase().includes(search))
                );
              }) || [];

              // Se estiver buscando e não achou nada nesta categoria, pula ela
              if (searchTerm && filteredItems.length === 0) return null;

              // Se estiver buscando e achou algo, vamos considerar ela "expandida" visualmente
              const isExpanded = expandedId === cat.id || (searchTerm && filteredItems.length > 0);

              return (
                <React.Fragment key={cat.id}>
                  <tr
                    className="hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => toggleCategory(cat.id)}
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 text-center text-lg font-semibold">
                      {cat.total}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {cat.lowStock ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                          ⚠️ Estoque Baixo (Mín: {cat.minimum})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                          Estável
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-blue-600 font-medium hover:underline">
                        {isExpanded ? "Fechar" : "Ver Itens"}
                      </button>
                    </td>
                  </tr>
                  
                  {/* --- 3. MOSTRAR APENAS ITENS FILTRADOS --- */}
                  {isExpanded && (
                    <tr>
                      <td colSpan="4" className="bg-gray-50 px-10 py-4">
                        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-inner">
                          <table className="w-full text-xs text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase border-b">
                              <tr>
                                <th className="px-4 py-2">Item / Descrição</th>
                                <th className="px-4 py-2">Patrimônio/Serial</th>
                                <th className="px-4 py-2 text-center">Quantidade</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {filteredItems.length > 0 ? (
                                filteredItems.map((item) => (
                                  <tr key={item.id} className="hover:bg-blue-50">
                                    <td className="px-4 py-2">
                                      <span className="font-bold">{item.name}</span>
                                      <br />
                                      <span className="text-gray-400 text-[10px]">
                                        {item.description || "Sem descrição"}
                                      </span>
                                    </td>
                                    <td className="px-4 py-2 text-gray-600 italic">
                                      {item.patrimony || "N/A"}
                                    </td>
                                    <td className="px-4 py-2 text-center font-mono">
                                      {item.balance}
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="3" className="p-4 text-center text-gray-400">
                                    Nenhum item encontrado.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
