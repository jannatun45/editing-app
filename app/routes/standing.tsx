// app/routes/home.tsx

// Mengimpor tipe route dari React Router.
import type { Route } from "./+types/home";

// Mengimpor useRef dari React.
import { useRef } from "react";

// Mengimpor template utama aplikasi.
import MainLayout from "~/components/templates/MainLayout";

// Mengimpor organism canvas.
import DesignCanvas from "~/components/organisms/DesignCanvas";

// Mengimpor organism sidebar.
import Aside from "~/components/organisms/Aside";

// Mengimpor molecule action canvas.
import CanvasActions from "~/components/molecules/CanvasActions";

// Mengimpor custom hook untuk mengatur scale canvas.
import useCanvasScale from "~/hooks/useCanvasScale";

// Mengimpor custom hook untuk mengatur element canvas.
import useCanvasElements from "~/hooks/useCanvasElements";

// Mengimpor utility untuk download PNG.
import { downloadImage } from "~/utils/downloadImage";

// Mengatur metadata halaman.
export function meta({}: Route.MetaArgs) {
  return [
    // Menentukan title browser.
    { title: "League Super - Standing" },

    // Menentukan description halaman.
    {
      name: "description",
      content: "League Super standing design editor",
    },
  ];
}

// Page utama untuk editor klasemen.
export default function Standing() {
  // Reference menuju paper yang akan diexport.
  const paperRef = useRef<HTMLDivElement>(null);

  // Mengambil scale otomatis dari custom hook.
  const scale = useCanvasScale();

  // Mengambil data dan function element dari custom hook.
  const { elements, addText, handleMouseDown } = useCanvasElements(scale);

  // Function untuk melakukan download canvas.
  async function handleDownload() {
    // Menghentikan function jika paper belum tersedia.
    if (!paperRef.current) return;

    try {
      // Menjalankan utility download PNG.
      await downloadImage(paperRef.current, "klasemen-pekan-21.png");
    } catch (error) {
      // Menampilkan error apabila proses download gagal.
      console.error("Gagal download:", error);
    }
  }

  return (
    // Template utama aplikasi.
    <>
      {/* Organism utama editor canvas. */}
      <DesignCanvas
        paperRef={paperRef}
        scale={scale}
        elements={elements}
        onMouseDown={handleMouseDown}
      />

      {/* Molecule yang berisi tombol editor. */}
      <CanvasActions onAddText={addText} onDownload={handleDownload} />

      {/* Organism sidebar editor. */}
      <Aside />
    </>
  );
}
