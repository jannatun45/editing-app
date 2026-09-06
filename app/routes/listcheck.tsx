import { useState } from "react";
import { NavLink } from "react-router";

type ChecklistItem = {
  id: number;
  title: string;
  completed: boolean;
};

export default function Checklist() {
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: 1,
      title: "Install React Router",
      completed: false,
    },
    {
      id: 2,
      title: "Membuat routes",
      completed: false,
    },
    {
      id: 3,
      title: "Menggunakan NavLink",
      completed: false,
    },
  ]);

  const handleCheck = (id: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  };

  return (
    <main className="min-h-screen bg-zinc-50 p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-zinc-900">
          React Router Checklist
        </h1>

        <div className="space-y-3">
          {items.map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg bg-white p-4 shadow-sm"
            >
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleCheck(item.id)}
                className="h-5 w-5 accent-zinc-900"
              />

              <span
                className={
                  item.completed
                    ? "text-zinc-400 line-through"
                    : "text-zinc-700"
                }
              >
                {item.title}
              </span>
            </label>
          ))}
        </div>

        <NavLink
          to="/"
          className="mt-6 inline-block text-sm text-zinc-500 hover:text-zinc-900"
        >
          ← Kembali
        </NavLink>
      </div>
    </main>
  );
}
