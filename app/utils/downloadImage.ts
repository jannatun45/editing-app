// app/utils/downloadImage.ts

// Mengimpor function toPng untuk mengubah HTML menjadi gambar PNG.
import { toPng } from "html-to-image";

// Function untuk mengubah element HTML menjadi file PNG dan mendownloadnya.
export async function downloadImage(
  element: HTMLElement,
  fileName = "desain.png",
) {
  // Mengubah element HTML menjadi data URL PNG.
  const dataUrl = await toPng(element, {
    // Menentukan kualitas pixel gambar.
    pixelRatio: 1,

    // Mengabaikan font eksternal agar proses export lebih stabil.
    skipFonts: true,
  });

  // Membuat element anchor sementara untuk proses download.
  const link = document.createElement("a");

  // Menentukan nama file hasil download.
  link.download = fileName;

  // Menentukan data gambar yang akan didownload.
  link.href = dataUrl;

  // Menjalankan proses download.
  link.click();
}
