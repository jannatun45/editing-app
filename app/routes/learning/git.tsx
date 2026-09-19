// routes/snippets.tsx

import ArticleLayout from "~/components/templates/ArticleLayout";
import { snippetTopics } from "~/data/sidenav/snippets";
import GitContent from "~/components/pages/GitContent";

export default function Snippets() {
  return (
    <ArticleLayout topics={snippetTopics}>
      {/* Isi artikel */}
      <GitContent />
    </ArticleLayout>
  );
}
