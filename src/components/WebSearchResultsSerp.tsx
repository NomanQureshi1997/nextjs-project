import zod from "zod";
import { OrganicResultWithDiffbot, SearchParamsType } from "@/src/types";
import { cn } from "~/lib/utils";
import { Inter, Manrope } from "next/font/google";
import LeftTabs from "./Content/LeftTabs";
export type searchResultsType = zod.infer<typeof searchResultsSchema>;
export type siteLinksType = zod.infer<typeof siteLinksSchema>;

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import React from "react";
import SearchSidebar from "./Content/SearchSidebar";
import { Message } from "ai";

const inter = Inter({ subsets: ["latin"] }); //TODO maybe use inter and manrope in other places idk

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const siteLinkSchema = zod.object({
  link: zod.string().optional(),
  snippet: zod.string().optional(),
  title: zod.string().optional(),
});

export const siteLinksSchema = zod.array(siteLinkSchema);

const snippetSchema = zod.object({
  text: zod.string(),
  score: zod.number().optional(),
  extra_snippet: zod.boolean().default(false),
});

export const searchResultSchema = zod.object({
  favicon: zod.string().optional(),
  link: zod.string().optional(),
  position: zod.number().optional(),
  sitelinks: siteLinksSchema.optional(),
  snippet: snippetSchema,
  title: zod.string(),
});

export const searchResultsSchema = zod.array(searchResultSchema);

export default function WebSearchResults({
  organicSearchResults,
  conversation,
  activeSearchResults,
  // setActiveSearchResults,
  isLoading,
  queries,
  chatPanelComponent,
}: {
  organicSearchResults: OrganicResultWithDiffbot[][];
  activeSearchResults: OrganicResultWithDiffbot[] | undefined;
  // setActiveSearchResults: React.Dispatch<
  //   React.SetStateAction<OrganicResultWithDiffbot[] | undefined>
  // >;
  conversation: Message[];
  isLoading: boolean;
  queries: SearchParamsType[];
  chatPanelComponent: React.ReactNode;
}) {
  // const [resultsUsedInGeneration, setResultsUsedInGeneration] = useState<OrganicResultWithDiffbot[][]>([]);
  const [activeTab, setActiveTab] = useState("key insights");
  const [snippets, setSnippets] = useState<string[]>([]);
  const [selectedResult, setSelectedResult] =
    useState<OrganicResultWithDiffbot | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // useEffect(() => {
  //   const handleKeyDown = (event: KeyboardEvent) => {
  //     if (event.key === "ArrowUp") {
  //       event.preventDefault();
  //       if (selectedIndex > 0) {
  //         setSelectedIndex((prevIndex) => prevIndex - 1);
  //       }
  //     }
  //     if (event.key === "ArrowDown") {
  //       event.preventDefault();
  //       if (selectedIndex < organicSearchResults.length - 1) {
  //         setSelectedIndex((prevIndex) => prevIndex + 1);
  //       }
  //     }
  //   };

  //   window.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [organicSearchResults.length]);

  return (
    <motion.div
      className={`mx-auto w-full bg-white p-0 pb-40 text-gray-800 sm:pb-24`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.02 }} //TODO figure out why this is needed
      style={{
        fontFamily: '"Inter", sans-serif',
        overflow: "hidden",
        position: "fixed",
        width: "100vw",
      }}
    >
      <div className={`flex justify-between`}>
        <div
          className={cn("mx-auto max-w-7xl flex-1 bg-white pt-5")}
          style={{
            wordBreak: "break-word",
            lineHeight: "1.5",
            fontSize: "1rem",
            fontFamily: '"Poppins", sans-serif',
          }}
        >
          <div className="relative mb-96">
            <LeftTabs
              conversation={conversation}
              selectedResult={selectedResult}
              tab={activeTab}
              handleTabChange={setActiveTab}
              queries={queries}
              isLoading={isLoading}
            />
            <div className="absolute bottom-0 left-1/2 w-full -translate-x-1/2 transform">
              {chatPanelComponent}
            </div>
          </div>
        </div>

        <SearchSidebar
          organicSearchResults={activeSearchResults || []}
          query={queries.slice(-1).pop()?.q || ""}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          setSelectedResult={setSelectedResult}
          setActiveTab={setActiveTab}
        />
      </div>
    </motion.div>
  );
}
