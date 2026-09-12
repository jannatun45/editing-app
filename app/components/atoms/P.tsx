// Mendefinisikan props yang diterima oleh komponen Button.
type ParagrafProps = {
  children: React.ReactNode; // Text yang akan ditampilkan di dalam button.
  className?: string; // Tombol kelas tambahan untuk mengubah tampilan.
};

// membuat komponen button yang dapat digunakan kembali
export default function P({ children, className = "" }: ParagrafProps) {
  return (
    <p
      className={`indent-8 my-2  text-zinc-400 rounded-tl-xl rounded-br-xl bg-zinc-900 px-4 py-2 ${className}`}
    >
      {children}
    </p>
  );
}
