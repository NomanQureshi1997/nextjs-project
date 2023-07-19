import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { OrganicResultWithDiffbot, SearchParamsType } from "@/src/types";
import { Manrope } from "next/font/google";
import { useEffect, useState, useRef, Suspense } from "react";
import { cn } from "~/lib/utils";
import { useChat, type Message } from "ai/react";
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
import ChatView from "./ChatView";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

interface Props {
  selectedResult: OrganicResultWithDiffbot | null;
  // generation: string;
  conversation: Message[];
  // results: OrganicResultWithDiffbot[];
  tab: string;
  queries: SearchParamsType[];
  handleTabChange: (tab: string) => void;
  isLoading: boolean;
}



// console.log(transformString("Test [<123456789>]")); // logs "Test [<123456789>]" (unchanged because length > 8)

export default function LeftTabs({
  selectedResult, //todo update this to be a type
  // generation,
  conversation,
  // results,
  tab,
  queries,
  handleTabChange,
}: // isLoading = true, //todo this is a hack to stop flickering
Props) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const {
    braveResultIsLoading,
  } = useSearchResultsStore((state) => ({
    braveResultIsLoading: state.braveResultIsLoading,
  }));

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      initialMessages: conversation,
    });

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) {
        return;
      }

      const totalScroll = scrollContainerRef.current.scrollTop;
      const windowHeight =
        scrollContainerRef.current.scrollHeight -
        scrollContainerRef.current.clientHeight;
      const scroll = `${(totalScroll / windowHeight) * 100}`;

      setScrollPosition(Number(scroll));

      console.log("Window height:", windowHeight);
      console.log("Total scroll:", totalScroll);
      console.log("Scroll:", scroll);
      console.log("Scroll position:", scrollPosition);
    };

    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [scrollContainerRef, setScrollPosition]);

  useEffect(() => {
    if (!scrollContainerRef.current) {
      return;
    } else {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [selectedResult]);

  const userMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (braveResultIsLoading && userMessageRef.current) {
      userMessageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [braveResultIsLoading]);

  return (
    <>
      {tab === "read" && (
        <div className="fixed left-0 top-0 z-50 h-0.5 w-full overflow-hidden rounded-full bg-gray-300">
          <div className="h-full w-full">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              style={{ width: `${scrollPosition}%` }}
            />
          </div>
        </div>
      )}

      <Tabs value={tab} className="w-full" onValueChange={handleTabChange}>
        <TabsList className="mx-auto mb-4 grid max-w-2xl grid-cols-2 gap-2 px-2">
          <TabsTrigger
            value="key insights"
            onClick={() => handleTabChange("key insights")}
            className="border border-gray-300 bg-gray-200 py-2"
          >
            Key Insights
          </TabsTrigger>
          <TabsTrigger
            value="read"
            onClick={() => handleTabChange("read")}
            className="border border-gray-300 bg-gray-200 py-2"
          >
            Read
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="key insights"
        >
          <div
          style={{
            height: "92vh",
            overflowY: "auto",
            paddingBottom: "300px",
            marginBottom: "300px",
          }}
          className="scrollbar-hide"
          >
            <ChatView 
              messages={messages}
              isLoading={isLoading}
              queries={queries}
              userMessageRef={userMessageRef}
            />
          </div>
        </TabsContent>
        <TabsContent
          ref={scrollContainerRef}
          value="read"
          style={{
            height: "85vh",
            overflowY: "auto",
            paddingBottom: "300px",
            marginBottom: "300px",
          }}
        >
          <ArticleComponent
            selectedResult={selectedResult}
            scrollContainerRef={scrollContainerRef}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
