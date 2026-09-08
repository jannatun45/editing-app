// components/organisms/ArticleContent.tsx

import ArticleHeader from "../molecules/ArticleHeader";
import ArticleSection from "../molecules/ArticleSection";
import CodeBlock from "../molecules/CodeBlock";

export default function SnippetContent() {
  return (
    <article>
      <ArticleHeader
        eyebrow="React Tutorial"
        title="React Snippets"
        description="Reusable React snippets for your daily development."
      />

      {/* INTRODUCTION */}
      <ArticleSection id="introduction" title="Introduction">
        <p>
          React snippets adalah potongan kode yang dapat digunakan kembali untuk
          mempercepat proses development.
        </p>

        <p>
          Snippet membantu developer mengurangi penulisan kode yang sama
          berulang kali.
        </p>
      </ArticleSection>

      {/* USE STATE */}
      <ArticleSection id="usestate" title="useState">
        <p>
          useState digunakan untuk menyimpan dan mengubah state pada functional
          component.
        </p>

        {/* Source code contoh useState */}
        <CodeBlock
          code={`import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`}
        />

        <h3 className="text-xl font-semibold">How to use</h3>

        <p>
          Gunakan useState ketika component memiliki data yang dapat berubah
          selama aplikasi berjalan.
        </p>
      </ArticleSection>

      {/* USE EFFECT */}
      <ArticleSection id="useeffect" title="useEffect">
        <p>
          useEffect digunakan untuk menjalankan side effect setelah component
          melakukan render.
        </p>

        <CodeBlock
          code={`import { useEffect } from "react";

useEffect(() => {
  console.log("Component rendered");
}, []);`}
        />
      </ArticleSection>

      {/* CONDITIONAL RENDERING */}
      <ArticleSection id="conditional-rendering" title="Conditional Rendering">
        <p>
          Conditional rendering digunakan untuk menampilkan component
          berdasarkan kondisi tertentu.
        </p>

        <CodeBlock
          code={`{isLoggedIn ? (
  <Dashboard />
) : (
  <Login />
)}`}
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
