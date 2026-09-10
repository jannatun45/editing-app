// Mendefinisikan props yang diterima oleh komponen Button.
type ButtonProps = {
  children: React.ReactNode; // Text yang akan ditampilkan di dalam button.
  onclick: () => void; // Function yang dijalankan ketika button diklik.
  className?: string; // Tombol kelas tambahan untuk mengubah tampilan.
};

// membuat komponen button yang dapat digunakan kembali
export default function Button({
  children,
  onclick,
  className = "",
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onclick}
      className={`px-2 py-1 text-white rounded-tl-xl rounded-br-md ${className}`}
    >
      {children}
    </button>
  );
}
