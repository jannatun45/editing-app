import { useEffect, useState } from "react";

const CANVAS_WIDTH = 1080; // menentukan ukuran asli canvas
const CANVAS_HEIGHT = 1920; // menentukan tinggi asli canvas

// costum hook untuk menghitung scale canvas secara otomatis
export default function useCanvasScale() {
  const [scale, setscale] = useState(1);
  useEffect(() => {
    function calculateScale() {
      const availableWidth = window.innerWidth - 40; // mengambil area browser yang tersedia.
      const availableHeight = window.innerHeight - 100; // mengambil tinggi area browser yang tersedia.
      const scaleX = availableWidth / CANVAS_WIDTH; // menghitung scale berdasarkan lebar canvas
      const scaleY = availableHeight / CANVAS_HEIGHT; // menghitung scale berdasarkan tinggi canvas
      const newScale = Math.min(scaleX, scaleY); // mengambil scale terkecil agar canvas tetap seluruhnya terlihat.

      setscale(Math.min(newScale, 1));
    }
    calculateScale(); // menghitung scale ketika pertama kali komponen dibuat.

    // Menghitung ulang scale ketika ukuran browser berubah.
    window.addEventListener("resize", calculateScale);

    // Membersihkan event listener ketika component dihancurkan.
    return () => {
      window.removeEventListener("resize", calculateScale);
    };
  }, []);
  return scale;
}
