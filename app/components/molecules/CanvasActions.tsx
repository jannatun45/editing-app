import Button from "../atoms/Button";

// mendefinisikan props yang diperlukan oleh canvasactions
type CanvasActionsProps = {
  onAddText: () => void; // function untuk menambahkan element text
  onDownload: () => void; // function untuk download canvas
};

// membuat kumpulan
export default function CanvasAction({
  onAddText,
  onDownload,
}: CanvasActionsProps) {
  return (
    <div className="flex gap-2 mt-4">
      {/* button untuk menambahakan text ke canvas */}
      <Button onclick={onAddText} className="bg-blue-400 hover:bg-blue-600">
        + tambah teks
      </Button>

      {/* button untuk mendownoad canvas menjadi PNG */}
      <Button onclick={onDownload} className="bg-green-400 hover:bg-green-600">
        download PNG
      </Button>
    </div>
  );
}
