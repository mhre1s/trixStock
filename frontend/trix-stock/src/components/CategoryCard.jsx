import { useState } from "react";

export function CategoryCard({ cat, handleOpenModal }) {
  const INITIAL_COUNT = 4;
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 4);
  };

  const handleShowLess = () => {
    setVisibleCount(INITIAL_COUNT);
  };

  return (
    <div className="border border-gray-100 rounded-xl shadow-sm bg-gray-50 overflow-hidden h-fit flex flex-col">
      <div className="bg-blue-600 p-3 flex justify-between items-center text-white">
        <h2 className="font-semibold">{cat.name}</h2>
        <span className="text-xs bg-blue-500 px-2 py-1 rounded">
          {cat.displayItems.length} modelos
        </span>
      </div>

      <ul className="p-4 space-y-2 grow">
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
      <div className="px-4 pb-4 space-y-2">
        {visibleCount < cat.displayItems.length && (
          <button
            onClick={handleShowMore}
            className="hover:cursor-pointer w-full py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 border border-dashed border-blue-200 rounded-md transition-colors"
          >
            + Mostrar mais modelos ({cat.displayItems.length - visibleCount}{" "}
            restantes)
          </button>
        )}
        {visibleCount > INITIAL_COUNT && (
          <button
            onClick={handleShowLess}
            className="hover:cursor-pointer w-full py-2 text-xs text-gray-500 font-medium hover:text-red-500 transition-colors"
          >
            - Recolher itens
          </button>
        )}
      </div>
    </div>
  );
}
