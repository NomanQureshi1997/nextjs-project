import { useState, useRef } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "~/components/ui/button";
import { type } from "os";


interface searchProps {
  placeholder?: string;
  styles?: any;
  type?: "edit" | "follow up";
}

export default function ResultSearchBar(props: searchProps) {
  const [query, setQuery] = useState("");
  const [isTextareaActive, setTextareaActive] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextAreaFocus = () => {
    setTextareaActive(true);
  };

  const handleTextAreaBlur = () => {
    setTextareaActive(false);
  };

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <form className="relative block w-full">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <div
      >
        <div
          className={`relative flex items-stretch justify-between rounded-md border border-gray-500 bg-white bg-opacity-100 bg-clip-padding px-3 py-2 shadow-xl backdrop-blur-lg backdrop-filter
        ${
          isTextareaActive ? "ring-4 ring-purple-800" : "ring-1 ring-gray-900/5"
        }`}
          style={{
            position: "relative",
            zIndex: 1,
            transition: "box-shadow 0.3s ease-in-out",
            boxShadow: isTextareaActive
              ? "0 0 10px 3px rgba(140, 0, 180, 0.8)"
              : "0 0 1px 1px",
            borderTop: "5px solid",
            borderTopColor: "#aeb5a0",
          }}
        >
          <TextareaAutosize
            id="search"
            ref={textAreaRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`block flex-grow resize-none rounded border-0 border-transparent bg-transparent pl-3 pr-5 font-sans font-medium text-gray-700 placeholder-gray-400 focus:border-transparent focus:outline-none focus:ring-0 sm:text-lg md:text-2xl`}
            placeholder={props.placeholder}
            onFocus={handleTextAreaFocus}
            onBlur={handleTextAreaBlur}
          />
          <div className="mb-[0.15rem] flex items-end">
            {props.type === "edit" ? (
              <Button type="submit" className="ml-3 lg:min-w-[8rem] lg:text-lg">
                Search
              </Button>
            ) : (
              <Button type="submit" className="ml-3 sm:min-w-[10rem] lg:min-w-[8rem] lg:text-lg">
                Follow Up
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
