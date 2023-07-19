import WebSearchResults from "@/src/components/WebSearchResults";
import Link from "next/link";
import { GetServerSideProps } from 'next';

type SearchParamsType = {
  searchTerm: string;
  start: string;
};

interface WebSearchPageProps {
  results: any;
}

const WebSearchPage: React.FC<WebSearchPageProps> = ({ results }) => {
  if (!results) {
    return (
      <div className="flex flex-col justify-center items-center pt-10">
        <h1 className="text-3xl mb-4">No results found</h1>
        <p className="text-lg">
          Try searching for something else or go back to the homepage{" "}
          <Link href="/">
            <a className="text-blue-500">Home</a>
          </Link>
        </p>
      </div>
    );
  }

  return <div>{JSON.stringify(results)}</div>;
  
  // return <WebSearchResults results={results} />;
};

export default WebSearchPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const searchParams: SearchParamsType = {
      searchTerm: context.query.searchTerm as string,
      start: context.query.start as string,
    };
  const startIndex = searchParams.start || "1";
  await new Promise((resolve) => setTimeout(resolve, 2000));
  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_SEARCH_API_KEY}&cx=${process.env.GOOGLE_SEARCH_CONTEXT_KEY}&q=${searchParams.searchTerm}&start=${startIndex}`
  );

  if (!response.ok) {
    console.log(response);
    throw new Error("Something went wrong");
  }

  const data = await response.json();
  const results = data.items;

  return { props: { results: data } };
}
