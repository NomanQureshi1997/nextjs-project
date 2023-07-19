import React, { useState } from "react";
import { motion } from "framer-motion";
import Parser from "html-react-parser";
import { OrganicResultWithDiffbot, SnippetType } from "@/src/types";
import {
  LinkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/solid";
import Link from "next/link";
import { IconOpenAI } from "@/src/components/ui/icons";
import { Button } from "@/src/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
import {
  SparklesIcon,
  ListBulletIcon,
  BookOpenIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { SparkleIcon } from "lucide-react";
import { cn } from "@/src/lib/utils";
import DisplayLink from "./DisplayLink";
import SearchSolid from "@/public/search-solid.svg";
import { Star, Hash } from "lucide-react";
import ErrorBoundary from "../ErrorBoundary";
import Image from "next/image";
import { useRef, useEffect } from "react";
import { useSearchResultsStore } from "@/src/store/searchResultsContext";
import clsx from "clsx";
import globeFavicon from "@/public/globeFavicon.png";
import { animateScroll as scroll, Events } from 'react-scroll';

// Define the interface for the snippet

const iconsMap = {
  article: SparkleIcon,
  list: ListBulletIcon,
};

const safeParse = (text: string | undefined): React.ReactNode => {
  try {
    return text ? Parser(text) : null;
  } catch (error) {
    console.error("Failed to parse text:", error);
    // Return a default value or null in case of an error
    return null;
  }
};

const ExtraSnippet: React.FC<SnippetType> = ({ text }) => (
  <ErrorBoundary>
    <div className="text-md my-2 flex items-center justify-center space-x-1 rounded-md bg-gray-100 p-2 text-gray-700">
      {safeParse(text ?? "Not Available")}
    </div>
  </ErrorBoundary>
);

// Define the interface for a result

interface SearchResultProps {
  result: OrganicResultWithDiffbot;
  index: number;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  setSelectedResult: (result: OrganicResultWithDiffbot) => void;
  setActiveTab: (tab: string) => void;
  isSidebarOpen: boolean;
}

const SearchResultCard: React.FC<SearchResultProps> = ({
  result,
  index,
  selectedIndex,
  setSelectedIndex,
  setSelectedResult,
  setActiveTab,
  isSidebarOpen,
}) => {
  const [showExtraSnippets, setShowExtraSnippets] = useState(false);
  const [
    selectedSearchResultIndex,
    setSelectedSearchResultIndex,
    selectedSearchResultAlphaId,
  ] = useSearchResultsStore((state) => [
    state.selectedSearchResultIndex,
    state.setSelectedSearchResultIndex,
    state.selectedSearchResultAlphaId,
  ]);

  const type = result.diffbotAPIResponse?.type;
  const APITypeIcon =
    type && iconsMap.hasOwnProperty(type)
      ? iconsMap[type as keyof typeof iconsMap]
      : QuestionMarkCircleIcon;

  const cardRef = useRef<HTMLDivElement | null>(null);



  useEffect(() => {
    if (selectedSearchResultIndex === result.position && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: "auto",
        block: "start",
      });
    }
  }, [selectedSearchResultIndex]);
  


  const [src, setSrc] = useState<string>(result.favicon);

  return (
    
    <motion.div
      key={result.link}
      whileHover={{ scale: 1.015 }}
      role="button"
      aria-pressed="false"
      onClick={() => {
        // setSelectedIndex(index);
        // setSelectedResult(result);
        // setActiveTab("read");
        setSelectedSearchResultIndex(
          result.position,
          result.messageId,
          result.snippet.snippetAlphaID ?? ""
        );
      }}
    >
      <div className="flex flex-col">
        <div className="mx-4 mb-3 mt-3 flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div
            className={clsx(
              "transform px-6 py-4 transition-all duration-300 ease-in-out",
              {
                "text-shadow scale-105 border-[#B2B2B2] bg-[#E5E5E5] text-[#2F4858]":
                  selectedSearchResultIndex === result.position &&
                  selectedSearchResultAlphaId === result.snippet.snippetAlphaID,
              }
            )}
          >
            <div
              className="flex items-center space-x-2"
              onClick={async (e) => {
                e.preventDefault();
                setSelectedResult(result);
                setActiveTab("read");
              }}
              ref={cardRef}
              style={{ scrollMarginTop: "40px" }}
            >
              <Link
                className="flex items-center truncate text-sm font-semibold hover:text-blue-700"
                href={result.link ?? ""}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="inline-flex items-center rounded-full border border-gray-300 bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-800 shadow-sm">
                  {result.position}
                  {result.favicon ? (
                    <div className="ml-2 h-5 w-5 overflow-hidden rounded-full">
                      <Image
                        className="object-cover"
                        src={src}
                        alt="favicon"
                        width={20}
                        height={20}
                        // onError={(e) => {
                        //   const target = e.currentTarget;
                        //   target.onerror = null; // Ensuring the onError handler won't be triggered again.
                        //   target.src = globeFavicon.src;
                        //   console.log("Error loading favicon");
                        // }}
                        onError={() => {
                          setSrc(globeFavicon.src);
                        }}
                      />
                    </div>
                  ) : (
                    <LinkIcon className="ml-2 h-5 w-5 text-blue-600 hover:text-blue-800" />
                  )}
                </span>

                <span className="ml-2">
                  <DisplayLink link={result.link ?? ""} />
                </span>
              </Link>
              {/* TODO ADD BACK IN DIFFBOT BUTTONS */}
            </div>
            <Link
              className="mb-2 text-lg font-bold text-gray-800 transition-colors hover:text-gray-700 hover:underline"
              href={result.link ?? ""}
              target="_blank"
              rel="noopener noreferrer"
            >
              {result.title}
            </Link>
            <ErrorBoundary>
              <div className="mb-4 mt-3 text-sm text-gray-700">
                {safeParse(result.snippet.text ?? "Not Available")}
              </div>
            </ErrorBoundary>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Hash className="h-3 w-3 text-gray-500" />
                <span
                  className={clsx(
                    "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide text-gray-800",
                    {
                      "bg-gray-400":
                        selectedSearchResultIndex === result.position &&
                        selectedSearchResultAlphaId ===
                          result.snippet.snippetAlphaID,
                      "bg-gray-100":
                        selectedSearchResultIndex !== result.position ||
                        selectedSearchResultAlphaId !==
                          result.snippet.snippetAlphaID,
                    }
                  )}
                >
                  {`${result.snippet.snippetAlphaID?.split(".")[0]}${
                    result.snippet.snippetAlphaID?.split(".")[1]
                  }`}
                </span>
                {selectedSearchResultIndex !== result.position &&
                  result.extraSnippets &&
                  result.extraSnippets.length > 0 && (
                    <div className="flex items-center space-x-2 hover:text-gray-700">
                      <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
              </div>
            </div>
          </div>

          {selectedSearchResultIndex === result.position &&
            result.extraSnippets?.map((snippet: SnippetType, index) => (
              <div
                className={clsx(
                  "flex flex-col justify-between space-y-4 border-t border-gray-200 px-6 py-4 transition-all duration-300 ease-in-out",
                  {
                    "text-shadow scale-105 border-[#B2B2B2] bg-[#E5E5E5] text-[#2F4858]":
                      selectedSearchResultIndex === result.position &&
                      selectedSearchResultAlphaId === snippet.snippetAlphaID,
                  }
                )}
                key={index}
              >
                <ErrorBoundary>
                  <div className="text-sm text-gray-700">
                    {safeParse(snippet.text ?? "Not Available")}
                  </div>
                </ErrorBoundary>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Hash className="h-3 w-3 text-gray-500" />
                    <span
                      className={clsx(
                        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium tracking-wide text-gray-800",
                        {
                          "bg-gray-400":
                            selectedSearchResultIndex === result.position &&
                            selectedSearchResultAlphaId ===
                              snippet.snippetAlphaID,
                          "bg-gray-100":
                            selectedSearchResultIndex !== result.position ||
                            selectedSearchResultAlphaId !==
                              snippet.snippetAlphaID,
                        }
                      )}
                    >
                      {`${snippet.snippetAlphaID?.split(".")[0]}${
                        snippet.snippetAlphaID?.split(".")[1]
                      }`}
                    </span>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SearchResultCard;

// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import Parser from "html-react-parser";
// import { OrganicResultWithDiffbot } from "@/src/pages/serp";
// import { LinkIcon } from "@heroicons/react/24/solid";
// import Link from "next/link";
// import { IconOpenAI } from "@/src/components/ui/icons";
// import { Button } from "@/src/components/ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/src/components/ui/tooltip";
// import {
//   SparklesIcon,
//   ListBulletIcon,
//   BookOpenIcon,
//   QuestionMarkCircleIcon,
// } from "@heroicons/react/24/outline";
// import { SparkleIcon } from "lucide-react";
// import { cn } from "@/src/lib/utils";
// import DisplayLink from "./DisplayLink";
// import { ExtraSnippet } from "@/src/types";

// const iconsMap = {
//   article: SparkleIcon,
//   list: ListBulletIcon,
// };

// interface ExtraSnippetProps {
//     snippet: Snippet;
// }

// const ExtraSnippet: React.FC<ExtraSnippetProps> = ({ snippet }) => (
//     <p className="text-md my-2 flex items-center justify-center space-x-1 rounded-md bg-gray-100 p-2 text-gray-700">
//         {Parser(snippet.text ?? " ")}
//     </p>
//     );

// // Define the interface for the snippet
// interface Snippet {
//     text: string;
// }

// // Define the interface for a result

// interface SearchResultProps {
//     result: OrganicResultWithDiffbot;
//     index: number;
//     selectedIndex: number;
//     setSelectedIndex: (index: number) => void;
//     setSelectedResult: (result: OrganicResultWithDiffbot) => void;
//     setActiveTab: (tab: string) => void;
//     isSidebarOpen: boolean;
// }

// const SearchResultCard: React.FC<SearchResultProps> = ({
//   result,
//   index,
//   selectedIndex,
//   setSelectedIndex,
//   setSelectedResult,
//   setActiveTab,
//   isSidebarOpen,
// }) => {
//   const [showExtraSnippets, setShowExtraSnippets] = useState(false);
//   const [isExpanded, setIsExpanded] = useState(false);
//   const type = result.diffbotAPIResponse?.type;
//   const APITypeIcon =
//     type && iconsMap.hasOwnProperty(type)
//       ? iconsMap[type as keyof typeof iconsMap]
//       : QuestionMarkCircleIcon;

//   const handleExpandClick = () => {
//     setIsExpanded(!isExpanded);
//   };

//   return (
//     <motion.div
//       className={cn(
//         "relative mx-4 mb-8 max-w-5xl space-y-3 rounded-lg border border-gray-200 bg-white p-6 shadow-md",
//         selectedIndex === index ? "bg-blue-50 ring-2 ring-blue-500" : "",
//         isSidebarOpen ? "w-full max-w-xl" : "w-0 overflow-hidden"
//       )}
//       key={result.link}
//       whileHover={{ scale: 1.015 }}
//       role="button"
//       aria-pressed="false"
//       onClick={() => {
//         setSelectedIndex(index);
//         setSelectedResult(result);
//         setActiveTab("read");
//       }}
//     >
//       <div className="flex flex-col">
//         <Button
//           variant="outline"
//           className="group absolute right-5 top-4 h-8 w-10 rounded-full border border-2 border-gray-400 p-0 hover:border-purple-700 hover:text-purple-700"
//           aria-label="Expand/Collapse"
//           onClick={handleExpandClick}
//         >
//           {isExpanded ? "Collapse" : "Expand"}
//         </Button>

//         {isExpanded && (
//           <>
//             <div
//               className="mb-2 flex cursor-pointer items-center space-x-2"
//               onClick={async (e) => {
//                 e.preventDefault();
//                 setSelectedResult(result);
//                 setActiveTab("read");
//               }}
//             >
//               <Link
//                 className="flex items-center truncate text-sm font-semibold hover:text-blue-700"
//                 href={result.link ?? ""}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 {result.favicon ? (
//                   <img
//                     className="h-5 w-5 rounded-full"
//                     src={result.favicon}
//                     alt="favicon"
//                   />
//                 ) : (
//                   <LinkIcon className="h-5 w-5 text-blue-600 hover:text-blue-800" />
//                 )}
//                 <span className="ml-2">
//                   <DisplayLink link={result.link ?? ""} />
//                 </span>
//               </Link>
//             </div>
//             <Link
//               className="mb-2 truncate text-lg font-bold text-blue-800 transition-colors hover:text-blue-600 hover:underline"
//               href={result.link ?? ""}
//               target="_blank"
//               rel="noopener noreferrer"
//             >
//               {result.title}
//             </Link>
//             <p className="text-sm text-gray-700">{Parser(result.snippet ?? "")}</p>
//             {result.extra_snippets?.map((snippet: ExtraSnippet) => (
//               <p className="text-md my-2 flex items-center justify-center space-x-1 rounded-md bg-gray-100 p-2 text-gray-700">
//                 {Parser(snippet.text ?? " ")}
//               </p>
//             ))}
//           </>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default SearchResultCard;

{
  /* TODO add this back in */
}

{
  /* {(result.diffbotAPIResponse?.markdown &&
                (result.diffbotAPIResponse?.type === "article" ||
                  result.diffbotAPIResponse?.type === "list")) ||
              true ? (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        className="group absolute right-5 top-4 h-8 w-10 rounded-full border  border-gray-400 p-0 hover:border-purple-700 hover:text-purple-700"
                        aria-label="Add to reading list"
                      >
                        <APITypeIcon className="h-6 w-6 text-gray-400 group-hover:text-purple-800" />
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
              ) : null} */
}
