// components/organisms/ArticleContent.tsx

import Strong from "../atoms/Strong";
import ArticleHeader from "../molecules/ArticleHeader";
import ArticleSection from "../molecules/ArticleSection";
import CodeBlock from "../molecules/CodeBlock";
import P from "../atoms/P";

export default function GitContent() {
  return (
    <article>
      <ArticleHeader
        eyebrow="Git Tutorial"
        title="Use Git & GitHub"
        description="How to use Git properly and effectively."
      />

      {/* git stash */}
      <ArticleSection id="stash" title="git stash">
        <p>
          membersihkan code atau Ketika sudah melakukan banyak edit dan belum
          disimpan, lalu ingin codenya seperti awal ( sebelum commit ) maka
          jalankan ini <Strong>git stash</Strong>
        </p>
        <p>
          Misalnya kamu sedang di branch <Strong>football:</Strong>
        </p>
        <CodeBlock
          code={`football
   ↓
code awal
   ↓
kamu edit banyak file
   ↓
code sekarang sudah banyak perubahan`}
        />
        <p>
          untuk mengembalikan cide tadi <Strong>maka gunakan lah</Strong>
        </p>
        <CodeBlock code={`git stash pop`} />
        <p>Maka:</p>
        <CodeBlock
          code={`code awal
   +
perubahan yang tadi di-stash
   ↓
code kamu kembali seperti sebelum git stash`}
        />
      </ArticleSection>
      {/* EVENT HANDLER */}
      <ArticleSection id="event-handler" title="Event Handler">
        <p>
          Event handler digunakan untuk menangani interaksi pengguna seperti
          click, change, dan submit.
        </p>

        <CodeBlock
          code={`function handleClick() {
  console.log("Button clicked");
}

<button onClick={handleClick}>
  Click Me
</button>`}
        />
      </ArticleSection>
    </article>
  );
}
