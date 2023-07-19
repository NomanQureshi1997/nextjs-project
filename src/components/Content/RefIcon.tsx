import { OrganicResultWithDiffbot, SearchParamsType } from "@/src/types";
import { List, ExternalLink, AlertCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import Parser from "html-react-parser";
import { cn } from "~/lib/utils";
import React from "react";
import { useSearchResultsStore } from "@/src/store/searchResultsContext";


import Balancer from "react-wrap-balancer";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";

interface RefIconProps {
    refNum: string;
    refLink: string;
    refResult: OrganicResultWithDiffbot | undefined;
    className?: string;
    isLoading?: boolean;
    chosenSnippet?: string;
  }

export const RefIcon: React.FC<RefIconProps> = ({
    refNum,
    refLink,
    refResult,
    className,
    isLoading,
    chosenSnippet,
  }) => {
    const { newMessageIsLoading, setSelectedSearchResultIndex } =
      useSearchResultsStore();
  
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger>
            <div>
              <span
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedSearchResultIndex(
                    parseInt(refNum.split(".")[0] ?? "1"),
                    refResult?.messageId ?? "",
                    refNum
                  );
                  console.log(
                    parseInt(refNum.split(".")[0] ?? "1"),
                    "position to scroll to"
                  );
                  console.log(
                    refResult?.messageId ?? "",
                    "messageId to scroll to"
                  );
                }}
                // href={refLink}
                // target="_blank"
                // rel="noreferrer"
                className={
                  className
                    ? className
                    : // : "mr-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-gray-300 text-xs text-gray-800 hover:bg-gray-400 hover:text-gray-900"
                      "mr-1 inline-flex items-center rounded-sm bg-blue-100 font-medium text-blue-800 hover:bg-blue-200 hover:text-blue-800"
                }
                style={{
                  // textDecoration: className ? "none" : "underline",
                  textDecoration: "none",
                  transform: "translateY(-5px) translateX(2px)",
                  fontSize: "0.7rem",
                  // bold
                  fontWeight: "600",
                  top: "-1px",
                  // margin: "0px 2px",
                  minWidth: "14px",
                  height: "14px",
                  textDecorationColor: "transparent",
                  outline: "transparent solid 1px",
                  padding: `${className ? "1px 4px" : "0.6rem 0.25rem"}`,
                  // marginLeft: `${className ? "0.3rem" : "0rem"}`,
                  // marginBottom: `${className ? "0.3rem" : "0rem"}`,
                }}
              >
                {`${refNum.split(".")[0]}${refNum.split(".")[1] ?? ""}`}
              </span>
            </div>
          </TooltipTrigger>
  
          <TooltipContent
            side="bottom"
            className={cn("z-50 max-w-sm bg-gray-50 shadow-md", {
              hidden: newMessageIsLoading,
            })}
            style={{
              padding: "10px",
              borderRadius: "10px",
              // boxShadow: "0px 10px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="flex items-center justify-center">
              <Button
                disabled={newMessageIsLoading}
                className="mx-2 mb-2 w-full"
                variant="outline"
              >
                <List className="mr-2 h-4 w-4" />
                Summarize Source
              </Button>
            </div>
  
            {refResult ? (
              <div
                className="flex gap-4 break-words rounded-md bg-gray-50 p-4"
                style={{ marginTop: "7px" }}
              >
                <div className="flex flex-col items-center justify-start">
                  <ExternalLink color="#4A5568" className="h-4 w-4" />
                </div>
                <div className="flex flex-1 flex-col gap-4">
                  <a
                    href={refResult?.link}
                    target="_blank"
                    className="text-base font-semibold text-gray-700"
                    style={{ textDecoration: "none" }}
                  >
                    <Balancer>{refResult?.title}</Balancer>
                  </a>
                  <div className="divider h-[1px] w-full bg-gray-300"></div>
                  <div className="relative mt-1 flex items-center gap-1">
                    <div>
                      <Image
                        src={refResult?.favicon}
                        alt="favicon"
                        width={20}
                        height={20}
                        className="absolute -left-9 -top-6 rounded-md border border-gray-300"
                      />
                    </div>
                    <span className="text-sm text-gray-500">
                      {refResult?.displayLink.replace("www.", "")}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <Balancer>
                      {Parser(chosenSnippet || refResult?.snippet.text || "")}
                    </Balancer>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="flex items-center justify-center rounded-lg bg-gray-50 p-6 shadow-lg"
                style={{ marginTop: "15px" }}
              >
                <AlertCircle
                  size="24"
                  color="#A0AEC0"
                  className="mr-2 h-5 w-5 text-gray-500"
                />
                <div className="text-lg font-semibold text-gray-500">
                  Preview not available for this source
                </div>
              </div>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };