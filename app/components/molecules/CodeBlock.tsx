// components/molecules/CodeBlock.tsx

type CodeBlockProps = {
  code: string;
};

export default function CodeBlock({ code }: CodeBlockProps) {
  return (
    // Container untuk menampilkan source code
    <pre className="overflow-x-auto rounded-lg p-4 text-zinc-400 bg-zinc-900 text-xs mx-8 mb-8">
      {/* code menjaga formatting/spasi dari source code */}
      <code>{code}</code>
    </pre>
  );
}
