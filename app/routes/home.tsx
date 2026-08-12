import type { Route } from "./+types/home";
import React, { useRef, useState } from "react";
import { toPng } from "html-to-image";

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
  const paperRef = useRef(null)

  async function downloadImage() {
  if (!paperRef.current) return;

  try {
    const dataUrl = await toPng(paperRef.current, {
      pixelRatio: 1,
      skipFonts: true,
    });

    const link = document.createElement("a");

    link.download = "desain.png";
    link.href = dataUrl;

    link.click();
  } catch (error) {
    console.error("Gagal download:", error);
  }
}
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

  function handleMouseDown(e: React.MouseEvent, id: number) {
    console.log(`ini adlah e -> ${e}`)
    e.preventDefault();

    const startX = e.clientX;
    const startY = e.clientY;

    const element = elements.find((item) => item.id === id);

    if (!element) return;

    const startElementX = element.x;
    const startElementY = element.y;

    function handleMouseMove(e: MouseEvent) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      setElements((currentElements) =>
        currentElements.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              x: startElementX + dx,
              y: startElementY + dy,
            };
          }

          return item;
        }),
      );
    }

    function handleMouseUp() {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
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
        <button
          onClick={downloadImage}
          className="ml-2.5 px-2 py-1 bg-green-400 text-white rounded-tl-xl rounded-br-md hover:bg-green-600"
        >
          Download PNG
        </button>
        <div></div>
      </div>
      {/* Workspace */}
      <div className="min-h-[calc(100vh-64px)] flex justify-center items-start p-10">
        {/* Kertas */}
        <div
          ref={paperRef}
          className="relative w-270 h-[1920px] bg-white text-gray-600 shadow-lg rounded-tl-3xl"
        >
          <div className="p-4">
            <h1 className="text-xl font-bold uppercase">
              List Pembelajaran Sekarang
            </h1>
            <ul>
              <li>
                kertas <span className="text-red-500">(donne)</span>
              </li>
              <li>
                add teks <span className="text-red-500">(donne)</span>
              </li>
              <li>drag</li>
              <li>resize</li>
              <li>gambar</li>
              <li>
                shape <span className="text-red-500">(donne)</span>
              </li>
              <li>dowload</li>
            </ul>
            {elements.map((element) => (
              <div
                key={element.id}
                className="absolute cursor-move"
                style={{
                  left: element.x,
                  top: element.y,
                }}
                onMouseDown={(e) => handleMouseDown(e, element.id)}
              >
                <h1 className="bg-red-200 px-2.5 rounded-tl-md">
                  {element.content}
                </h1>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
