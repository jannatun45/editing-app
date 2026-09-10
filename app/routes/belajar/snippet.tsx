// routes/snippets.tsx

import MainLayout from "~/components/templates/MainLayout";
import ArticleLayout from "~/components/templates/ArticleLayout";
import SnippetContent from "~/components/organisms/SnippetContent";
import { snippetTopics } from "~/data/topics/snippets";

export default function Snippets() {
  return (
    // Layout global aplikasi
    <MainLayout>
      {/* Layout khusus halaman artikel */}
      <ArticleLayout topics={snippetTopics}>
        {/* Isi artikel */}
        <SnippetContent />
      </ArticleLayout>
    </MainLayout>
  );
}
