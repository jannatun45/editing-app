// import Button from "../atoms/Button";

import { Download } from "lucide-react";

type CanvasActionsProps = {
  onDownload: () => void;
};

export default function CanvasActions({ onDownload }: CanvasActionsProps) {
  return (
    <button
      type="button"
      onClick={onDownload}
      className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-white"
    >
      <Download size={18} />
      Download
    </button>
  );
}
// // mendefinisikan props yang diperlukan oleh canvasactions
// type CanvasActionsProps = {
//   onAddText: () => void; // function untuk menambahkan element text
//   onDownload: () => void; // function untuk download canvas
// };

// // membuat kumpulan
// export default function CanvasAction({
//   onAddText,
//   onDownload,
// }: CanvasActionsProps) {
//   return (
//     <div className="flex gap-2 mt-4">
//       {/* button untuk menambahakan text ke canvas */}
//       <Button onClick={onAddText} className="bg-blue-400 hover:bg-blue-600">
//         + tambah teks
//       </Button>

//       {/* button untuk mendownoad canvas menjadi PNG */}
//       <Button onClick={onDownload} className="bg-green-400 hover:bg-green-600">
//         download PNG
//       </Button>
//     </div>
//   );
// }
