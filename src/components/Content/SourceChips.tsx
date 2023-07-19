import React, { useState } from "react";
import { Message } from "ai";
import { OrganicResultWithDiffbot } from "@/src/types";
import Image from "next/image";
import globeFavicon from "@/public/globeFavicon.png";
import psl from "psl";

// import { RefIcon } from "./LeftTabs";

interface SourceChipsProps {
  organicResultsWithDiffbot: OrganicResultWithDiffbot[];
  messageId: string;
  message: Message;
  isLoading: boolean;
}

const SourceChips: React.FC<SourceChipsProps> = ({
  organicResultsWithDiffbot,
  messageId,
  message,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const activeResults = organicResultsWithDiffbot.filter(
    (result) =>
      result.messageId === messageId &&
      new RegExp(`\\[${result.position}\\.[a-zA-Z]\\]`).test(message.content)
  );

  const itemsToShow = 3;
  const initialItems = activeResults.slice(0, itemsToShow);
  const moreItems = activeResults.slice(itemsToShow);


  return (
    <div className="mx-auto mt-2 flex max-w-3xl flex-wrap">
      {initialItems.map((result) => (
        <SourceChipItem
          key={`${result.link}-${result.position}`} // updated here
          result={result}
          isLoading={isLoading}
          message={message}
        />
      ))}

      {isOpen &&
        moreItems.map((result) => (
          <SourceChipItem
            key={`${result.link}-${result.position}`} // updated here
            result={result}
            isLoading={isLoading}
            message={message}
          />
        ))}

      {moreItems.length > 0 && (
        <div className="my-2 mr-2 flex items-center rounded-full border border-gray-200 bg-white sm:bg-zinc-200 px-2 py-1">
          <button
            onClick={() => setIsOpen((prevState) => !prevState)}
            className="text-black-500 hover:text-black-700 mx-2 ml-2 hover:underline"
          >
            {isOpen ? "Show Less" : "Show More"}
          </button>
        </div>
      )}
    </div>
  );
};

const SourceChipItem = ({
  result,
  isLoading,
  message,
}: {
  result: OrganicResultWithDiffbot;
  isLoading: boolean;
  message: Message;
}) => {
  const [src, setSrc] = useState(result.favicon);
    const urlObj = new URL(result.link);
    const parsed = psl.parse(urlObj.hostname);

    let domain: string;
    if ('domain' in parsed) {
      // parsed is a ParsedDomain
      domain = parsed.domain ?? result.link;
    } else {
      // parsed is a ParseError
      domain = result.link;
}

  if (new RegExp(`\\[${result.position}\\.[a-zA-Z]\\]`).test(message.content)) {
    return (
      <div className="my-2 mr-2 flex items-center rounded-full border border-gray-200 bg-white px-2 py-1 sm:bg-transparent">
        <Image
          className="object-cover rounded-full"
          src={src}
          alt="favicon"
          width={20}
            height={20}
          onError={() => setSrc(globeFavicon.src)}
        />
        <a
          href={result.link}
          target="_blank"
          rel="noreferrer"
          className="text-black-500 hover:text-black-700 ml-2 hover:underline"
        >
          {domain}
        </a>
        {result.position && (
          <div>
            <div className="ml-2 flex h-4 w-4 items-center justify-center rounded-full bg-gray-200 text-xs text-gray-600">
              {result.position}
            </div>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default SourceChips;
