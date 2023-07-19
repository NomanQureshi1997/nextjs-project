import { type UseChatHelpers } from "ai/react";

import { Button } from "~/components/ui/button";
import { PromptForm } from "~/components/prompt-form";
import { ButtonScrollToBottom } from "~/components/button-scroll-to-bottom";
import { IconRefresh, IconStop } from "~/components/ui/icons";
import { SearchParamsType, ISerpApiResponse } from "@/src/types";
import { v4 as uuidv4 } from "uuid";
import { type Message } from "ai/react";
import { useSearchResultsStore } from "@/src/store/searchResultsContext";
import { useAutopromptBrave } from "@/src/lib/hooks/use-autoprompt-brave";
import { useState, useEffect } from "react";
import { on } from "events";
// import { FooterText } from '~/components/footer'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | "append"
    | "isLoading"
    | "reload"
    | "messages"
    | "stop"
    | "input"
    | "setInput"
  > {
  id?: string;
  setShowDemoModal: React.Dispatch<React.SetStateAction<boolean>>;
  // setQueries: React.Dispatch<React.SetStateAction<QueryType[]>>;
  // queries: QueryType[];
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  setShowDemoModal,
}: // setQueries,
// queries,
ChatPanelProps) {
  const [
    queries,
    addQuery,
    activeMessageId,
    searchParams,
    setActiveMessageId,
    setActiveQuery,
    setBraveResultIsLoading,
    setNewMessageOrBraveIsLoading,
    setSearchParams,
    onSubmit,
  ] = useSearchResultsStore((state) => [
    state.queries,
    state.addQuery,
    state.activeMessageId,
    state.searchParams,
    state.setActiveMessageId,
    state.setActiveQuery,
    state.setBraveResultIsLoading, // Add this line
    state.setNewMessageOrBraveIsLoading, // Add this line
    state.setSearchParams,
    state.onSubmit,
  ]);

  // const [searchParams, setSearchParams] = useState<SearchParamsType | null>(
  //   null
  // );

  const { response, error } = useAutopromptBrave(searchParams);

  return (
    <div className="fixed inset-x-0 bottom-0 bg-gradient-to-b from-muted/10 from-10% to-muted/30 to-50%">
      <ButtonScrollToBottom />
      <div className="mx-auto max-w-3xl sm:px-4">
        <div className="mb-1 flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background shadow"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background shadow"
                // small shadow-md
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div
          className="
          border-[rgba(225,225,235,0.6) mx-auto h-full
          w-full space-y-4 border-[1px]  border-t
          border-gray-300 px-4 py-2 pb-4 sm:rounded-t-xl sm:border-none sm:border-gray-300
          sm:bg-white sm:py-4
          bg-[#FEFEFA]
          "
          // backdrop-blur-[10px]
          // backdrop-filter 
        >
          <PromptForm
            setShowDemoModal={setShowDemoModal}
            onSubmit={async (value) => {
              onSubmit(value);
            }}
            // onSubmit={async (value) => {
            //   const messageId = uuidv4();
            //   addQuery({
            //     messageId: messageId,
            //     q: value,
            //   });

            //   setActiveQuery({
            //     messageId: messageId,
            //     q: value,
            //   });

            //   setActiveMessageId(messageId);
            //   console.log("activeMessageId", activeMessageId);

            //   // Create new searchParams object
            //   const newSearchParams: SearchParamsType = {
            //     q: value,
            //     messageId: messageId,
            //   };

            //   // Update searchParams state to re-fetch data
            //   setSearchParams(newSearchParams);

            //   if (error) {
            //     console.error("Error fetching data:", error);
            //   } else {
            //     const message: Message = {
            //       role: "user",
            //       content: response?.organicResults.toString() || "", // adjust this depending on the structure of the response
            //       id: messageId,
            //       createdAt: new Date(),
            //     };
            //     console.log("message", message);
            //     console.log("queries", queries);
            //     // await append(message);
            //   }
            // }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
          />
          {/* <FooterText className="hidden sm:block" /> */}
        </div>
      </div>
    </div>
  );
}
