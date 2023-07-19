import React, { RefObject } from "react";
import { MemoizedReactMarkdown } from "~/components/markdown";
import { CodeBlock } from "~/components/ui/codeblock";
import ScrollToTopButton from "~/components/ui/ScrollToTopButton";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import ArticleHeader from "~/components/Content/ArticleHeader";
import ListView from "./ListView";
import hdate from "human-date";
import { OrganicResultWithDiffbot } from "~/types";

interface ArticleComponentProps {
  selectedResult: OrganicResultWithDiffbot | null;
  scrollContainerRef: RefObject<HTMLDivElement>;
}

const ArticleComponent: React.FC<ArticleComponentProps> = ({
  selectedResult,
  scrollContainerRef,
}) => {
  return (
    selectedResult && (
      <div className="mr-8 rounded-xl bg-white p-6 shadow-md">
        <div className=" px-4">
          {" "}
          {/* ml-4 TODO */}
          <ArticleHeader
            date={hdate.prettyPrint(selectedResult.diffbotAPIResponse?.date)}
            author={selectedResult.diffbotAPIResponse?.author}
            source={selectedResult.diffbotAPIResponse?.url.split("/")[2]}
            minutesToRead={
              selectedResult.diffbotAPIResponse?.markdown
                ? (
                    selectedResult.diffbotAPIResponse?.markdown?.split(" ")
                      .length / 200
                  ).toFixed(0)
                : "0"
            }
            title={selectedResult.diffbotAPIResponse?.title}
            fullSource={selectedResult.diffbotAPIResponse?.url}
          />
          {
            // check if type is list
            selectedResult.diffbotAPIResponse?.type === "list" && (
              <div className="mt-2">
                <ListView
                  data={selectedResult.diffbotAPIResponse.items ?? []}
                />
              </div>
            )
          }
          <div className="ml-4 flex-1 space-y-2 overflow-hidden px-1">
            <MemoizedReactMarkdown
              className="prose w-full max-w-none break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0"
              remarkPlugins={[remarkGfm, remarkMath]}
              components={{
                p({ children }) {
                  return (
                    <p
                      className="mb-4 text-gray-800 last:mb-0"
                      style={{
                        letterSpacing: "-0.003em",
                        lineHeight: "1.5",
                        fontSize: "20px",
                        fontFamily: "Georgia, serif",
                        textAlign: "left",
                        display: "block",
                        marginBlockStart: "1em",
                        marginBlockEnd: "1em",
                        marginInlineStart: "0px",
                        marginInlineEnd: "0px",
                      }}
                    >
                      {children}
                    </p>
                  );
                },
                img({ children, ...props }) {
                  if (props.src === undefined || props.src === "") {
                    return null;
                  }
                  return (
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        overflow: "hidden",
                        border: "1px solid #ddd",
                        boxShadow: "2px 2px 4px 0px rgba(0,0,0,0.10)",
                        borderRadius: "4px",
                        backgroundColor: "#f3f3f3",
                        transition: "transform 0.3s",
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    >
                      <img
                        {...props}
                        loading="lazy"
                        alt="Describe the image content"
                        style={{
                          position: "relative",
                          maxWidth: "95%",
                          maxHeight: "100%",
                          objectFit: "contain",
                          transition: "opacity 0.5s",
                          borderRadius: "4px",
                          // opacity: 0,
                          animation: "fadein 2s forwards",
                        }}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: 0,
                          bottom: 0,
                          left: 0,
                          right: 0,
                          backgroundColor: "rgba(0,0,0,0.5)",
                          opacity: 0,
                          transition: "opacity 0.3s",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          // Replace with your icon
                          backgroundImage: 'url("yourIconURL")',
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center",
                        }}
                      />
                      <noscript>
                        <style>{`
                                @keyframes fadein {
                                  from { opacity: 0; }
                                  to   { opacity: 1; }
                                }
                              `}</style>
                      </noscript>
                    </div>
                  );
                },

                code({ node, inline, className, children, ...props }) {
                  if (children.length) {
                    if (children[0] == "▍") {
                      return (
                        <span className="mt-1 animate-pulse cursor-default">
                          ▍
                        </span>
                      );
                    }

                    children[0] = (children[0] as string).replace("`▍`", "▍");
                  }

                  const match = /language-(\w+)/.exec(className || "");

                  if (inline) {
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  }

                  return (
                    <CodeBlock
                      key={Math.random()}
                      language={(match && match[1]) || ""}
                      value={String(children).replace(/\n$/, "")}
                      style={{
                        transition: "all 0.3s",
                        opacity: 0,
                        animation: "fadein 0.5s forwards",
                      }}
                      {...props}
                    />
                  );
                },
              }}
            >
              {selectedResult.diffbotAPIResponse?.markdown as string}
            </MemoizedReactMarkdown>
          </div>
        </div>
        <ScrollToTopButton scrollContainerRef={scrollContainerRef} />
      </div>
    )
  );
};

export default ArticleComponent;
