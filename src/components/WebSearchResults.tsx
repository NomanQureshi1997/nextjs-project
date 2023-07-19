import Link from "next/link";
import Parser from "html-react-parser";
import PaginationButtons from "@/src/components/PaginationButtons";
import SearchBar from "@/src/components/Elements/SearchBar";

type Item = {
  title: string;
  link: string;
  formattedUrl: string;
  htmlSnippet: string;
};

type SearchInformation = {
  formattedTotalResults: string;
  formattedSearchTime: string;
};

type Result = {
  items?: Item[];
  searchInformation?: SearchInformation;
};

interface WebSearchResultsProps {
  results: Result;
}

export default function WebSearchResults({ results }: WebSearchResultsProps) {
  return (
    <div>a</div>
    // <div className="w-full mx-auto px-3 pb-40 sm:pb-24 sm:pl-[5%] md:pl-[14%] lg:pl-52">
    //   {/* <SearchBar hideButtons /> */}
    //   <p className="text-gray-600 text-sm mb-5 mt-3">
    //     About {results.searchInformation?.formattedTotalResults} results (
    //     {results.searchInformation?.formattedSearchTime} seconds)
    //   </p>
    //   {results.items?.map((result) => (
    //     <div className="mb-8 max-w-xl" key={result.link}>
    //       <div className="group flex flex-col">
    //         <a className="text-sm truncate" href={result.link}>
    //           {result.formattedUrl}
    //         </a>
    //         <a
    //           className="group-hover:underline decoration-blue-800 text-xl truncate font-medium text-blue-800"
    //           href={result.link}
    //         >
    //           {result.title}
    //         </a>
    //       </div>
    //       <p className="text-gray-600">{Parser(result.htmlSnippet)}</p>
    //     </div>
    //   ))}
    //   <PaginationButtons />
    // </div>
  );
}
