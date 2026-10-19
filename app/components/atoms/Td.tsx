// Mendefinisikan props yang diterima oleh komponen Td.
type ParagrafProps = {
  children: React.ReactNode; // Text yang akan ditampilkan di dalam Td.
  className?: string; // Tombol kelas tambahan untuk mengubah tampilan.
  spanClassName?: string; // Tombol kelas tambahan untuk mengubah tampilan span.
};

// membuat komponen Td yang dapat digunakan kembali
export default function Td({
  children,
  className = "",
  spanClassName = "",
}: ParagrafProps) {
  return (
    <td className={`whitespace-nowrap px-4 py-4 text-2xl ${className}`}>
      <span className={`   ${spanClassName}`}>{children}</span>
    </td>
  );
}
