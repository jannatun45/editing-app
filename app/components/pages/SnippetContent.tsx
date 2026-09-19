// components/organisms/ArticleContent.tsx

import Strong from "../atoms/Strong";
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
          Gunakan <Strong>useStateSnippet→</Strong> ketika component memiliki
          data yang dapat berubah selama aplikasi berjalan.
        </p>
        {/* Source code contoh useState */}
        <CodeBlock code={`const [state, setState] = useState(initialValue)`} />
      </ArticleSection>

      {/* USE EFFECT */}
      <ArticleSection id="useeffect" title="useEffect">
        <section>
          <p>
            gunakan <Strong>useEffectSnippet→</Strong> pada React untuk
            menjalankan side effeck (efek samping) setelah komponen dirender.
          </p>
          <h2 className="my-2 text-[17px] font-bold">
            {" "}
            Apa itu <Strong>side effect ?</Strong>{" "}
          </h2>
          <p className="mb-4">
            Side effect adalah pekerjaan yang berhubungan dengan sesuatu di luar
            proses render React, misalnya:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Mengambil data dari API</li> <li>Mengubah judul halaman</li>
            <li>Memasang event listener</li> <li>Menjalankan timer</li>
            <li>Membaca atau mengubah DOM</li>
            <li>
              Menyimpan data ke <code>localStorage</code>
            </li>
          </ul>
        </section>

        <section>
          <p className="mb-4">
            <Strong>useEffect</Strong> digunakan ketika React perlu melakukan
            pekerjaan setelah proses render, terutama pekerjaan yang berhubungan
            dengan sesuatu di luar proses render React.
          </p>

          <CodeBlock
            code={`import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    document.title = "Halaman Home";
  }, []);

  return <h1>Home</h1>;
}`}
          />
          <p className="mb-2">Artinya:</p>

          <ol className="mb-6 list-decimal space-y-2 pl-6">
            <li>
              Komponen <code>Home</code> dirender.
            </li>
            <li>
              React menjalankan kode di dalam <code>useEffect</code>.
            </li>
            <li>
              Judul tab browser berubah menjadi <code>Halaman Home</code>.
            </li>
            <li>
              Karena dependency array-nya <code>[]</code>, effect dijalankan
              setelah komponen pertama kali muncul.
            </li>
          </ol>

          <h2 className="mb-4 text-xl font-bold">Arti dependency array</h2>

          <h3 className="mb-3 text-lg font-semibold">
            1. Tanpa dependency array
          </h3>

          <pre className="mb-4 overflow-x-auto rounded-lg bg-zinc-900 p-4">
            <code>{`useEffect(() => {
  console.log("Dijalankan");
});`}</code>
          </pre>

          <p className="mb-6">
            Effect dijalankan setelah setiap render komponen, termasuk ketika
            komponen melakukan render ulang.
          </p>

          <h3 className="mb-3 text-lg font-semibold">
            2. Dependency array kosong
          </h3>

          <pre className="mb-4 overflow-x-auto rounded-lg bg-zinc-900 p-4">
            <code>{`useEffect(() => {
  console.log("Dijalankan sekali");
}, []);`}</code>
          </pre>

          <p className="mb-6">
            Effect dijalankan setelah komponen pertama kali muncul.
          </p>

          <h3 className="mb-3 text-lg font-semibold">3. Memiliki dependency</h3>

          <pre className="mb-4 overflow-x-auto rounded-lg bg-zinc-900 p-4">
            <code>{`const [count, setCount] = useState(0);

useEffect(() => {
  console.log("Count berubah:", count);
}, [count]);`}</code>
          </pre>

          <p className="mb-6">
            Effect dijalankan ketika nilai <code>count</code> berubah.
          </p>

          <h2 className="mb-4 text-xl font-bold">Contoh mengambil data API</h2>

          <pre className="mb-4 overflow-x-auto rounded-lg bg-zinc-900 p-4">
            <code>{`import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, []);

  return (
    <div>
      {products.map((product) => (
        <p key={product.id}>{product.name}</p>
      ))}
    </div>
  );
}`}</code>
          </pre>

          <p className="mb-2">Alurnya:</p>

          <pre className="mb-6 overflow-x-auto rounded-lg bg-zinc-900 p-4">
            <code>{`Komponen muncul
      ↓
useEffect dijalankan
      ↓
Request ke API
      ↓
Data diterima
      ↓
setProducts(data)
      ↓
Komponen render ulang
      ↓
Data ditampilkan`}</code>
          </pre>

          <h2 className="mb-4 text-xl font-bold">Contoh cleanup</h2>

          <p className="mb-4">
            Jika <code>useEffect</code> memasang sesuatu yang harus dihentikan,
            gunakan <code>return</code> untuk membuat cleanup function.
          </p>

          <pre className="mb-4 overflow-x-auto rounded-lg bg-zinc-900 p-4">
            <code>{`useEffect(() => {
  const timer = setInterval(() => {
    console.log("Timer berjalan");
  }, 1000);

  return () => {
    clearInterval(timer);
  };
}, []);`}</code>
          </pre>

          <p className="mb-6">
            <code>return</code> tersebut disebut
            <strong>cleanup function</strong>. Cleanup dijalankan ketika
            komponen dihapus dari halaman atau sebelum effect dijalankan
            kembali.
          </p>

          <h2 className="mb-4 text-xl font-bold">Kesimpulan</h2>

          <p>
            <code>useEffect</code> digunakan ketika React perlu melakukan
            pekerjaan setelah render, terutama pekerjaan seperti mengambil data,
            menjalankan timer, memasang event listener, atau melakukan
            sinkronisasi dengan browser.
          </p>
        </section>

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
