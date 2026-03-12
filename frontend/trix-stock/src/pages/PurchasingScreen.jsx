import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getItems } from "../apis/itemApi";

const PurchasingScreen = () => {
  const { data: items, isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  const critCategories = items
    ? Object.values(
        items.reduce((acc, item) => {
          const cat = item.Category;
          if (!cat) return acc;

          if (!acc[cat.id]) {
            acc[cat.id] = {
              id: cat.id,
              name: cat.name,
              minimum: cat.minimum,
              totalBalance: 0,
              modelos: {}, 
            };
          }
          acc[cat.id].totalBalance += item.balance;

          if (!acc[cat.id].modelos[item.name]) {
            acc[cat.id].modelos[item.name] = 0;
          }
          acc[cat.id].modelos[item.name] += item.balance;

          return acc;
        }, {}),
      ).filter((c) => c.totalBalance <= c.minimum)
    : [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-10 border-b pb-6">
          <div>
            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
              Setor de Compras <span className="text-blue-600">|</span>{" "}
              TrixStock
            </h1>
            <p className="text-gray-500 font-medium">
              Monitoramento de Reposição de Estoque
            </p>
          </div>
          <div className="text-right">
            <span className="block text-xs font-bold text-gray-400 uppercase">
              Status do Sistema
            </span>
            <span className="flex items-center gap-2 text-green-500 font-bold">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>{" "}
              Online
            </span>
          </div>
        </header>
        <div className="space-y-6">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
            Alertas de Reposição Necessária ({critCategories.length})
          </h2>

          {isLoading ? (
            <p className="text-gray-400 animate-pulse">
              Carregando dados do estoque...
            </p>
          ) : critCategories.length > 0 ? (
            critCategories.map((cat) => (
              <div className="flex items-center gap-5">
                <div className="bg-red-500 text-white w-14 h-14 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-red-200">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {cat.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3">
                    O estoque total atingiu o limite crítico de segurança.
                  </p>

                  {/* LISTA DE MODELOS AGRUPADOS */}
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(cat.modelos).map(([nome, qtd]) => (
                      <span
                        key={nome}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200"
                      >
                        {nome}:{" "}
                        <span className="ml-1 font-bold text-red-600">
                          {qtd}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-green-50 border-2 border-green-100 rounded-2xl p-12 text-center">
              <span className="text-4xl mb-4 block">✅</span>
              <h3 className="text-green-800 font-bold text-lg">
                Não há produtos com chance de esgotamento
              </h3>
              <p className="text-green-600">
                Todas as categorias estão com saldo acima do mínimo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasingScreen;
