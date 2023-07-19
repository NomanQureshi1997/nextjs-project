import React, { useState, useEffect } from "react";
import { SearchIcon } from "lucide-react";
import { ArrowSmallLeftIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import TextareaAutosize from "react-textarea-autosize";
import clsx from "clsx";
import { motion } from "framer-motion";
import mindfulLogo from "@/public/m.svg";
import Image from "next/image";
import fetchJsonp from "fetch-jsonp";
import useWindowSize from "@/src/lib/hooks/use-window-size";
import "cal-sans";
import Highlighter from "react-highlight-words";

type SearchBarProps = {
  hideButtons?: boolean;
};

const SearchBar = ({ hideButtons }: SearchBarProps) => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isActive, setIsActive] = useState(false); // add this state variable
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { isDesktop, isMobile } = useWindowSize();

  const router = useRouter();

  const search = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!query) {
      return;
    }

    router.push(`/serp?q=${query}`);
  };

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    fetchJsonp(
      `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${query}`
    )
      .then((response) => response.json())
      .then((data) => {
        const suggestions = data[1]; // Get the actual suggestions from the response.
        setSuggestions(suggestions);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }, [query]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  return (
    <div
      className={`mb-6 flex w-full flex-col items-center justify-start sm:h-auto sm:min-w-[630px] sm:justify-center
  ${isActive && isMobile ? "absolute left-0 top-0 h-screen w-full" : "px-4"}`}
    >
      <form
        className={clsx(
          "flex w-full flex-grow flex-col items-center bg-white sm:w-full sm:max-w-xl sm:pt-0 lg:max-w-2xl rounded-3xl",
          {
            // "rounded-sm border border-gray-200": !isActive,
            "border-b border-gray-300": isActive && isMobile,
            "shadow-lg": query,
            // "rounded-2xl": isActive || query,
            // "rounded-sm": !isActive || !query,
          }
        )}
      >
        <div
          className={clsx(
            "relative flex w-full items-center rounded-2xl bg-white px-5 py-3"
          )}
        >
          {isActive && isMobile ? (
            <ArrowSmallLeftIcon
              className="absolute left-3 top-4 text-zinc-400"
              style={{ zIndex: 10 }}
              width={30}
              height={30}
            />
          ) : (
            <div>
              <Image
                src={mindfulLogo}
                alt="Mindful logo"
                className="absolute left-3 top-3 text-blue-400"
                style={{ zIndex: 10 }}
                width={45}
                height={45}
              />

              {query && (
                <div className="absolute left-16 top-5 h-[25px] border-l border-gray-300"></div>
              )}
            </div>
          )}

          <TextareaAutosize
            id="search"
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (!query) {
                return;
              }
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                router.push(`/serp?q=${query}`);
              }
            }}
            className={clsx(
              "block flex-grow resize-none border-0 border-transparent bg-transparent bg-white pr-24 text-gray-700 placeholder-gray-500 focus:border-transparent focus:outline-none focus:ring-0",
              {
                "ml-12": !isActive || !isMobile,
                "ml-4": isActive && isMobile,
                "rounded-2xl": suggestions && suggestions.length > 0,
                "rounded-sm": !suggestions || suggestions.length === 0,
              }
            )}
            style={{
              fontFamily:
                "Helvetica, ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji",
              fontSize: "1.1rem",
              fontWeight: 300,
            }}
            placeholder={
              isDesktop
                ? "Your hardest queries go here..."
                : "find anything..."
            }
          />
          {query && (
            <XMarkIcon
              className="absolute right-20 top-5 hidden h-6 w-6 cursor-pointer text-gray-300 sm:block"
              onClick={() => {
                setQuery("");
                setIsActive(false);
              }}
            />
          )}
          <motion.div
            className={clsx(
              "absolute bottom-3 right-2 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-500 ease-in-out",
              { "border  border-none bg-[#cb6ce6]": query }
            )}
            animate={{ scale: query ? 1.1 : 1 }} // very short duration
            transition={{ duration: 0, ease: "easeInOut" }}
          >
            {isActive && query && (
              <div
                className="absolute top-2 hidden h-[25px] border-l border-gray-300 sm:block"
                style={{ right: "53px" }}
              ></div>
            )}

            <SearchIcon
              className={clsx("transition-colors duration-100 ease-out", {
                "text-black": query,
                "text-[#007BFF]": !query,
              })}
            />
          </motion.div>
        </div>

        <div className="h-full w-full bg-white sm:max-w-xl sm:bg-transparent lg:max-w-2xl">
          <ul
            className="text-md w-full rounded-b-2xl bg-white sm:max-w-xl lg:max-w-2xl
        "
          >
            {(isActive || isDesktop) &&
              suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`flex cursor-pointer pl-2 hover:bg-gray-100 sm:pl-4 ${
                    index === 0 ? "border-t border-gray-200" : ""
                  } ${index === suggestions.length - 1 ? "rounded-b-2xl" : ""}`}
                  onClick={() => setQuery(suggestion)}
                >
                  <div className="flex-shrink-0 p-3 px-2 sm:px-3">
                    <SearchIcon size={16} strokeWidth={3} className="text-gray-600 sm:mr-3"/>
                  </div>
                  <div className="flex-1 p-2"
                    style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif" }}
                  >
                    <Highlighter
                      highlightTag="span" // Use a span tag for the highlighted text
                      highlightClassName="font-normal text-gray-500" // This applies the "font-normal" class to the query
                      searchWords={[query]}
                      autoEscape={true}
                      textToHighlight={suggestion}
                      className="text-gray-700 font-semibold" // Apply "font-bold" to the whole text
                    />
                  </div>
                  <div className="flex-shrink-0 p-2">
                    <i
                      className="fas fa-arrow-up text-gray-400"
                      style={{ fontSize: "18px" }}
                    ></i>
                  </div>
                </div>
              ))}
          </ul>
        </div>
      </form>
    </div>
  );
};

export default SearchBar;
