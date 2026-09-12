// Mendefinisikan props yang diterima oleh komponen Button.
type ParagrafProps = {
  children: React.ReactNode; // Text yang akan ditampilkan di dalam button.
  id?: string;
  className?: string; // Tombol kelas tambahan untuk mengubah tampilan.
};

// membuat komponen button yang dapat digunakan kembali
export default function H2({ children, id, className = "" }: ParagrafProps) {
  return (
    <h2
      id={id}
      className={`scroll-mt-2px" rounded-tl-md rounded-br-md mb-4 w-fit px-3 py-0.5 bg-zinc-600 text-zinc-950 text-sm font-bold ${className}`}
    >
      {children}
    </h2>
  );
}
