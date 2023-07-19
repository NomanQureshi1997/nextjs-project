import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { OrganicResultWithDiffbot, SearchParamsType } from "@/src/types";
import { Manrope } from "next/font/google";
import { useEffect, useState, useRef, Suspense } from "react";
import { cn } from "~/lib/utils";
import React from "react";
import { SearchIcon } from "lucide-react";
import { useSearchResultsStore } from "@/src/store/searchResultsContext";
import { v4 as uuidv4 } from "uuid";
import SourceChips from "./SourceChips";
import { Button } from "@/src/components/ui/button";
import "katex/dist/katex.min.css";
import "cal-sans";
import Recommendations from "./Recommendations";
import ArticleComponent from "./ReadTabContent";
import MarkdownRenderer from "./MarkdownRenderer";
import { type Message } from "ai/react";
import { FC } from "react";

function transformString(str: string) {
  str = str.replace(/\[<(.{1,5})>\]/g, "[$1]");

  // Handle [3.c-d] to [3.c][3.d]
  str = str.replace(
    /\[(\d+)\.([a-z])-([a-z])\]/g,
    (match, number, letter1, letter2) => {
      const newStr = `[${number}.${letter1}][${number}.${letter2}]`;
      return newStr;
    }
  );

  str = str.replace(/\[\^?(.{1,5})\^\]/g, "[$1]");

  // For cases where '^' is at start or end, but not both
  str = str.replace(/\[\^(.{1,5})\]/g, "[$1]");
  str = str.replace(/\[(.{1,5})\^\]/g, "[$1]");

  return str;
}

interface Props {
  userMessageRef: React.RefObject<HTMLDivElement>;
  messages: Message[];
  isLoading: boolean;
  queries: SearchParamsType[];
}

const ChatComponent: FC<Props> = (props) => {
  const { userMessageRef, messages, isLoading, queries } = props;

  const {
    activeMessageId,
    setActiveMessageId,
    setSelectedSearchResultAlphaId,
    organicResultsWithDiffbot,
    braveResultIsLoading,
    activeQuery,
    newMessageIsLoading,
    newMessageOrBraveIsLoading,
    recommendations,
  } = useSearchResultsStore((state) => ({
    activeMessageId: state.activeMessageId,
    setActiveMessageId: state.setActiveMessageId,
    setSelectedSearchResultAlphaId: state.setSelectedSearchResultAlphaId,
    onSubmit: state.onSubmit,
    organicResultsWithDiffbot: state.organicResultsWithDiffbot,
    braveResultIsLoading: state.braveResultIsLoading,
    activeQuery: state.activeQuery,
    newMessageIsLoading: state.newMessageIsLoading,
    newMessageOrBraveIsLoading: state.newMessageOrBraveIsLoading,
    recommendations: state.recommendations,
  }));

  return (
    <>
      {/* so query is shown immediately */}
      {(newMessageOrBraveIsLoading && !newMessageIsLoading
        ? [
            ...messages,
            {
              role: "user" as const,
              content: activeQuery?.q ?? "no active query",
              id: activeMessageId,
            },
          ]
        : messages
      ).map((message: Message, index: number) => {
        if (message.role === "assistant") {
          // let content = message.content.replace(/\[(\d+\.[a-zA-Z])\]/g, '$1');
          let content = transformString(message.content);

          return (
            <div
              className="mx-4 mb-8 mt-6 sm:mx-12"
              key={`${message.id}-${index}`}
            >
              <Suspense fallback={null}>
                {/* <div className="mx-auto mb-4 w-full  max-w-3xl rounded-xl border border-gray-200 bg-[#f5f5f5] p-8 text-xs leading-snug  transition-transform duration-300 hover:scale-[1.01] dark:bg-gray-800"> */}
                <div
                  className={cn({
                    "mx-auto mb-4 w-full  max-w-3xl text-xs leading-snug dark:bg-gray-800 sm:rounded-xl sm:border sm:border-gray-200 sm:bg-[#f6f7f8] sm:p-8":
                      true,
                    "transition-transform duration-300 hover:scale-[1.01]":
                      messages[index - 1]?.role === "user" &&
                      messages[index - 1]?.id !== activeMessageId,
                  })}
                >
                  <article
                    className="prose mb-6 mt-2 w-full max-w-none break-words text-left dark:prose-invert prose-p:leading-relaxed prose-pre:p-0" //TODO is this too much stuff? how much actually has an effect? idk
                    onClick={() => {
                      const prevMessage = messages[index - 1];
                      let id = "";

                      if (prevMessage) {
                        id = prevMessage.id;
                      } else {
                        console.error("No previous message found.");
                        id = uuidv4(); // Generating a unique ID using uuid
                      }

                      if (activeMessageId !== id) {
                        setSelectedSearchResultAlphaId("");
                      }

                      setActiveMessageId(id);

                      console.log("active message id", id);
                    }}
                  >
                    <MarkdownRenderer
                      organicResultsWithDiffbot={organicResultsWithDiffbot}
                      messages={messages}
                      index={index}
                      activeMessageId={activeMessageId}
                      content={content}
                    />
                  </article>

                  <div className="bg-transparent p-0">
                    <SourceChips
                      organicResultsWithDiffbot={organicResultsWithDiffbot}
                      messageId={
                        (messages[index - 1]?.role === "user" &&
                          messages[index - 1]?.id) ||
                        activeMessageId
                      }
                      message={message}
                      isLoading={isLoading}
                    />
                    <div className="mx-auto mt-2 flex max-w-3xl flex-wrap gap-2">
                      <Button
                        disabled={isLoading}
                        className="mb-2 h-8 w-32 hover:bg-zinc-200"
                        variant="outline"
                        onClick={() => {
                          //google search for the query
                          window.open(
                            `https://www.google.com/search?q=${activeQuery?.q}`,
                            "_blank"
                          );
                        }}
                      >
                        <SearchIcon className="mr-2 h-4 w-4" />
                        Google
                      </Button>
                      <Button
                        disabled={isLoading}
                        className="mb-2 h-8 w-32 hover:bg-zinc-200"
                        variant="outline"
                        onClick={() => {
                          //google search for the query
                          window.open(
                            `https://www.bing.com/search?q=${activeQuery?.q}`,
                            "_blank"
                          );
                        }}
                      >
                        <SearchIcon className="mr-2 h-4 w-4" />
                        Bing
                      </Button>
                      <Button
                        disabled={isLoading}
                        className="mb-2 h-8 w-32 hover:bg-zinc-200"
                        variant="outline"
                        onClick={() => {
                          //google search for the query
                          window.open(
                            `https://www.perplexity.ai/search?q=${activeQuery?.q}`,
                            "_blank"
                          );
                        }}
                      >
                        <SearchIcon className="mr-2 h-4 w-4" />
                        Perplexity
                      </Button>
                    </div>
                  </div>
                </div>
              </Suspense>
              <Recommendations
                recommendations={recommendations}
                message={message}
                parentId={messages[index - 1]?.id || ""}
                newMessageIsLoading={newMessageIsLoading}
                braveResultIsLoading={braveResultIsLoading}
              />
            </div>
          );
        } else if (message.role === "user") {
          return (
            <div
              className="mx-4 sm:mx-12"
              key={`${message.id}-${index}`}
              ref={userMessageRef}
            >
              <div className="lg:prose-md prose mx-auto w-full  max-w-3xl">
                <div className="mt-2 flex flex-col items-start transition-colors duration-200">
                  <h2
                    // className="flex items-center text-xl font-bold leading-snug text-gray-900"
                    className="default whitespace-pre-line break-words  font-sans text-2xl font-semibold text-gray-800 [word-break:break-word] sm:ml-4"
                    style={{
                      marginBottom: "0.5rem",
                      marginTop: "0.5rem",
                      fontFamily: "Cal Sans, Montserrat, sans-serif",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {queries.find((query) => query.messageId === message.id)
                      ?.q ?? message.id}
                  </h2>
                </div>
              </div>
              {newMessageOrBraveIsLoading && !messages[index + 1] && (
                <div className="mx-auto mb-4 mt-8 w-full max-w-3xl animate-pulse rounded-xl border border-gray-200 bg-[#f5f5f5] p-6 ">
                  <div className="space-y-3">
                    <div className="mb-4 h-5 w-1/3 rounded bg-gray-400"></div>
                    <div className="space-y-2">
                      <div className="h-3 rounded bg-gray-400"></div>
                      <div className="h-3 w-5/6 rounded bg-gray-400"></div>
                      <div className="h-3 w-4/5 rounded bg-gray-400"></div>
                      <div className="w-9/10 h-3 rounded bg-gray-400"></div>
                      <div className="h-3 w-3/4 rounded bg-gray-400"></div>
                      <div className="h-3 w-2/3 rounded bg-gray-400"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        }
      })}
    </>
  );
};

export default ChatComponent;
