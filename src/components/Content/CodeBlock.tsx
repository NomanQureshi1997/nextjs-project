import React, { useRef, useState, ReactNode } from 'react';
import Clipboard from '~/components/svg/Clipboard';
import CheckMark from '~/components/svg/CheckMark';

interface CodeBlockProps {
  lang: string;
  codeChildren: ReactNode;
}



const CodeBlock: React.FC<CodeBlockProps> = ({ lang, codeChildren }) => {
  const codeRef = useRef<HTMLElement>(null);

  return (
    <div className="rounded-md bg-black text-gray-100">
      <CodeBar lang={lang} codeRef={codeRef} />
      <div className="overflow-y-auto p-4">
        <code ref={codeRef} className={`hljs !whitespace-pre language-${lang}`}>
          {codeChildren}
        </code>
      </div>
    </div>
  );
};

interface CodeBarProps {
  lang: string;
  codeRef: React.RefObject<HTMLElement>;
}

const CodeBar: React.FC<CodeBarProps> = React.memo(({ lang, codeRef }) => {
  const [isCopied, setIsCopied] = useState(false);
  return (
    <div className="relative flex items-center rounded-tl-md rounded-tr-md bg-gray-800 px-4 py-2 font-sans text-xs text-gray-200">
      <span className="">{lang}</span>
      <button
        className="ml-auto flex gap-2"
        onClick={async () => {
          const codeString = codeRef.current?.textContent;
          if (codeString)
            navigator.clipboard.writeText(codeString).then(() => {
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 3000);
            });
        }}
      >
        {isCopied ? (
          <>
            <CheckMark />
            Copied!
          </>
        ) : (
          <>
            <Clipboard />
            Copy code
          </>
        )}
      </button>
    </div>
  );
});

CodeBar.displayName = 'CodeBar';

CodeBlock.displayName = 'CodeBlock';

export default CodeBlock;
