import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getItemsByCategory } from "../apis/itemApi";

const CategoryTable = ({ searchTerm }) => {
  const [expandedCat, setExpandedCat] = useState(null);
  const [expandedModel, setExpandedModel] = useState(null);
  const [viewMode, setViewMode] = useState("available");

  const { data, isLoading } = useQuery({
    queryKey: ["itemsByCategory"],
    queryFn: getItemsByCategory,
  });

  const groupedData = useMemo(() => {
    if (!data) return [];
    return data.map((cat) => {
      const itemsByModel = cat.items?.reduce((acc, item) => {
        const modelName = item.name.trim();
        if (!acc[modelName]) {
          acc[modelName] = { name: modelName, units: [] };
        }
        acc[modelName].units.push(item);
        return acc;
      }, {});
      return { ...cat, models: Object.values(itemsByModel || {}) };
    });
  }, [data]);

  if (isLoading)
    return (
      <div className="p-10 text-center text-gray-500 italic">
        Carregando estoque...
      </div>
    );

  return (
    <div className="space-y-4 font-sans">
      <div className="flex justify-end gap-6 border-b border-gray-100 pb-2">
        <button
          onClick={() => setViewMode("available")}
          className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all pb-1 ${viewMode === "available" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-400 hover:text-gray-600"}`}
        >
          <span>📦</span> Disponível
        </button>
        <button
          onClick={() => setViewMode("unavailable")}
          className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all pb-1 ${viewMode === "unavailable" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-gray-600"}`}
        >
          <span>🚫</span> Saíram / Esgotado
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-300 shadow-md bg-white">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-gray-800 text-white uppercase text-[11px] tracking-wider">
            <tr>
              <th className="px-6 py-4">Item / Modelo</th>
              <th className="px-6 py-4 text-center w-32">Qtd na Aba</th>
              <th className="px-6 py-4 text-right w-40">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {groupedData.map((cat) => {
              // 1. Filtramos as unidades de cada modelo primeiro
              const modelsWithFilteredUnits = cat.models
                .map((model) => {
                  const filteredUnits = model.units.filter((u) =>
                    viewMode === "available" ? u.balance > 0 : u.balance <= 0,
                  );
                  return {
                    ...model,
                    filteredUnits,
                    count: filteredUnits.length,
                  };
                })
                .filter((m) => m.count > 0); // Só mostra o modelo se ele tiver unidades nesse modo

              // 2. Filtro de Busca
              const finalModels = modelsWithFilteredUnits.filter(
                (m) =>
                  m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  m.filteredUnits.some((u) =>
                    u.patrimony
                      ?.toLowerCase()
                      .includes(searchTerm.toLowerCase()),
                  ),
              );

              if (finalModels.length === 0 && !searchTerm) return null;
              const isCatExpanded = expandedCat === cat.id || searchTerm;

              return (
                <React.Fragment key={cat.id}>
                  <tr
                    className="bg-gray-200 cursor-pointer hover:bg-gray-300 transition-colors border-b border-gray-300"
                    onClick={() =>
                      setExpandedCat(isCatExpanded ? null : cat.id)
                    }
                  >
                    <td className="px-6 py-3 font-black text-gray-800 flex items-center gap-3">
                      <span className="text-blue-600 text-xs">
                        {isCatExpanded ? "▼" : "▶"}
                      </span>
                      {cat.name.toUpperCase()}
                    </td>
                    <td className="px-6 py-3 text-center font-bold text-gray-900">
                      {finalModels.reduce((acc, curr) => acc + curr.count, 0)}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-[10px] font-bold ${viewMode === "unavailable" ? "bg-gray-100 text-gray-500" : "bg-green-100 text-green-600"}`}
                      >
                        {viewMode === "unavailable"
                          ? "HISTÓRICO"
                          : "EM ESTOQUE"}
                      </span>
                    </td>
                  </tr>

                  {isCatExpanded &&
                    finalModels.map((model) => {
                      const isModelExpanded = expandedModel === model.name;

                      return (
                        <React.Fragment key={model.name}>
                          <tr
                            className="hover:bg-blue-50 cursor-pointer border-l-4 border-blue-500 bg-white"
                            onClick={() =>
                              setExpandedModel(
                                isModelExpanded ? null : model.name,
                              )
                            }
                          >
                            <td className="px-10 py-3 font-semibold text-gray-700">
                              {model.name}
                            </td>
                            <td className="px-6 py-3 text-center font-mono font-bold text-blue-700">
                              {model.count}
                            </td>
                            <td className="px-6 py-3 text-right text-[10px] text-blue-500 font-bold uppercase tracking-tighter">
                              {isModelExpanded ? "Ocultar ▲" : "Ver Lista ▼"}
                            </td>
                          </tr>

                          {isModelExpanded && (
                            <tr>
                              <td
                                colSpan="3"
                                className="bg-gray-50 p-0 border-b border-gray-200"
                              >
                                <table className="w-full text-xs">
                                  <thead className="bg-gray-100 text-gray-400 uppercase text-[9px] tracking-widest">
                                    <tr>
                                      <th className="px-16 py-2">
                                        Patrimônio / Serial
                                      </th>
                                      <th className="px-4 py-2 text-right pr-10">
                                        Observação
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-100">
                                    {model.filteredUnits.map((unit, idx) => (
                                      <tr
                                        key={idx}
                                        className="hover:bg-white transition-colors"
                                      >
                                        <td className="px-16 py-2 font-mono font-bold text-gray-600 uppercase">
                                          {unit.patrimony || "SEM SERIAL"}
                                        </td>
                                        <td className="px-4 py-2 text-gray-400 italic text-right pr-10">
                                          {unit.description || "-"}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
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
