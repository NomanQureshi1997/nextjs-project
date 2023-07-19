import WebSearchResultsSerp from "@/src/components/WebSearchResultsSerp";
import Link from "next/link";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import { useChat, type Message } from "ai/react";
import { v4 as uuidv4 } from "uuid";
import YAML from "yaml";
import { ChatPanel } from "~/components/ui/chat-panel";
import { toast } from "react-hot-toast";
import { useSearchResultsStore } from "@/src/store/searchResultsContext";
import {
  ISerpApiResponse,
  OrganicResultWithDiffbot,
  SearchParamsType,
  SnippetType,
} from "@/src/types";
import { getPrompt } from "~/prompts/serpPrompt";
import { useDemoModal } from "~/components/home/demo-modal";
import z from "zod";

const NO_RESULTS_FOUND = "No results found";
const HOME = "Home";

interface ISerpApiResponseOptionalError extends ISerpApiResponse {
  error?: Error;
}

const WebSearchPage: React.FC<ISerpApiResponseOptionalError> = ({
  organicResults,
  serpQuery,
  naturalQuery,
  query,
  messageId,
  error,
}) => {
  const {
    organicResultsWithDiffbot,
    setOrganicResultsWithDiffbot,
    queries,
    addQuery,
    setActiveMessageId,
    activeQuery,
    setActiveQuery,
    activeMessageId,
    activeResults,
    newMessageIsLoading,
    setNewMessageIsLoading,
    setRecommendations,
    setNewMessageOrBraveIsLoading,
    setSearchParams,
  } = useSearchResultsStore((state) => ({
    organicResultsWithDiffbot: state.organicResultsWithDiffbot,
    setOrganicResultsWithDiffbot: state.setOrganicResultsWithDiffbot,
    queries: state.queries,
    addQuery: state.addQuery,
    setActiveMessageId: state.setActiveMessageId,
    activeQuery: state.activeQuery,
    setActiveQuery: state.setActiveQuery,
    activeMessageId: state.activeMessageId,
    activeResults: state.activeResults,
    newMessageIsLoading: state.newMessageIsLoading,
    setNewMessageIsLoading: state.setNewMessageIsLoading,
    setRecommendations: state.setRecommendations,
    setNewMessageOrBraveIsLoading: state.setNewMessageOrBraveIsLoading,
    setSearchParams: state.setSearchParams,
  }));

  const { DemoModal, setShowDemoModal } = useDemoModal();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMessages([]);
    processOrganicResults();
    console.log("processing organic results", organicResults[0]);
  }, [organicResults]);

  const processOrganicResults = () => {
    setActiveMessageId(messageId);

    const newOrganicResults = organicResults.map((result, index) => ({
      ...result,
      messageId: messageId,
    }));

    console.log("serpQuery", serpQuery);

    addQuery({
      messageId: messageId,
      q: serpQuery,
    }); //TODO this is async hell

    setOrganicResultsWithDiffbot(
      newOrganicResults,
      messageId,
      {
        q: serpQuery,
        messageId: messageId,
      },
      true
    );

    setLoading(true);
  };

  const {
    messages,
    append,
    reload,
    stop,
    isLoading,
    input,
    setInput,
    setMessages,
  } = useChat({
    api: "/api/chat",
    onResponse(response) {
      // TODO do I even have a toaster?
      if (response.status === 401) {
        console.log("401 error in chat");
        toast.error(response.statusText);
      }
    },
  });

  useEffect(() => {
    // makes sure newMessageIsLoading is always equal to isLoading
    if (isLoading !== newMessageIsLoading) {
      setNewMessageIsLoading(isLoading);
    }

    if (!isLoading) {
      setNewMessageOrBraveIsLoading(false);
    }
  }, [isLoading]);

  const generateSummary = async (
    searchQuery: string,
    stringOrganicResults: string
  ) => {
    const prompt = getPrompt(searchQuery, stringOrganicResults);
    const message: Message = {
      role: "user",
      content: prompt,
      id: activeMessageId,
      createdAt: new Date(),
    };

    console.log("activeMessageId", activeMessageId);
    console.log("activeQuery", activeQuery);
    console.log("queries", queries);
    console.log("activeResults", activeResults);
    console.log("organicResultsWithDiffbot", organicResultsWithDiffbot);
    console.log("messages", messages);
    console.log("SearchQuery", searchQuery);
    console.log("stringOrganicResults", stringOrganicResults);

    append(message);
  };

  //   {
  //     "query": "Who won the world cup in 2022?",
  //     "serpResults": "According to various sources, the team that won the world cup in 2022 was Team X.",
  //     "messageId": "1234abcd"
  // }
  const generateRecommendations = async (
    searchQuery: string,
    stringOrganicResultsWithoutExtraSnippets: string,
    messageId: string
  ) => {
    try {
      const recommendations = await fetch(
        "http://localhost:3000/api/recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: searchQuery,
            serpResults: stringOrganicResultsWithoutExtraSnippets,
            messageId: messageId,
          }),
        }
      );

      if (!recommendations.ok) {
        throw new Error("Something went wrong with recommendations");
      }

      const recommendationsSchema = z.object({
        messageId: z.string(),
        followUpQuery: z.string(),
        followUpQueryId: z.string(),
      });

      const recommendationsArraySchema = z.array(recommendationsSchema);

      const recommendationsArray = recommendationsArraySchema.parse(
        await recommendations.json()
      );

      console.log(recommendationsArray);

      setRecommendations(recommendationsArray);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (activeResults?.length > 0) {
      processResults();
    }
  }, [organicResultsWithDiffbot]);

  const processResults = () => {
    console.log("processing results");
    const organicResultsShort: OrganicResultWithDiffbot[] = activeResults.slice(
      0,
      7
    );

    const organicResultsShortWithoutSnippets = organicResultsShort.map(
      (result) => ({
        ...result,
        extraSnippets: undefined,
        snippet: undefined,
      })
    );

    const noExtraSnippetsYamlString = YAML.stringify(
      organicResultsShortWithoutSnippets
    );

    console.log(noExtraSnippetsYamlString);

    const resultsString = organicResultsShort.map(
      (result) => formatResults(result) //TODO make sure the extra metadata is removed from the results
    );

    const resultYamlString = YAML.stringify(resultsString);

    if (!resultYamlString) {
      console.log("no result yaml string");
      return;
    }
    console.log("generating summary");
    if (resultYamlString && activeQuery?.q) {
      generateSummary(activeQuery.q, resultYamlString);
      generateRecommendations(
        activeQuery.q,
        noExtraSnippetsYamlString,
        activeQuery.messageId
      );
    }
  };

  const formatResults = (result: OrganicResultWithDiffbot) => {
    interface SnippetForAI {
      alphaId: string;
      text: string;
    }

    interface resultObj {
      title: string;
      url: string;
      snippets: SnippetForAI[];
    }
    let resultObj: resultObj = {
      title: result.title,
      url: result.link,
      snippets: [],
    };

    if (result.snippet.text) {
      resultObj.snippets = result.extraSnippets
        ? [
            {
              alphaId: `[${result.snippet.snippetAlphaID}]`,
              text: result.snippet.text,
            },
            ...result.extraSnippets.map((snippet) => ({
              alphaId: `[${snippet.snippetAlphaID}]`,
              text: snippet.text,
            })),
          ]
        : [
            {
              alphaId: `[${result.snippet.snippetAlphaID}]`,
              text: result.snippet.text,
            },
          ];
    }

    return resultObj;
  };

  if (
    !organicResultsWithDiffbot ||
    (organicResultsWithDiffbot.length === 0 && !newMessageIsLoading)
  ) {
    return renderNoResultsFound();
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return renderResults();

  function renderNoResultsFound() {
    return (
      <div className="flex flex-col items-center justify-center pt-10">
        <h1 className="mb-4 text-3xl">{NO_RESULTS_FOUND}</h1>
        <div className="text-lg">
          <p>Try searching for something else or go back to the homepage </p>
          <div className="flex items-center justify-center">
            <Link href="/" className="text-blue-500 hover:underline">
              {HOME}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  function renderResults() {
    return (
      <div className="relative min-h-screen pb-16">
        <DemoModal />
        <WebSearchResultsSerp
          organicSearchResults={[organicResultsWithDiffbot] || []}
          conversation={messages}
          isLoading={isLoading}
          activeSearchResults={activeResults}
          // setActiveSearchResults={setActiveSearchResults}
          queries={queries}
          chatPanelComponent={
            <ChatPanel
              id="chat-panel"
              isLoading={isLoading}
              stop={stop}
              append={append}
              reload={reload}
              input={input}
              setInput={setInput}
              messages={messages}
              setShowDemoModal={setShowDemoModal}
            />
          }
        />
      </div>
    );
  }
};

export default WebSearchPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const query = context.query.q as string;

  if (!query) {
    return {
      props: { error: "Query parameter 'q' is missing" },
    };
  }

  if (query.length < 2) {
    // Check for minimum length, adjust number to suit your needs.
    return {
      props: { error: "Query parameter 'q' is too short" },
    };
  }

  const searchParams: SearchParamsType = {
    q: query,
    messageId: uuidv4(),
  };

  console.log(searchParams, "searchParams");

  try {
    console.log(
      `Calling autopromptBrave from serp API with searchParams: `,
      searchParams
    );
    const response = await fetch("http://localhost:3000/api/autopromptBrave", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchParams),
    });

    if (!response.ok) {
      console.log(response);
      throw new Error("Something went wrong");
    }

    const results: ISerpApiResponse = await response.json();

    return { props: { ...results, messageId: searchParams.messageId } };
  } catch (err) {
    let errMsg = "An error occurred.";
    if (err instanceof Error) {
      errMsg = err.message;
    }
    return { props: { error: errMsg } };
  }
};

// import WebSearchResultsSerp from "@/src/components/WebSearchResultsSerp";
// import Link from "next/link";
// import { GetServerSideProps } from "next";
// import { useEffect, useState } from "react";
// import { useChat, type Message } from "ai/react";
// import { v4 as uuidv4 } from "uuid";
// import YAML from "yaml";
// import { ChatPanel } from "~/components/ui/chat-panel";
// import { toast } from "react-hot-toast";
// import { useSearchResultsStore } from "@/src/store/searchResultsContext";
// import {
//   ISerpApiResponse,
//   OrganicResultWithDiffbot,
//   SearchParamsType,
// } from "@/src/types";
// import { getPrompt } from "~/prompts/serpPrompt";

// type ResultsType = OrganicResultWithDiffbot[][];

// const WebSearchPage: React.FC<ISerpApiResponse> = ({
//   organicResults,
//   serpQuery,
//   naturalQuery,
//   query,
//   messageId,
// }) => {
//   // const [results, setResults] = useState<ResultsType>([
//   //   organicResults.map((result, index) => ({
//   //     ...result,
//   //     messageId: messageId,
//   //     id: index,
//   //   })),
//   // ]);

//   const [activeSearchResults, setActiveSearchResults] = useState<
//     OrganicResultWithDiffbot[] | undefined
//   >(undefined); //TODO make global state

//   const {
//     organicResultsWithDiffbot,
//     setOrganicResultsWithDiffbot,
//     queries,
//     setQueries,
//     setActiveMessageId,
//     activeQuery,
//   } = useSearchResultsStore();

//   // useEffect(() => {
//   //   setQueries([
//   //     {
//   //       messageId: messageId,
//   //       q: query,
//   //     },
//   //   ]);
//   // }, []);

//   const [loading, setLoading] = useState(true); //inital loading state
//   const [currentMessageId, setCurrentMessageId] = useState(messageId);

//   useEffect(() => {
//     setCurrentMessageId(uuidv4());
//   }, [organicResultsWithDiffbot]);

//   useEffect(() => {
//     const newOrganicResults = organicResults.map((result, index) => ({
//       ...result,
//       messageId: currentMessageId,
//       // id: index,
//     }));

//     setOrganicResultsWithDiffbot(newOrganicResults);
//     setActiveMessageId(messageId);
//     setActiveSearchResults(newOrganicResults);
//     setLoading(false);
//   }, [
//     organicResults,
//     // messageId,
//     // setOrganicResultsWithDiffbot,
//     // setActiveMessageId,
//   ]);

//   const { messages, append, reload, stop, isLoading, input, setInput } =
//     useChat({
//       api: "/api/chat",
//       onResponse(response) {
//         // TODO do I even have a toaster?
//         if (response.status === 401) {
//           console.log("401 error in chat");
//           toast.error(response.statusText);
//         }
//       },
//     });

//   const generateSummary = async (q: string, stringOrganicResults: string) => {
//     const date = new Date();

//     const prompt = getPrompt(q, stringOrganicResults);

//     const message: Message = {
//       role: "user",
//       content: prompt,
//       id: currentMessageId,
//       createdAt: new Date(),
//     };

//     // Note, queries must bes set before active message id

//     setQueries([
//       {
//         messageId: currentMessageId,
//         q: q,
//       },
//     ]);

//     setActiveMessageId(currentMessageId);
//     console.log("activeMessageId", currentMessageId);

//     append({
//       ...message,
//     });
//   };

//   useEffect(() => {
//     if (organicResultsWithDiffbot && organicResultsWithDiffbot.length > 0) {
//       const q = activeQuery?.q;

//       if (!q) {
//         return;
//       }

//       // const firstResult = organicResultsWithDiffbot[0];

//       // get first 6 results
//       const organicResultsShort: OrganicResultWithDiffbot[] =
//         organicResultsWithDiffbot?.slice(0, 20) || [];

//       console.log(organicResultsShort, "organicResultsShort");

//       //TODO fix this code so diffbot works

//       // dummy value for scrapePromises
//       const scrapePromises = [new Promise((resolve, reject) => resolve({}))];

//       let idCounter = 0;

//       function getNextId(sourceNumber: number) {
//         const letters = "abcdefghijklmnopqrstuvwxyz";
//         let id = "";
//         let number = idCounter;

//         do {
//           id = letters[number % letters.length] + id;
//           number = Math.floor(number / letters.length);
//         } while (number > 0);

//         idCounter++;

//         return `${sourceNumber}.${id}`;
//       }

//       type Snippet = {
//         id: string;
//         text: string;
//       };

//       type ResultObj = {
//         title: string;
//         // description: string;
//         extraSnippets?: Snippet[];
//       };

//       let sourceNumber = 1;
//       const resultsString = organicResultsShort.map((result) => {
//         let resultObj: ResultObj = {
//           // position: result.position,
//           title: result.title,
//         };

//         idCounter = 0; // Reset counter for each new source

//         let extraSnippets = [];
//         if (result.snippet.text) {
//           // add the description as an extra snippet
//           extraSnippets.push({
//             id: `[${result.snippet.snippetAlphaID}]`,
//             text: result.snippet.text,
//           });
//         }

//         if (result.extraSnippets) {
//           result.extraSnippets.forEach((snippet) => {
//             extraSnippets.push({
//               id: `[${snippet.snippetAlphaID}]`,
//               text: snippet.text,
//             });
//           });
//         }

//         resultObj.extraSnippets = extraSnippets; //assign extra snippets array to result object

//         sourceNumber++; // Increase source number for each new source
//         return resultObj;
//       });

//       const resultYamlString = YAML.stringify(resultsString);

//       // JSON.stringify(result)).join("\n");
//       // TODO this is much too long. Needs to be shortened or embedded to only get the relevant results. Reranking?
//       console.log(resultsString);

//       const generatedSummary = generateSummary(q, resultYamlString);

//       const generatedSummaryPromise = new Promise((resolve, reject) => {
//         generatedSummary.then((data) => {
//           resolve(data);
//         });
//       });

//       Promise.all([generatedSummaryPromise, ...scrapePromises]).then(
//         (scrapedDataArray) => {
//           console.log(scrapedDataArray);
//           // handle all the scraped data as needed...
//         }
//       );
//     }
//   }, [organicResultsWithDiffbot]);

//   if (!organicResultsWithDiffbot || organicResultsWithDiffbot.length === 0 && !loading) {
//     return (
//       <div className="flex flex-col items-center justify-center pt-10">
//         <h1 className="mb-4 text-3xl">No results found</h1>
//         <div className="text-lg">
//           <p>Try searching for something else or go back to the homepage </p>
//           <div className="flex items-center justify-center">
//             <Link href="/" className="text-blue-500 hover:underline">
//               Home
//             </Link>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen pb-16">
//       <WebSearchResultsSerp
//         organicSearchResults={[organicResultsWithDiffbot] || []}
//         conversation={messages}
//         isLoading={isLoading}
//         activeSearchResults={activeSearchResults}
//         setActiveSearchResults={setActiveSearchResults}
//         queries={queries}
//         chatPanelComponent={
//           <ChatPanel
//             id="chat-panel"
//             isLoading={isLoading}
//             stop={stop}
//             append={append}
//             reload={reload}
//             input={input}
//             setInput={setInput}
//             messages={messages}
//           />
//         }
//       />
//     </div>
//   );

// };

// export default WebSearchPage;

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const searchParams: SearchParamsType = {
//     q: context.query.q as string,
//     messageId: uuidv4(),
//   };

//   const response = await fetch("http://localhost:3000/api/autopromptBrave", {
//     //TODO change this for prod, idk why /api isn't working
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(searchParams),
//   });

//   if (!response.ok) {
//     console.log(response);
//     // throw new Error("Something went wrong");
//   }

//   const results: ISerpApiResponse = await response.json();

//   return { props: { ...results, messageId: searchParams.messageId } }; //TODO remove id from ISerpApiResponse, will need some type finagling but right now the searchParams.messageId is being passed in as the id
// };

// const scrapePromises = organicResultsShort.map(async (result) => {
//   const response = await fetch(`/api/diffbot`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ url: result.link }), // send the URL to be scraped to your API
//   });
//   if (response.ok) {
//     return response.json().then((scrapedData) => {
//       // combine the original result with the scraped data
//       const updatedResult = {
//         ...result,
//         diffbotAPIResponse: scrapedData,
//       };
//       // update the specific result in the state
//       setResults((prevResults) => {
//         return prevResults?.map((item) =>
//           item.id === updatedResult.id ? updatedResult : item
//         );
//       });
//     });
//   } else {
//     // throw new Error(`Failed to scrape result: ${result.link}, status: ${response.status} ${response.statusText}`);
//     console.error(
//       `Failed to scrape result: ${result.link}, status: ${response.status} ${response.statusText}`
//     ); //TODO install sentry ig
//     // Sentry.captureException(new Error(`Failed to scrape result: ${result.link}, status: ${response.status} ${response.statusText}`));
//   }
// });
