// app/components/organisms/DesignCanvas.tsx

// Mengimpor RefObject untuk menerima reference dari parent.
import type { RefObject } from "react";

// Mengimpor tipe element canvas.
import type { CanvasElement } from "../../types/canvas";
import Table from "./Table";

// Props yang dibutuhkan oleh DesignCanvas.
type DesignCanvasProps = {
  // Reference menuju paper yang akan didownload.
  paperRef: RefObject<HTMLDivElement | null>;

  // Scale yang dihitung oleh custom hook.
  scale: number;

  // Semua element yang berada di canvas.
  elements: CanvasElement[];

  // Function ketika sebuah element mulai di-drag.
  onMouseDown: (event: React.MouseEvent, id: number) => void;
};

// Organism yang bertanggung jawab terhadap tampilan canvas.
export default function DesignCanvas({
  paperRef,
  scale,
  elements,
  onMouseDown,
}: DesignCanvasProps) {
  return (
    // Wrapper canvas yang mengikuti ukuran layar.
    <div className="min-h-[calc(100vh-64px)] flex justify-center items-start p-6 overflow-hidden">
      {/* Container yang melakukan scaling terhadap canvas. */}
      <div
        style={{
          // Lebar asli canvas sebelum scale.
          width: "1080px",

          // Tinggi asli canvas sebelum scale.
          height: "1920px",

          // Melakukan scaling berdasarkan ukuran layar.
          transform: `scale(${scale})`,

          // Scaling dilakukan dari bagian atas tengah.
          transformOrigin: "top center",
        }}
      >
        {/* Paper utama yang nantinya akan diubah menjadi PNG. */}
        <div
          ref={paperRef}
          className="relative w-[1080px] h-[1920px] bg-white px-12 py-24 text-gray-600 shadow-lg rounded-tl-3xl"
        >
          {/* Container isi paper. */}
          <div className="flex h-full w-full flex-col items-center">
            {/* Bagian judul klasemen. */}
            <div className="mb-20 flex flex-col items-center">
              {/* Judul utama. */}
              <h1 className="text-6xl font-bold">Klasemen Pekan 21</h1>

              {/* Nama kompetisi. */}
              <h2 className="text-5xl">BRI Liga 1 2026/2027</h2>
            </div>

            {/* Table klasemen. */}
            <Table />

            {/* Melakukan render semua element yang dibuat user. */}
            {elements.map((element) => (
              // Container setiap element yang dapat dipindahkan.
              <div
                key={element.id}
                className="absolute cursor-move"
                style={{
                  // Menentukan posisi horizontal element.
                  left: element.x,

                  // Menentukan posisi vertikal element.
                  top: element.y,
                }}
                onMouseDown={(event) => onMouseDown(event, element.id)}
              >
                {/* Menampilkan isi element text. */}
                <h2 className="bg-red-200 px-2.5 rounded-tl-md">
                  {element.content}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
