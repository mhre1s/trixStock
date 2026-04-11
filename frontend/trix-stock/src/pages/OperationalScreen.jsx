import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ItemCatalog from "../components/ItemCatalog";
import { getRequests } from "../apis/requestApi";

const ITEMS_PER_PAGE = 5;

const OperationalScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const { data: requests, isLoading } = useQuery({
    queryKey: ["requests"],
    queryFn: getRequests,
  });

  // Paginação
  const totalItems = requests?.length || 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedRequests = requests?.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12">
      <ItemCatalog />
      
      <div className="p-6 max-w-6xl mx-auto mt-6">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
          {/* Header da Tabela */}
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white/50 backdrop-blur-sm">
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent flex items-center gap-3">
                <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </span>
                Meu Histórico de Solicitações
              </h2>
              <p className="text-sm text-gray-500 mt-1 font-medium ml-12">Acompanhe o status dos itens que você solicitou</p>
            </div>
            {!isLoading && (
              <div className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                {totalItems} Registro{totalItems !== 1 && 's'}
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 text-xs tracking-wider uppercase font-bold border-b border-gray-100">
                  <th className="px-6 py-4">Item Solicitado</th>
                  <th className="px-6 py-4 text-center">Quantidade</th>
                  <th className="px-6 py-4">Data da Solicitação</th>
                  <th className="px-6 py-4 text-center">Status Transacional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/80">
                {isLoading ? (
                  /* Skeleton Loader Animado */
                  [...Array(ITEMS_PER_PAGE)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-8 mx-auto"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                      <td className="px-6 py-5"><div className="h-6 bg-gray-200 rounded-full w-24 mx-auto"></div></td>
                    </tr>
                  ))
                ) : paginatedRequests?.length > 0 ? (
                  paginatedRequests.map((req) => (
                    <tr
                      key={req.id}
                      className="text-sm hover:bg-blue-50/50 transition-all duration-200 group"
                    >
                      <td className="px-6 py-5 font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
                        {req.item?.name || "Item Indisponível"}
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="font-bold text-gray-600 bg-gray-100/80 px-3 py-1 rounded-md">{req.quantity}</span>
                      </td>
                      <td className="px-6 py-5 text-gray-500 font-medium">
                        {new Date(req.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          <span
                            className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide shadow-sm border ${
                              req.status === "aprovado"
                                ? "bg-green-50 text-green-600 border-green-200/50"
                                : req.status === "rejeitado"
                                  ? "bg-red-50 text-red-600 border-red-200/50"
                                  : "bg-amber-50 text-amber-600 border-amber-200/50"
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
                    <td colSpan="4" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-base font-semibold text-gray-500">Nenhuma solicitação encontrada</p>
                        <p className="text-sm mt-1">Seus pedidos aparecerão aqui após utilizar o catálogo acima.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Controle de Paginação */}
          {!isLoading && totalPages > 1 && (
            <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500 font-medium">
                Mostrando <span className="font-bold text-gray-700">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> a <span className="font-bold text-gray-700">{Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}</span> de <span className="font-bold text-gray-700">{totalItems}</span>
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  aria-label="Página Anterior"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                        currentPage === i + 1 
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30" 
                          : "text-gray-600 hover:bg-gray-200/50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
                  aria-label="Próxima Página"
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
    </div>
  );
};

export default OperationalScreen;