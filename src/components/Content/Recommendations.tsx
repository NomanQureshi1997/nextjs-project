import React, { useRef, useEffect } from "react";
import { type Message } from "ai";
import { PlusIcon, Bars3Icon } from "@heroicons/react/24/solid";
import "cal-sans";
import useWindowSize from "~/lib/hooks/use-window-size";
import { useSearchResultsStore } from "@/src/store/searchResultsContext";

interface Recommendation {
  followUpQueryId: string;
  followUpQuery: string;
  messageId: string;
}

interface RecommendationsProps {
  recommendations: Recommendation[];
  message: Message;
  newMessageIsLoading: boolean;
  braveResultIsLoading: boolean;
  parentId: string;
}

const Recommendations: React.FC<RecommendationsProps> = ({
  recommendations,
  message,
  newMessageIsLoading,
  braveResultIsLoading,
  parentId,
}) => {
  const recommendationRef = useRef<HTMLDivElement | null>(null);
  const windowSize = useWindowSize();
  const onSubmit = useSearchResultsStore((state) => state.onSubmit);

  useEffect(() => {
    if (windowSize.isDesktop) {
      recommendationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [newMessageIsLoading, windowSize.isDesktop]);

  if (
    !newMessageIsLoading &&
    recommendations &&
    recommendations.length > 0 &&
    // messages[messages.length - 1]?.id === recommendations[0]?.messageId &&
    message?.role === "assistant" &&
    parentId === recommendations[0]?.messageId &&
    !braveResultIsLoading
  ) {
    return (
      <div
    //   bg-[#f6f7f8]
      
        className="mx-auto mt-2 max-w-3xl overflow-hidden rounded-lg sm:bg-[#f6f7f8]" // updated here
        style={{ border: "1px solid #e8ebee" }}
        ref={recommendationRef}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center">
            <Bars3Icon className="h-6 w-6 text-blue-500" />
            <h2
              className="ml-4 text-gray-700"
              style={{ fontFamily: "Cal Sans" }}
            >
              Related
            </h2>
          </div>
        </div>
        {recommendations.map((recommendation: Recommendation) => (
          <div
            key={recommendation.followUpQueryId}
            className="border-t border-gray-200 px-6 py-4"
            // onClick={() => {
            //     window.open(
            //       `https://www.google.com/search?q=${recommendation.followUpQuery}`,
            //       "_blank"
            //     );
            //   }}
            onClick={() => {
                onSubmit(recommendation.followUpQuery);
                }}
          >
            <div
              className="flex items-center justify-between space-x-2"
            >
              <h2
                className="cursor-pointer font-medium text-gray-700 hover:text-blue-500"
                style={{ fontFamily: "Cal Sans" }}
              >
                {recommendation.followUpQuery}
              </h2>
              <button className="rounded p-1 transition duration-300 ease-in-out">
                <PlusIcon className="h-6 w-6 text-blue-500 ease-in-out" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default Recommendations;
