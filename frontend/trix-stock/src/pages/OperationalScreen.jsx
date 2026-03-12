import React from "react";
import { useQuery } from "@tanstack/react-query";
import ItemCatalog from "../components/ItemCatalog";
import { getRequests } from "../apis/requestApi";

const OperationalScreen = () => {
  const { data: requests, isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <ItemCatalog />
      <div className="p-6 max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            📋 Status das Minhas Solicitações
          </h2>

          {isLoading ? (
            <p className="text-gray-400 animate-pulse">
              Carregando histórico...
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-bold">
                  <tr>
                    <th className="p-3">Item</th>
                    <th className="p-3 text-center">Qtd</th>
                    <th className="p-3">Data</th>
                    <th className="p-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {requests?.map((req) => (
                    <tr
                      key={req.id}
                      className="text-sm hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 font-medium text-gray-700">
                        {req.item?.name || "Item Indisponível"}
                      </td>
                      <td className="p-3 text-center text-gray-600">
                        {req.quantity}
                      </td>
                      <td className="p-3 text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              req.status === "aprovado"
                                ? "bg-green-100 text-green-600"
                                : req.status === "rejeitado"
                                  ? "bg-red-100 text-red-600"
                                  : "bg-orange-100 text-orange-600"
                            }`}
                          >
                            {req.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {requests?.length === 0 && (
                    <tr>
                      <td
                        colSpan="4"
                        className="p-6 text-center text-gray-400 italic"
                      >
                        Nenhuma solicitação encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OperationalScreen;