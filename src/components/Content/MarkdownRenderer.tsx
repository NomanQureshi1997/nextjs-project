import React from "react";
import { MemoizedReactMarkdown } from "~/components/markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import cn from "classnames"; // replace with the correct import
import { CodeBlock } from "~/components/ui/codeblock";
import { OrganicResultWithDiffbot } from "~/types";
import { ReactNode, useMemo } from "react";
import { RefIcon } from "./RefIcon";
import { useSearchResultsStore } from "@/src/store/searchResultsContext";
import { type Message } from "ai/react";

// Define your custom types here
interface ComponentTypes {
  className?: string;
  [key: string]: any;
}

interface MarkdownRendererProps {
  organicResultsWithDiffbot: OrganicResultWithDiffbot[];
  messages: Message[];
  index: number;
  activeMessageId: string;
  content: string;
}

const getTextContent = (children: ReactNode): string => {
    if (!children) {
      return "";
    }
  
    if (typeof children === "string") {
      return children;
    }
  
    if (Array.isArray(children)) {
      return children.map(getTextContent).join(" ");
    }
  
    if (React.isValidElement(children)) {
      return getTextContent(children.props.children);
    }
  
    return "";
  };
  
  // console.log(transformString("[1.a-c] hadh")); // logs "[1.a][1.c] hadh"
  // console.log(transformString("[<1.a>] hadh")); // logs "[1.a] hadh"
  
  // // more test cases
  // console.log(transformString("[5.b-e] and [10.z-a]")); // logs "[5.b][5.e] and [10.z][10.a]"
  // console.log(transformString("[2.a-b] in [<hello>] world")); // logs "[2.a][2.b] in [hello] world"
  // console.log(transformString("It's [<1.z>] or [3.y-x]")); // logs "It's [1.z] or [3.y][3.x]"
  // console.log(transformString("Test [<12345678>]")); // logs "Test [12345678]"


function handleReferences(
    children: ReactNode,
    organicResultsWithDiffbot: OrganicResultWithDiffbot[],
    messageId: string
    // isLoading: boolean
  ) {
    return useMemo(() => {
      const relevantResults = organicResultsWithDiffbot.filter(
        (result) => result.messageId === messageId
      );
  
      const newChildren = React.Children.toArray(children).map((child, index) => {
        // console.log(isLoading);
        if (relevantResults.length === 0) {
          // console.log("relevantResults is empty");
          return child;
        }
  
        if (typeof child === "string") {
          const parts = child.split(/(\[\d+\.[a-z]\])/g);
  
          return parts.map((part, i) => {
            const match = part.match(/\[(\d+\.[a-z])\]/);
  
            // console.log(match, "match");
  
            if (match) {
              const refId = match[1];
              // console.log(refId, "refId");
  
              // Find the result containing the matched snippet
              let refResult: OrganicResultWithDiffbot | undefined;
              let refLink;
              let chosenSnippet: string | undefined;
  
              relevantResults.some((result) => {
                const foundSnippet = result.extraSnippets?.find(
                  (snippet) => snippet.snippetAlphaID === refId
                );
                if (foundSnippet || result.snippet.snippetAlphaID === refId) {
                  refResult = result;
                  refLink = result.link;
                  chosenSnippet = foundSnippet?.text || result.snippet.text;
                  return true; // Stop iteration
                }
                return false;
              });
  
              // console.log(results, "results");
  
              if (!refResult) {
                console.error(`Could not find a result in ${relevantResults}
                for refId ${refId} type of relevantResults is ${typeof relevantResults}`);
              }
  
              return (
                <span key={`${index}-${i}`}>
                  <RefIcon
                    refNum={refId || ""}
                    refLink={refLink || ""}
                    refResult={refResult}
                    isLoading={false} // TODO can't remember why this is here
                    chosenSnippet={chosenSnippet}
                  />
                </span>
              );
            }
  
            return (
              <span
                style={{
                  fontSize: "1.02rem",
                  lineHeight: "1.6",
                  color: "#333",
                  fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                  letterSpacing: "0.009em",
                }}
                key={`${index}-${i}`}
              >
                {part}
              </span>
            );
          });
        } else if (React.isValidElement(child)) {
          // Handle the case where the child is a React element
          // You could return the child directly, or perform some processing on it
          return child;
        } else {
          console.warn(
            `Child ${index} is not a string. It is a ${typeof child}:`,
            child
          );
          return child;
        }
      });
  
      return newChildren;
    }, [children, organicResultsWithDiffbot]);
  }
  

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  organicResultsWithDiffbot,
  messages,
  index,
  activeMessageId,
  content,
}) => {
    const { onSubmit } = useSearchResultsStore(state => ({ onSubmit: state.onSubmit }));
  
    return (
  <MemoizedReactMarkdown
    className="prose mb-6 mt-2 w-full max-w-none break-words text-left dark:prose-invert prose-p:leading-relaxed prose-pre:p-0
"
    remarkPlugins={[remarkGfm, remarkMath]}
    rehypePlugins={[rehypeKatex]}
    components={{
      h1: ({ className, ...props }: ComponentTypes) => (
        <h1
          className={cn(
            "mt-2 scroll-m-20 text-3xl font-bold tracking-tight ",
            className
          )}
        >
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </h1>
      ),
      h2: ({ className, ...props }: ComponentTypes) => (
        <h2
          className={cn(
            "mt-6 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight first:mt-0",
            className
          )}
        >
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </h2>
      ),
      h3: ({ className, ...props }: ComponentTypes) => (
        <h3
          className={cn(
            "mt-4 scroll-m-20 text-lg font-medium tracking-tight",
            className
          )}
          {...props}
        >
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </h3>
      ),
      h4: ({ className, ...props }: ComponentTypes) => (
        <h4
          className={cn(
            "text-md mt-4 scroll-m-20 font-medium tracking-tight",
            className
          )}
          {...props}
        >
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </h4>
      ),
      h5: ({ className, ...props }: ComponentTypes) => (
        <h5
          className={cn(
            "text-md mt-4 scroll-m-20 font-medium tracking-tight",
            className
          )}
          {...props}
        >
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </h5>
      ),
      h6: ({ className, ...props }: ComponentTypes) => (
        <h6
          className={cn(
            "mt-4 scroll-m-20 text-base font-medium tracking-tight",
            className
          )}
          {...props}
        >
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </h6>
      ),
      a: ({ className, href, ...props }: ComponentTypes) => {
        const isHashURL = href?.includes("#"); // Ex. https://example.com#section
        return (
          <a
            className={cn(
              "font-medium underline underline-offset-4",
              className
            )}
            href={href}
            target={isHashURL ? "_self" : "_blank"}
          >
            {handleReferences(
              props.children,
              organicResultsWithDiffbot,
              (messages[index - 1]?.role === "user" &&
                messages[index - 1]?.id) ||
                activeMessageId
            )}
          </a>
        );
      },
      p: ({ className, ...props }: ComponentTypes) => {
        return (
          <p
            className={cn("leading-7 [&:not(:first-child)]:mt-6", className)}
            {...props}
          >
            {handleReferences(
              props.children,
              organicResultsWithDiffbot,
              (messages[index - 1]?.role === "user" &&
                messages[index - 1]?.id) ||
                activeMessageId
            )}
          </p>
        );
      },
      strong: ({ className, ...props }: ComponentTypes) => {
        const handleClick = () => {
          console.log(`Clicked on ${props.children}`);
          onSubmit(getTextContent(props.children));
        };

        return (
          <strong
            className={cn(
              "cursor-pointer font-normal text-gray-500 underline transition-colors duration-200 ease-in-out hover:text-blue-500  focus:outline-none focus:ring-2 focus:ring-blue-500 active:text-blue-700",
              className
            )}
            onClick={handleClick}
            {...props}
          >
            {handleReferences(
              props.children,
              organicResultsWithDiffbot,
              (messages[index - 1]?.role === "user" &&
                messages[index - 1]?.id) ||
                activeMessageId
            )}
          </strong>
        );
      },

      ul: ({ className, ordered, ...props }: ComponentTypes) => (
        <ul className={cn("my-6 list-disc", className)} {...props}>
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </ul>
      ),
      ol: ({ className, ordered, ...props }: ComponentTypes) => (
        <ol className={cn("my-6 list-decimal", className)} {...props}>
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </ol>
      ),
      li: ({ className, ordered, ...props }: ComponentTypes) => (
        <li className={cn("mt-2", className)} {...props}>
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </li>
      ),
      blockquote: ({ className, ...props }: ComponentTypes) => (
        <blockquote
          className={cn(
            "mt-6 border-l-2 pl-6 italic [&>*]:text-muted-foreground",
            className
          )}
          {...props}
        >
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </blockquote>
      ),
      // img: ({
      //   className,
      //   alt,
      //   ...props
      // }: React.ImgHTMLAttributes<HTMLImageElement>) => (
      //   <img
      //     className={cn(
      //       "my-2 inline-flex rounded-md border",
      //       className
      //     )}
      //     alt={alt}
      //   >
      //     {props.children}
      //   </img>
      // ),
      img: ({
        className,
        alt,
        ...props
      }: React.ImgHTMLAttributes<HTMLImageElement>) => (
        <img
          className={cn("my-2 inline-flex rounded-md border", className)}
          alt={alt}
          {...props} // pass rest of the properties
        />
      ),

      hr: ({ ...props }: ComponentTypes) => (
        <hr className="my-4 md:my-8">{props.children}</hr>
      ),
      table: ({
        className,
        ...props
      }: React.HTMLAttributes<HTMLTableElement>) => (
        <div className="my-6 w-full rounded-lg">
          <table className={cn("w-full", className)}>
            {handleReferences(
              props.children,
              organicResultsWithDiffbot,
              (messages[index - 1]?.role === "user" &&
                messages[index - 1]?.id) ||
                activeMessageId
            )}
          </table>
        </div>
      ),
      tr: ({
        className,
        ...props
      }: React.HTMLAttributes<HTMLTableRowElement>) => (
        <tr
          className={cn("m-0 border-t p-0 even:bg-muted", className)}
          {...props}
        >
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </tr>
      ),
      th: ({ className, ...props }: ComponentTypes) => (
        <th
          className={cn(
            "border px-4 py-2 text-left font-bold  [&[align=center]]:text-center [&[align=right]]:text-right",
            className
          )}
          {...props}
        >
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </th>
      ),
      td: ({ className, ...props }: ComponentTypes) => (
        <td
          className={cn(
            "border px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right",
            className
          )}
        >
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </td>
      ),
      pre: ({ className, ...props }: ComponentTypes) => (
        <pre className={cn("mt-5 flex w-full", className)} {...props} />
      ),
      video: ({ className, children, ...props }: ComponentTypes) => (
        <video
          className={cn("my-4  inline-flex rounded-md  border", className)}
          {...props}
          controls
        >
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </video>
      ),
      em: ({ className, ...props }: ComponentTypes) => (
        <em {...props}>
          {handleReferences(
            props.children,
            organicResultsWithDiffbot,
            (messages[index - 1]?.role === "user" && messages[index - 1]?.id) ||
              activeMessageId
          )}
        </em>
      ),
      code({ node, inline, className, children, ...props }) {
        if (children.length) {
          if (children[0] == "▍") {
            return <span className="mt-1 animate-pulse cursor-default">▍</span>;
          }

          children[0] = (children[0] as string).replace("`▍`", "▍");
        }

        const match = /language-(\w+)/.exec(className || "");

        if (inline) {
          return (
            <code className={className} {...props}>
              {handleReferences(
                children,
                organicResultsWithDiffbot,
                (messages[index - 1]?.role === "user" &&
                  messages[index - 1]?.id) ||
                  activeMessageId
              )}
            </code>
          );
        }

        return (
          <CodeBlock //todo add citations to codeblock
            key={Math.random()}
            language={(match && match[1]) || ""}
            value={String(children).replace(/\n$/, "")}
            {...props}
          />
        );
      },
    }}
  >
    {content}
  </MemoizedReactMarkdown>
)};
export default MarkdownRenderer;
