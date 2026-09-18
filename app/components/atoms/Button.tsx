// Mendefinisikan props yang diterima oleh komponen Button.
type ButtonProps = {
  children: React.ReactNode; // Text yang akan ditampilkan di dalam button.
  onClick: () => void; // Function yang dijalankan ketika button diklik.
  className?: string; // Tombol kelas tambahan untuk mengubah tampilan.
};

// membuat komponen button yang dapat digunakan kembali
export default function Button({
  children,
  onClick,
  className = "",
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`bg-blue-500 hover:bg-blue-400 px-2 py-0.5 text-sm  text-white rounded-tl-md rounded-br-md cursor-pointer ${className}`}
    >
      {children}
    </button>
  );
}
