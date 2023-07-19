import Link from "next/link";
import Parser from "html-react-parser";
import {
  SiteLink,
  SearchResult,
  SnippetType,
  OrganicResultWithDiffbot,
} from "@/src/types";
import { SparklesIcon } from "@heroicons/react/20/solid";
import SearchResultCard from "./SearchResultCard";

import { BookOpenIcon, ListBulletIcon } from "@heroicons/react/24/outline";

import { cn } from "~/lib/utils";
import { IconOpenAI } from "~/components/ui/icons";
import DisplayLink from "./DisplayLink";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import { LinkIcon, ClockIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import React from "react";
import PaginationButtons from "../PaginationButtons";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";
import SearchBarTabs from "../searchBarTabs";
import { useSearchResultsStore } from "@/src/store/searchResultsContext";
import LoadingCard from "@/src/components/shared/LoadingCard";
import "cal-sans";
import { SearchIcon } from "lucide-react";


interface SidebarProps {
  organicSearchResults: OrganicResultWithDiffbot[];
  query: string;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  setSelectedResult: React.Dispatch<
    React.SetStateAction<OrganicResultWithDiffbot | null>
  >;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const SearchSidebar = ({
  organicSearchResults,
  query,
  selectedIndex,
  setSelectedIndex,
  setSelectedResult,
  setActiveTab, //TODO for the love of god rename the right tabs to something else
}: SidebarProps) => {
  // import isSidebarOpen from zustand store useSearchResultsStore
  const isSidebarOpen = useSearchResultsStore((state) => state.isSidebarOpen);
  const setIsSidebarOpen = useSearchResultsStore(
    (state) => state.setIsSidebarOpen
  );
  const activeResults = useSearchResultsStore((state) => state.activeResults);
  const activeQuery = useSearchResultsStore((state) => state.activeQuery);
  const activeMessageId = useSearchResultsStore(
    (state) => state.activeMessageId
  );
  const newMessageIsLoading = useSearchResultsStore(
    (state) => state.newMessageIsLoading
  );
  const braveResultIsLoading = useSearchResultsStore(
    (state) => state.braveResultIsLoading
  );

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // bg-[#F4F4F5]"
  return (
    // <div
    //   className={cn("relative border-l border-gray-200 bg-[#FAFBFC]"

    //   , {
    //     "w-[520px]": isSidebarOpen,
    //     "w-[0]": !isSidebarOpen,
    //   })}
    // >
    <motion.div
      animate={{ width: isSidebarOpen ? 520 : 0 }}
      initial={{ width: isSidebarOpen ? 520 : 0 }}
      transition={{ type: "spring", damping: 20, stiffness: 100 }}
      className="relative border-l border-gray-200 bg-[#FAFBFC]"
    >
      {/* Make parent div relative for floating button position */}
      <button
        onClick={toggleSidebar}
        style={{ marginTop: "10px", left: "-10px" }}
        className={`
        absolute z-10 my-3 -ml-12 flex transform cursor-pointer items-center rounded-full bg-transparent p-2 transition-transform duration-500 ease-in-out hover:scale-105 active:scale-95
        ${isSidebarOpen ? "text-[#686B6C]" : "text-[#686B6C]"}
    `}
        aria-label={isSidebarOpen ? "Hide Sidebar" : "Show Sidebar"}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`h-6 w-6 ${isSidebarOpen ? "" : "rotate-180 transform"}`}
        >
          <path
            d="M19 21L5 21C3.89543 21 3 20.1046 3 19L3 5C3 3.89543 3.89543 3 5 3L19 3C20.1046 3 21 3.89543 21 5L21 19C21 20.1046 20.1046 21 19 21Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
          <path
            d="M9.5 21V3"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M5.5 10L7.25 12L5.5 14"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </svg>
      </button>
      <div>
        {" "}
        {/* Use transition for smoother animation */}
        {isSidebarOpen && (
          <div className="mx-auto sm:max-w-2xl sm:px-4">
            {/* <SearchBarTabs
              activeTab={activeSearchBarTab}
              setActiveTab={setActiveSearchBarTab}
            /> TODO return this */}
            <div
              className={cn("mt-10 w-full max-w-3xl scrollbar-hide", {
                "mr-10 w-full": isSidebarOpen,
                "w-0": !isSidebarOpen,
              })}
              style={{
                overflowY: "auto",
                height: "100vh",
                paddingBottom: "100px",
              }}
            >
              <div className="mb-4 ml-4 flex items-center space-x-1 text-sm">
                {activeResults?.length === 0 ? (
                  <div className="flex animate-pulse space-x-4">
                    <div className="h-4 w-16 rounded-full bg-gray-200"></div>
                    <div className="flex-1 space-y-4 py-1 ">
                      <div className="h-4 w-full rounded bg-gray-200"></div>
                    </div>
                  </div>
                ) : (
                  <>
                    <span className="font-bold text-gray-700">
                      {activeResults.length}
                    </span>
                    <span className="text-xs uppercase text-gray-400">
                      results
                    </span>
                  </>
                )}
              </div>

              <p
                className="text-md mx-auto mb-4 ml-4 flex w-[90%] items-center space-x-1 border-b border-gray-200 pb-2"
                style={{ fontFamily: "Cal Sans" }}
              >
                <SearchIcon
                  className="ml-1 mr-1 mt-1 text-gray-400"
                  size={20}
                />
                <span className="font-bold text-gray-700">
                  {activeQuery?.q
                    ? activeQuery?.q
                    : `undefined, the current message is ${activeMessageId}`}
                </span>
              </p>

              {!activeResults || activeResults.length === 0
                ? Array(10)
                    .fill(null)
                    .map((_, index) => <LoadingCard key={index} />)
                : activeResults.map((result: any, index: number) => (
                    <div
                      key={index}
                      style={{
                        width: "500px",
                        boxSizing: "border-box",
                        overflowX: "hidden",
                        overflowY: "hidden",
                      }}
                    >
                      <SearchResultCard
                        result={result}
                        index={index}
                        selectedIndex={selectedIndex}
                        setSelectedIndex={setSelectedIndex}
                        setSelectedResult={setSelectedResult}
                        setActiveTab={setActiveTab}
                        isSidebarOpen={isSidebarOpen}
                      />
                    </div>
                  ))}

              {/* <PaginationButtons /> */}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchSidebar;

// {
/* <motion.div
                  className={cn(
                    "relative mx-4 mb-8 max-w-5xl space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-md",
                    selectedIndex === index
                      ? "bg-blue-50 ring-2 ring-blue-500"
                      : "",
                    isSidebarOpen ? "w-full max-w-xl" : "w-0 overflow-hidden"
                  )}
                  key={result.link}
                  whileHover={{ scale: 1.015 }}
                  role="button"
                  aria-pressed="false"
                  onClick={() => {
                    setSelectedIndex(index);
                    setSelectedResult(result);
                    setActiveTab("read");
                  }}
                >
                  <div className="group flex flex-col">
                    <div
                      className="mb-2 flex cursor-pointer items-center space-x-2"
                      onClick={async (e) => {
                        e.preventDefault();
                        setSelectedResult(result);
                        setActiveTab("read");
                      }}
                    >
                      <Link
                        className="flex items-center truncate text-sm font-semibold hover:text-blue-700"
                        href={result.link ?? ""}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {result.favicon ? (
                          <img
                            className="h-5 w-5 rounded-full"
                            src={result.favicon}
                            alt="favicon"
                          />
                        ) : (
                          <LinkIcon className="h-5 w-5 text-blue-600 group-hover:text-blue-800" />
                        )}
                        <span className="ml-2">
                          <DisplayLink link={result.link ?? ""} />
                        </span>
                      </Link>
                      {(result.diffbotAPIResponse?.markdown &&
                        (result.diffbotAPIResponse?.type === "article" ||
                          result.diffbotAPIResponse?.type === "list")) ||
                      true ? (
                        <TooltipProvider delayDuration={0}>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                className="absolute right-3 top-3 h-8 w-8 rounded-full p-0"
                                aria-label="Add to reading list"
                              >
                                <div>
                                  {result.diffbotAPIResponse?.type
                                    ? result.diffbotAPIResponse?.type
                                    : result.diffbotAPIResponse}
                                </div>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="flex flex-col space-y-2">
                                <Button
                                  variant="outline"
                                  className="w-full text-left hover:bg-gray-100"
                                  onClick={() => {
                                    setSelectedResult(result);
                                    setActiveTab("content");
                                  }}
                                >
                                  <IconOpenAI className="mr-2 h-4 w-4" />
                                  <span>Key Insights</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full text-left hover:bg-gray-100"
                                  onClick={() => {
                                    setSelectedResult(result);
                                    setActiveTab("content");
                                  }}
                                >
                                  <ListBulletIcon className="mr-2 h-4 w-4" />
                                  <span>Bullet Points</span>
                                </Button>
                                <Button
                                  variant="outline"
                                  className="w-full text-left hover:bg-gray-100"
                                  onClick={() => {
                                    setSelectedResult(result);
                                    setActiveTab("content");
                                  }}
                                >
                                  <BookOpenIcon className="mr-2 h-4 w-4" />
                                  <span>Quick Read</span>
                                </Button>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : null}
                    </div>
                    <Link
                      className="mb-2 truncate text-lg font-bold text-blue-800 transition-colors hover:text-blue-600 hover:underline"
                      href={result.link ?? ""}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {result.title}
                    </Link>
                    <p className="text-sm text-gray-700">
                      {Parser(result.snippet ?? "")}
                    </p>
                    {result.extra_snippets?.map((snippet: ExtraSnippet) => (
                      <p className="text-md my-2 flex items-center justify-center space-x-1 rounded-md bg-gray-100 p-2 text-gray-700">
                        {Parser(snippet.text ?? " ")}
                      </p>
                    ))}
                  </div>
                </motion.div> */
// }
