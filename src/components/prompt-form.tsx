// import * as React from "react";
// import Link from "next/link";
// import Textarea from "react-textarea-autosize";
// import { UseChatHelpers } from "ai/react";

// import { useEnterSubmit } from "~/lib/hooks/use-enter-submit";
// import { cn } from "~/lib/utils";
// import { Button, buttonVariants } from "~/components/ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipTrigger,
//   TooltipProvider,
// } from "~/components/ui/tooltip";
// import { IconArrowElbow, IconPlus } from "~/components/ui/icons";

// export interface PromptProps
//   extends Pick<UseChatHelpers, "input" | "setInput"> {
//   onSubmit: (value: string) => Promise<void>;
//   isLoading: boolean;
// }

// export function PromptForm({
//   onSubmit,
//   input,
//   setInput,
//   isLoading,
// }: PromptProps) {
//   const { formRef, onKeyDown } = useEnterSubmit();
//   const inputRef = React.useRef<HTMLTextAreaElement>(null);

//   React.useEffect(() => {
//     if (inputRef.current) {
//       inputRef.current.focus();
//     }
//   }, []);

//   return (
//     <form
//       onSubmit={async (e) => {
//         e.preventDefault();
//         if (!input?.trim()) {
//           return;
//         }
//         setInput("");
//         await onSubmit(input);
//       }}
//       ref={formRef}
//     >
//       <div
//         className="relative flex max-h-60 w-full grow flex-col overflow-hidden rounded-md border-gray-400 bg-white px-8 sm:border
//       sm:px-12"
//       >
//         <TooltipProvider delayDuration={0}>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Link
//                 href="/"
//                 className={cn(
//                   buttonVariants({ size: "sm", variant: "outline" }),
//                   "absolute left-0 top-4 h-8 w-8 rounded-full bg-white p-0 sm:left-4"
//                 )}
//               >
//                 <IconPlus />
//                 <span className="sr-only">New Chat</span>
//               </Link>
//             </TooltipTrigger>
//             <TooltipContent>New Chat</TooltipContent>
//           </Tooltip>
//           <Textarea
//             ref={inputRef}
//             tabIndex={0}
//             onKeyDown={onKeyDown}
//             rows={1}
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask follow-up..."
//             spellCheck={false}
//             className="min-h-[60px] w-full resize-none border-none border-transparent bg-transparent px-4 py-[1.3rem] shadow-none outline-none ring-0 focus:border-transparent focus:ring-0 sm:text-base pr-16"
//             style={{
//               fontFamily: '"Inter", sans-serif',
//             }}
//           />
//           <div className="absolute right-0 bottom-3 sm:right-4">
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   type="submit"
//                   disabled={isLoading || input === ""}
//                   className="group inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-100 shadow-md transition-colors hover:bg-zinc-800 hover:text-zinc-300 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-gray-300 disabled:text-zinc-800 disabled:shadow-none disabled:hover:text-black"
//                 >
//                   Search
//                   <span className="text-center text-xs text-zinc-100 transition-colors group-hover:text-zinc-400 group-disabled:text-zinc-600 group-disabled:group-hover:text-zinc-600 hidden sm:block">
//                     <IconArrowElbow />
//                   </span>
//                   <span className="sr-only">Send message</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Send message</TooltipContent>
//             </Tooltip>
//           </div>
//         </TooltipProvider>
//       </div>
//     </form>
//   );
// }

import Link from "next/link";
import Textarea from "react-textarea-autosize";
import { UseChatHelpers } from "ai/react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { MicrophoneIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import {
  MicrophoneIcon as MicrophoneIconSolid,
  GlobeAltIcon as GlobeAltIconSolid,
  PaperAirplaneIcon as PaperAirplaneIconSolid,
} from "@heroicons/react/24/solid";
import { motion, useSpring } from "framer-motion";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useDemoModal } from "~/components/home/demo-modal";

import { useEnterSubmit } from "~/lib/hooks/use-enter-submit";
import { cn } from "~/lib/utils";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "~/components/ui/tooltip";
import { IconArrowElbow, IconPlus } from "~/components/ui/icons";
import Select from "react-select";
import { useSearchResultsStore } from "@/src/store/searchResultsContext";
import languages from "@/src/lib/language-options";
import Image from "next/image";
import { CircleFlag } from "react-circle-flags";

export interface PromptProps
  extends Pick<UseChatHelpers, "input" | "setInput"> {
  setShowDemoModal: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (value: string) => Promise<void>;
  isLoading: boolean;
}

type languageOption = { value: string; label: string; icon?: string };

export function PromptForm({
  setShowDemoModal,
  onSubmit,
  input,
  setInput,
  isLoading,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const { listening, browserSupportsSpeechRecognition, transcript } =
    useSpeechRecognition();
  const [selectedLanguage, setSelectedLanguage] =
    useState<languageOption | null>(
      languages.find((option) => option.value === "default") || null
    );
  const [isHovered, setIsHovered] = useState(false);
  const [language, setLanguage, newMessageIsLoading, braveResultIsLoading] =
    useSearchResultsStore((state) => [
      state.language,
      state.setLanguage,
      state.newMessageIsLoading,
      state.braveResultIsLoading,
    ]);

  const activeLanguageOption = useMemo(
    () => languages.find((option) => option.value === language) || null,
    [language]
  );

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    if (transcript !== "") {
      setInput(transcript);
    }
  }, [transcript]);

  const startRecognition = () => {
    if (browserSupportsSpeechRecognition) {
      console.log(
        `Starting speech recognition for ${
          activeLanguageOption?.value || "en-US"
        }`
      );
      SpeechRecognition.startListening({
        language: activeLanguageOption?.value || "en-US",
      });
    } else {
      console.log("Your browser does not support speech recognition");
    }
  };

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  // type LanguageOption = { value: string; label: string };

  // const handleLanguageChange = (selectedOption: LanguageOption | null) => {
  //   if (!selectedOption) {
  //     return;
  //   }
  //   setSelectedLanguage(selectedOption);
  // };
  return (
    <div className="flex items-center">
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setShowDemoModal(true)}
              className="mr-4 hidden transition-all duration-200 ease-in-out sm:block"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative h-8 w-8">
                {activeLanguageOption?.value.toLowerCase() !== "default" ? (
                  <CircleFlag
                    countryCode={
                      activeLanguageOption?.value.toLowerCase().split("-")[1] ||
                      "us"
                    }
                    height="32"
                    width="32"
                  />
                ) : (
                  <GlobeAltIcon
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className="mr-4 hidden h-8 w-8 text-gray-500 transition-all duration-200 ease-in-out sm:block"
                    onClick={() => setShowDemoModal(true)}
                    style={{ color: isHovered ? "#A5B4FC" : "#6B7280" }}
                  />
                )}
              </div>
            </button>
          </TooltipTrigger>
          <TooltipContent>Language</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!input.trim() || newMessageIsLoading || braveResultIsLoading) {
            return;
          }
          setInput("");
          await onSubmit(input);
        }}
        ref={formRef}
        className="flex-grow"
      >
        <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden rounded-md border-gray-200 px-8 sm:border sm:bg-[#F6F9FA] sm:px-12">
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ size: "sm", variant: "outline" }),
                    "absolute left-0 top-4 h-8 w-8 rounded-full bg-white p-0 shadow-sm sm:left-4"
                  )}
                >
                  <IconPlus />
                  <span className="sr-only">New Chat</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent>New Chat</TooltipContent>
            </Tooltip>

            <Textarea
              ref={inputRef}
              tabIndex={0}
              onKeyDown={onKeyDown}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask follow-up..."
              spellCheck={false}
              className="min-h-[60px] w-full resize-none border-none border-transparent bg-transparent px-4 py-[1.3rem] pr-16 shadow-none outline-none ring-0 focus:border-transparent focus:ring-0 sm:text-base"
              style={{
                fontFamily: '"Inter", sans-serif',
              }}
            />

            <div className="absolute bottom-3 right-0 flex items-end sm:right-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={(event) => {
                  event.preventDefault();
                  listening
                    ? SpeechRecognition.stopListening()
                    : startRecognition();
                }}
                // disabled={!browserSupportsSpeechRecognition}
                className="mr-2 rounded-full p-2 transition-all duration-200"
                style={{
                  backgroundColor: listening ? "#F56565" : "transparent",
                }}
              >
                {listening ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <MicrophoneIconSolid className="h-6 w-6 text-white" />
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <MicrophoneIcon className="h-6 w-6 text-gray-500" />
                  </motion.div>
                )}
              </motion.button>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="submit"
                    disabled={
                      newMessageIsLoading ||
                      braveResultIsLoading ||
                      input.trim() === ""
                    }
                    className="group inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-100 shadow-md transition-colors hover:bg-zinc-800 hover:text-zinc-300 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-gray-300 disabled:text-zinc-800 disabled:shadow-none disabled:hover:text-black"
                  >
                    {/* Search */}

                    <span className="bg-transparent text-center text-xs text-zinc-100 transition-colors group-hover:text-zinc-400 group-disabled:text-zinc-600 group-disabled:group-hover:text-zinc-600">
                      {/* <IconArrowElbow /> */}
                      <PaperAirplaneIconSolid className="h-6 w-6 bg-transparent" />
                    </span>
                    <span className="sr-only">Send message</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Send message</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      </form>
    </div>
  );
}

//   return (
//     <form
//       onSubmit={async (e) => {
//         e.preventDefault();
//         if (!input.trim()) {
//           return;
//         }
//         setInput("");
//         await onSubmit(input);
//       }}
//       ref={formRef}
//     >
//       <div
//         className="relative flex max-h-60 w-full grow flex-col overflow-hidden rounded-md border-gray-400 bg-white px-8 sm:border
//       sm:px-12"
//       >
//         <TooltipProvider delayDuration={0}>
//           <Tooltip>
//             <TooltipTrigger asChild>
//               <Link
//                 href="/"
//                 className={cn(
//                   buttonVariants({ size: "sm", variant: "outline" }),
//                   "absolute left-0 top-4 h-8 w-8 rounded-full bg-white p-0 sm:left-4"
//                 )}
//               >
//                 <IconPlus />
//                 <span className="sr-only">New Chat</span>
//               </Link>
//             </TooltipTrigger>
//             <TooltipContent>New Chat</TooltipContent>
//           </Tooltip>
//           <Textarea
//             ref={inputRef}
//             tabIndex={0}
//             onKeyDown={onKeyDown}
//             rows={1}
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             placeholder="Ask follow-up..."
//             spellCheck={false}
//             className="min-h-[60px] w-full resize-none border-none border-transparent bg-transparent px-4 py-[1.3rem] pr-16 shadow-none outline-none ring-0 focus:border-transparent focus:ring-0 sm:text-base"
//             style={{
//               fontFamily: '"Inter", sans-serif',
//             }}
//           />

//           <div className="absolute bottom-3 right-0 flex items-end sm:right-4">
//             <motion.button
//               whileHover={{ scale: 1.1 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={(event) => {
//                 event.preventDefault();
//                 listening
//                   ? SpeechRecognition.stopListening()
//                   : startRecognition();
//               }}
//               disabled={!browserSupportsSpeechRecognition}
//               className="mr-2 rounded-full p-2 transition-all duration-200"
//               style={{ backgroundColor: listening ? "#F56565" : "white" }}
//             >
//               {listening ? (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                   <MicrophoneIconSolid className="h-6 w-6 text-white" />
//                 </motion.div>
//               ) : (
//                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
//                   <MicrophoneIcon className="h-6 w-6 text-gray-500" />
//                 </motion.div>
//               )}
//             </motion.button>
//             <Tooltip>
//               <TooltipTrigger asChild>
//                 <Button
//                   type="submit"
//                   disabled={isLoading || input.trim() === ""}
//                   className="group inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-zinc-100 shadow-md transition-colors hover:bg-zinc-800 hover:text-zinc-300 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-gray-300 disabled:text-zinc-800 disabled:shadow-none disabled:hover:text-black"
//                 >
//                   Search
//                   <span className="hidden text-center text-xs text-zinc-100 transition-colors group-hover:text-zinc-400 group-disabled:text-zinc-600 group-disabled:group-hover:text-zinc-600 sm:block">
//                     <IconArrowElbow />
//                   </span>
//                   <span className="sr-only">Send message</span>
//                 </Button>
//               </TooltipTrigger>
//               <TooltipContent>Send message</TooltipContent>
//             </Tooltip>
//           </div>
//         </TooltipProvider>
//       </div>
//     </form>
//   );
// }
