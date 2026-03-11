import { useQuery } from "@tanstack/react-query";
import { api } from "../apis/itemApi";

export const getItemsByCategory = async () => {
  const res = await api.get("/items/by-category");
  return res.data;
};

// Componente
const CategoryTable = () => {
  const { data, isLoading, error } = useQuery(
    ["itemsByCategory"],
    getItemsByCategory,
  );

  if (isLoading) return <p>Carregando...</p>;
  if (error) return <p>Erro ao carregar dados</p>;

  return (
    <div className="p-6">
      {data.map((cat) => (
        <div key={cat.id} className="mb-6">
          <h2 className="font-bold text-lg">
            {cat.name} ({cat.total}){" "}
            {cat.lowStock && <span className="text-red-600">⚠️</span>}
          </h2>
          <ul className="ml-4 list-disc">
            {cat.items.map((item) => (
              <li key={item.id}>
                {item.name} - {item.balance} {item.unit_of_measure}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CategoryTable;
