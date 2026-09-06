// costum hook untuk mengelola seluruh element didalam canvas.
// export default function useCanvasElements(scale:number){
//   const [element, setElement]
// }

// app/hooks/useCanvasElements.ts

// Mengimpor hook React yang digunakan untuk menyimpan state.
import { useState } from "react";

// Mengimpor tipe CanvasElement dari folder types.
import type { CanvasElement } from "../types/canvas";

// Custom hook untuk mengelola seluruh element di dalam canvas.
export default function useCanvasElements(scale: number) {
  // Menyimpan seluruh element yang berada di dalam canvas.
  const [elements, setElements] = useState<CanvasElement[]>([]);

  // Function untuk menambahkan text baru ke canvas.
  function addText() {
    // Membuat object element baru.
    const newText: CanvasElement = {
      // Membuat ID unik berdasarkan waktu saat element dibuat.
      id: Date.now(),

      // Menentukan bahwa element ini adalah text.
      type: "text",

      // Isi awal text.
      content: "Text baru",

      // Posisi horizontal awal text.
      x: 100,

      // Posisi vertical awal text.
      y: 100 + elements.length * 30,
    };

    // Menambahkan element baru ke state.
    setElements((currentElements) => [...currentElements, newText]);
  }

  // Function untuk memulai proses drag sebuah element.
  function handleMouseDown(event: React.MouseEvent, id: number) {
    // Mencegah browser melakukan behaviour default.
    event.preventDefault();

    // Menyimpan posisi mouse ketika drag dimulai.
    const startX = event.clientX;

    // Menyimpan posisi mouse vertikal ketika drag dimulai.
    const startY = event.clientY;

    // Mencari element yang sedang dipindahkan.
    const element = elements.find((item) => item.id === id);

    // Menghentikan function jika element tidak ditemukan.
    if (!element) return;

    // Menyimpan posisi awal element.
    const startElementX = element.x;

    // Menyimpan posisi awal element secara vertikal.
    const startElementY = element.y;

    // Function yang dijalankan ketika mouse bergerak.
    function handleMouseMove(event: MouseEvent) {
      // Menghitung perubahan posisi horizontal mouse.
      const dx = (event.clientX - startX) / scale;

      // Menghitung perubahan posisi vertikal mouse.
      const dy = (event.clientY - startY) / scale;

      // Mengupdate seluruh element.
      setElements((currentElements) =>
        currentElements.map((item) => {
          // Hanya element yang sedang di-drag yang diubah.
          if (item.id === id) {
            return {
              // Mempertahankan data element lainnya.
              ...item,

              // Mengubah posisi horizontal element.
              x: startElementX + dx,

              // Mengubah posisi vertikal element.
              y: startElementY + dy,
            };
          }

          // Element lain tidak mengalami perubahan.
          return item;
        }),
      );
    }

    // Function yang dijalankan ketika mouse dilepas.
    function handleMouseUp() {
      // Menghapus event mousemove setelah drag selesai.
      document.removeEventListener("mousemove", handleMouseMove);

      // Menghapus event mouseup setelah drag selesai.
      document.removeEventListener("mouseup", handleMouseUp);
    }

    // Memasang listener untuk mendeteksi pergerakan mouse.
    document.addEventListener("mousemove", handleMouseMove);

    // Memasang listener untuk mendeteksi mouse dilepas.
    document.addEventListener("mouseup", handleMouseUp);
  }

  // Mengembalikan data dan function yang dibutuhkan oleh canvas.
  return {
    elements,
    addText,
    handleMouseDown,
  };
}
