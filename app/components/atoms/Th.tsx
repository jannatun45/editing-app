// Mendefinisikan props yang diterima oleh komponen Th.
type ParagrafProps = {
  children: React.ReactNode; // Text yang akan ditampilkan di dalam Th.
  className?: string; // Tombol kelas tambahan untuk mengubah tampilan.
};

// membuat komponen Th yang dapat digunakan kembali
export default function Th({ children, className = "" }: ParagrafProps) {
  return (
    <th
      className={`className="whitespace-nowrap border-b border-gray-200 px-4 py-3 text-center text-xl font-semibold uppercase tracking-wide text-gray-500" ${className}`}
    >
      {children}
    </th>
  );
}
