// components/molecules/ArticleHeader.tsx

type ArticleHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export default function ArticleHeader({
  eyebrow,
  title,
  description,
}: ArticleHeaderProps) {
  return (
    // Header khusus untuk bagian pembuka artikel
    <header className="mb-16">
      {/* Label kecil di atas judul */}
      <p className="mb-3 text-sm uppercase tracking-[0.3em] text-gray-400">
        {eyebrow}
      </p>

      {/* Judul utama artikel */}
      <h1 className="text-5xl font-black uppercase tracking-wider">{title}</h1>

      {/* Deskripsi singkat artikel */}
      <p className="mt-5 max-w-2xl text-gray-400">{description}</p>
    </header>
  );
}
