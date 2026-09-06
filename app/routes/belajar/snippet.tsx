// routes/snippets.tsx

import MainLayout from "~/components/templates/MainLayout";
import ArticleLayout from "~/components/templates/ArticleLayout";
import ArticleContent from "~/components/organisms/AarticleContent";
export default function Snippets() {
  return (
    // Layout global aplikasi
    <MainLayout>
      {/* Layout khusus halaman artikel */}
      <ArticleLayout>
        {/* Isi artikel */}
        <ArticleContent />
      </ArticleLayout>
    </MainLayout>
  );
}
