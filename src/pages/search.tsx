import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import sparkles from "@/public/sparkles.svg";
import TextareaAutosize from "react-textarea-autosize";
import Tutorial from "@/src/components/shared/tutorial";
//import twitter icon from lucide-react
import { Twitter } from "lucide-react";
import Balancer from "react-wrap-balancer";
import { useRouter } from "next/router";
// import beams from "@/public/beams.jpg";
import Image from "next/image";
import Link from "next/link";
import SearchBar from "~/components/Elements/SearchBar";
import bg from "@/public/bg4.avif";
// import mindfulLogoFull from "@/public/mindfullLogoFull.svg";
import skinnyLogo from "@/public/skinnyLogo.svg";
import "cal-sans";
import Trends from "@/src/components/Content/Trends";

export default function AdvancedSearch() {
  const [query, setQuery] = useState("");
  const [isTextareaActive, setTextareaActive] = useState(false);
  const router = useRouter();

  const search = async () => {
    console.log("searching");

    if (router) {
      // Navigate to /answer route with search query as URL parameter
      router.push(`/serp?q=${query}`);
    }
  };

  const handleSearch = async (event: { preventDefault: () => void }) => {
    // check if the query is empty
    if (query === "") {
      return;
    }
    event.preventDefault();
    await search();
  };

  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // create a function that sets focus to the textarea
    const focusTextArea = () => {
      if (textAreaRef && textAreaRef.current) {
        textAreaRef.current.focus();
      }
    };

    // add a keypress event listener to the window
    window.addEventListener("keypress", focusTextArea);

    // clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("keypress", focusTextArea);
    };
  }, []); // empty dependency array ensures this effect runs once on component mount

  const handleTextAreaFocus = () => {
    setTextareaActive(true);
  };

  const handleTextAreaBlur = () => {
    setTextareaActive(false);
  };

  return (
    // add styles to the body
    // todo change a to next/link
    <>
      <div
        className="fixed h-screen w-full bg-[#EEF2F6]"
        style={{
          // background: `url(${bg.src}) no-repeat center center fixed`,
          // background: "#F9FAFB",
            // backgroundPosition: "center",
            // backgroundSize: "cover",
            // backgroundRepeat: "no-repeat",
          width: "100%",
          height: "100%",
        }}
      ></div>
      <div className="flex min-h-screen w-full flex-col items-center justify-center ">
        {/* <div
          className="absolute left-0 top-0 h-full w-full hidden sm:block"
          style={{
            marginLeft: "2rem",
            marginTop: "2rem",
          }}
        >
          <Image src={skinnyLogo} alt="Logo" width={200} height={200} />
        </div> */}
        <div className="relative flex min-h-screen flex-col overflow-hidden w-full">
          <div
            className="w-full text-center mt-20 mb-4"
            // style={{
            //   marginBottom: "1.2rem",
            //   marginTop: "6rem",
            // }}
          >
            <p
              className=" text-center text-lg text-gray-800"
              style={{
                fontFamily: "Cal Sans, Inter",
                fontSize: "4.3rem",
                // fontWeight: "400",
                // lineHeight: "1.75rem",
                // letterSpacing: "-0.025em",
                marginBottom: "1rem",
                // marginTop: "1rem",
              }}
            >
              <span
                style={{
                  display: "inline-block",
                  verticalAlign: "top",
                  textDecoration: "inherit",
                  maxWidth: "298.2px",
                }}
              >
                <Balancer>
                  MindfulQ
                </Balancer>
              </span>
            </p>
            
            <p className="text-center text-lg text-gray-400 mt-6 mb-4 sm:mb-6"
              style={{
                fontFamily: "Inter",
                fontSize: "1.05rem",
              }}
            >
              <Balancer>

              <span
                className="text-center text-gray-500
                "
              >
                
                Search re-envisioned from the ground up with{" "}
              </span>{" "}
              <span
                style={{
                  background: "linear-gradient(to right, #ff79c6, #bd93f9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  color: "#6272a4",
                  fontWeight: "bold",
                }}
              >
                ChatGPT
              </span>
              </Balancer>
            </p>
          </div>
          <SearchBar />
          <Trends />


          

          {/* <div className="container mx-2 mb-4 mt-16 grid grid-cols-1 gap-4 pb-11 pt-6 text-center md:grid-cols-2 md:pt-4">
            <Link href="/search?query=history%20of%20argentina">
              <button
                type="button"
                className="hover:shadow-3xl inline-flex items-center justify-center gap-1 rounded-lg border border-white border-opacity-20 bg-white/30 px-5 py-4 text-start font-bold text-gray-900 shadow-2xl backdrop-blur-md backdrop-filter transition-all duration-300 ease-in-out hover:bg-white/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-60"
                style={{
                  textShadow: "0 0 0.5rem rgba(0, 0, 0, 0.25)",
                  color: "#A78BFA",
                  fontSize: "18px",
                  backdropFilter: "blur(20px)",
                  marginTop: "7rem",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mr-2 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                I'm writing a report on the history of Argentina. Ok?
              </button>
            </Link>
            <Link href="/search?query=history%20of%20argentina">
              <button
                type="button"
                className="hover:shadow-3xl inline-flex items-center justify-center gap-1 rounded-lg border border-white border-opacity-20 bg-white/30 px-5 py-4 text-start font-bold text-gray-900 shadow-2xl backdrop-blur-md backdrop-filter transition-all duration-300 ease-in-out hover:bg-white/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-60"
                style={{
                  textShadow: "0 0 0.5rem rgba(0, 0, 0, 0.25)",
                  fontSize: "18px",
                  color: "#A78BFA",
                  backdropFilter: "blur(20px)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mr-2 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Google is dead. What's the best search engine?
              </button>
            </Link>
            <Link href="/search?query=history%20of%20argentina">
              <button
                type="button"
                className="hover:shadow-3xl inline-flex items-center justify-center gap-1 rounded-lg border border-white border-opacity-20 bg-white/30 px-5 py-4 text-start font-bold text-gray-900 shadow-2xl backdrop-blur-md backdrop-filter transition-all duration-300 ease-in-out hover:bg-white/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-60"
                style={{
                  textShadow: "0 0 0.5rem rgba(0, 0, 0, 0.25)",
                  fontSize: "18px",
                  color: "#A78BFA",
                  backdropFilter: "blur(20px)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mr-2 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Under no circumstances should you ever eat a taco on a Tuesday.
              </button>
            </Link>
            <Link href="/search?query=history%20of%20argentina">
              <button
                type="button"
                className="hover:shadow-3xl inline-flex items-center justify-center gap-1 rounded-lg border border-white border-opacity-20 bg-white/30 px-5 py-4 text-start font-bold text-gray-900 shadow-2xl backdrop-blur-md backdrop-filter transition-all duration-300 ease-in-out hover:bg-white/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-60"
                style={{
                  textShadow: "0 0 0.5rem rgba(0, 0, 0, 0.25)",
                  fontSize: "18px",
                  color: "#A78BFA",
                  backdropFilter: "blur(20px)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mr-2 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Why is the sky blue?
              </button>
            </Link>
            <Link href="/search?query=history%20of%20argentina">
              <button
                type="button"
                className="hover:shadow-3xl inline-flex items-center justify-center gap-1 rounded-lg border border-white border-opacity-20 bg-white/30 px-5 py-4 text-start font-bold text-gray-900 shadow-2xl backdrop-blur-md backdrop-filter transition-all duration-300 ease-in-out hover:bg-white/10 disabled:bg-gray-50 disabled:text-gray-500 disabled:opacity-60"
                style={{
                  textShadow: "0 0 0.5rem rgba(0, 0, 0, 0.25)",
                  fontSize: "18px",
                  color: "#A78BFA",
                  backdropFilter: "blur(20px)",
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="mr-2 h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                Find me the best recipe for a chocolate cake
              </button>
            </Link>
          </div> */}

          {/* <Tutorial /> */}
        </div>
      </div>
    </>
  );
}
