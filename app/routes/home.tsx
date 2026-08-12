import type { Route } from "./+types/home";
import { useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
type canvasElement ={
  id: number,
  type: string,
  content: string,
  x: number,
  y: number,
}
export default function Home() {
  const [elements, setElements] = useState<canvasElement[]>([]);

  function addText() {
    const newText = {
      id: Date.now(),
      type: "text",
      content: "text baru",
      x: 100,
      y: 100 + elements.length * 30,
    };
    setElements([...elements, newText ]);
  }

  return (
    <div className="min-h-screen bg-gray-200">
      {/* Toolbar */}
      <div className="h-16 bg-gray-300 flex items-center px-5">
        <h1 className="text-xl font-bold">My Editor</h1>
        <button
          onClick={addText}
          className="ml-2.5 px-2 py-1 bg-blue-400 text-white rounded-tl-xl rounded-br-md hover:bg-blue-600"
        >
          + tambah teks
        </button>
        <div></div>
      </div>
      {/* Workspace */}
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-start p-10">
        {/* Kertas */}
        <div className="relative w-198.5 h-280.75 bg-white text-gray-600 shadow-lg rounded-md">
          <h1 className="p-4">workspace</h1>
          {elements.map((element) => (
            <div
              key={element.id}
              className="absolute"
              style={{
                left: element.x,
                top: element.y,
              }}
            >
              <h1 className="bg-red-200 px-2.5 rounded-tl-md">{element.content}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
