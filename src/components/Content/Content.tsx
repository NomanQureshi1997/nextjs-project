import React, { ReactNode, FC } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import CodeBlock from "./CodeBlock";
import { langSubset } from "~/lib/languages.mjs";
import { PluggableList } from 'unified';

interface ContentProps {
  content: string;
}

const Content: FC<ContentProps> = React.memo(({ content }) => {
  const rehypePlugins: PluggableList = [
    [rehypeKatex, { output: "mathml" }],
    [
      rehypeHighlight,
      {
        detect: true,
        ignoreMissing: true,
        subset: langSubset,
      },
    ],
    [rehypeRaw],
  ];

  // const components: Components = {
  //   code,
  //   p,
  //   // em
  // };

  return (
    <div className="text-lg bg-gray-200 rounded-md text-gray-800 p-6">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          [remarkMath, { singleDollarTextMath: false }],
        ]}
        rehypePlugins={rehypePlugins} 
        linkTarget="_new"
        /* eslint-disable react/display-name */
        components={{
          code({ node, inline, className, children, ...props }) {
            if (children.length) {
              if (children[0] == '▍') {
                return <span className="animate-pulse cursor-default mt-1">▍</span>
              }

              children[0] = (children[0] as string).replace("`▍`", "▍")
            }

            const match = /language-(\w+)/.exec(className || '');

            return !inline ? (
              <CodeBlock
                key={Math.random()}
                lang = {(match && match[1]) || 'text'}
                codeChildren={children}
                {...props}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          table({ children }) {
            return (
              <table className="border-collapse border border-black px-3 py-1 dark:border-white">
                {children}
              </table>
            );
          },
          th({ children }) {
            return (
              <th className="break-words border border-black bg-gray-500 px-3 py-1 text-white dark:border-white">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="break-words border border-black px-3 py-1 dark:border-white">
                {children}
              </td>
            );
          },
          p({ children }) {
            return <p className="mb-2 whitespace-pre-wrap">{children}</p>;
          }
        }}
        /* eslint-enable react/display-name */
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

// interface CodeProps {
//   inline?: boolean;
//   className?: string;
//   children?: ReactNode;
// }

// const code: FC<CodeProps> = React.memo((props) => {
//   const { inline, className, children } = props;
//   const match = /language-(\w+)/.exec(className || "");
//   const lang = match && match[1];

//   if (inline) {
//     return <code className={className}>{children}</code>;
//   } else {
//     return <CodeBlock lang={lang || "text"} codeChildren={children} />;
//   }
// });

// interface PProps {
//   children?: ReactNode;
// }

//   const p: FC<PProps> = React.memo((props) => {
//     return <p className="mb-2 whitespace-pre-wrap">{props?.children}</p>;
//   });

Content.displayName = "Content";

export default Content;
