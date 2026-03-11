import React, { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { registerItem, getItems } from "../apis/itemApi";
import CategoryTable from "../components/CategoryTable";

const OperationalScreen = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState("");
  const [patrimony, setPatrimony] = useState("");
  const [category, setCategory] = useState(1);
  const [balance, setBalance] = useState(0);
  const [description, setDescription] = useState("");

 
  const { data: items } = useQuery({
    queryKey: ["items"],
    queryFn: getItems,
  });

  
  const sugestoes =
    name.length > 1
      ? items?.filter((i) => i.name.toUpperCase().includes(name.toUpperCase()))
      : [];

  
  const itemExistente = items?.find(
    (i) => i.name.toUpperCase() === name.toUpperCase(),
  );

  const mutation = useMutation({
    mutationFn: registerItem,
    onSuccess: () => {
      alert(`Estoque atualizado com sucesso!`);
      queryClient.invalidateQueries(["items"]);
      closeModal();
    },
    onError: (error) => {
      alert("Erro: " + (error.response?.data?.error || "servidor offline"));
    },
  });

  
  const selecionarSugestao = (item) => {
    setName(item.name);
    setCategory(item.category_id);;
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setName("");
    setPatrimony("");
    setBalance(0);
    setDescription("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      name,
      patrimony: patrimony.trim(),
      category_id: category,
      balance: patrimony ? 1 : balance,
      description,
    });
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen relative font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Catálogo TrixStock
          </h1>
          <button
            className="hover:cursor-pointer hover:bg-blue-500 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg transition-all"
            onClick={() => setIsModalOpen(true)}
          >
            + Novo Item / Entrada
          </button>
        </div>
      </div>
      <CategoryTable/>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
              <h2 className="text-lg font-bold">Gerenciar Estoque</h2>
              <button
                onClick={closeModal}
                className="text-2xl hover:text-gray-200 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-semibold text-gray-700">
                  Nome do Item
                </label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Digite o nome do item (Ex: ONU F6600, Caneta azul...)"
                />

                {sugestoes.length > 0 && !itemExistente && (
                  <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {sugestoes.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => selecionarSugestao(item)}
                        className="p-2 hover:bg-blue-50 cursor-pointer text-sm border-b last:border-0"
                      >
                        <span className="font-bold">{item.name}</span>{" "}
                        <span className="text-gray-500 text-xs">
                          ({item.Category?.name})
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {itemExistente && (
                  <p className="text-xs text-green-600 mt-1 font-medium">
                    ✨ Item reconhecido no catálogo.
                  </p>
                )}
              </div>

              <div className="md:col-span-1">
                <label className="block text-sm font-semibold text-gray-700">
                  Patrimônio / SN
                </label>
                <input
                  type="text"
                  value={patrimony}
                  onChange={(e) => setPatrimony(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="SN do equipamento"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  Quantidade {patrimony ? "(Unitário)" : "(Entrada)"}
                </label>
                <input
                  disabled={patrimony?.length > 0}
                  required
                  type="number"
                  value={patrimony?.length > 0 ? 1 : balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className={`mt-1 block w-full p-2 border rounded-md ${patrimony ? "bg-gray-100 text-gray-500" : ""}`}
                />
                {patrimony?.length > 0 && (
                  <span className="text-[10px] text-orange-600">
                    Com SN, a entrada é sempre de 1 un.
                  </span>
                )}
              </div>

              <div
                className={
                  itemExistente ? "opacity-50 pointer-events-none" : ""
                }
              >
                <label className="block text-sm font-semibold text-gray-700">
                  Categoria
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(Number(e.target.value))}
                  className="mt-1 block w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                >
                  <option value={1}>Onu</option>
                  <option value={2}>Escritório</option>
                  <option value={3}>Cabeamento</option>
                  <option value={4}>Ferramentas</option>
                </select>
              </div>

              <div
                className={
                  itemExistente ? "opacity-50 pointer-events-none" : ""
                }
              ></div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Descrição Curta
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Observações da entrada"
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  disabled={mutation.isPending}
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-bold shadow-md disabled:bg-gray-400"
                >
                  {mutation.isPending ? "Salvando..." : "Salvar no Estoque"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OperationalScreen;
