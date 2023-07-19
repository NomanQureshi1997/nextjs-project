import { NextApiRequest, NextApiResponse } from "next";
import {
  SnippetType,
  OrganicResultWithDiffbot,
  OrganicResultWithDiffbotSchema,
} from "~/types";
import { ChromaClient } from "chromadb";
import { v4 as uuidv4 } from "uuid";
import { OpenAIEmbeddingFunction } from "chromadb";
import { Chroma } from "langchain/vectorstores/chroma";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { title } from "process";
import { Document } from "langchain/document";
import winston from "winston";
import { z, ZodError } from "zod";
import fetchRetry from "fetch-retry";
import fetch from "isomorphic-fetch";
import { performance } from "perf_hooks";
import { HfInference } from "@huggingface/inference";
import nlp from "compromise";

const fetchWithRetry = fetchRetry(fetch, {
  retries: 5,
  retryDelay: function (attempt: number) {
    console.log(`Retry attempt: ${attempt}`); // Log the retry attempt
    return Math.pow(2, attempt) * 1000; // Exponential backoff
  },
  retryOn: async function (attempt, error, response) {
    const start = Date.now(); // Start time of the retry attempt
    // retry on network error or 429 status
    const shouldRetry = !!error || response?.status === 429;

    if (shouldRetry) {
      console.log(`Retry ${attempt} took ${Date.now() - start}ms`); // Log the time taken for the retry
    }

    return shouldRetry;
  },
});

// interface FunctionParameterProperties {
//   type: string;
//   description: string;
// }

// interface FunctionParameters {
//   type: string;
//   properties: {
//     [key: string]: FunctionParameterProperties;
//   };
//   required: string[];
// }

interface FunctionParameterProperties {
  type: string;
  description?: string;
  enum?: string[];
  items?: {
    type: string;
    enum?: string[];
  };
}

interface FunctionParameters {
  type: string;
  properties: {
    [key: string]: FunctionParameterProperties;
  };
  required: string[];
}

interface FunctionDescription {
  name: string;
  description: string;
  parameters: FunctionParameters;
}

interface Message {
  role: string;
  content: string;
}

interface FunctionCallArguments {
  natural_query: string;
  serp_query: string;
  freshness: string;
  safesearch: string;
  search_lang: string;
  sorted_sources_len_10: string[];
  // possible_answer_to_query: string;
}

interface FunctionCall {
  name: string;
  arguments: string; // JSON string of FunctionCallArguments
}

interface Generation {
  function_call: FunctionCall;
}

interface OpenAIAPIResponse {
  choices: {
    message: Generation;
  }[];
}

interface MetaUrl {
  scheme: string;
  netloc: string;
  hostname: string;
  favicon: string;
  path: string; // › schools  › california  › city  › san-francisco
}

interface SearchResult {
  title: string;
  url: string;
  is_source_local: boolean;
  is_source_both: boolean;
  description: string;
  language: string;
  family_friendly: boolean;
  type: string;
  subtype: string;
  meta_url: MetaUrl;
  age?: string;
  extra_snippets?: string[];
}

interface ResponseData {
  web: {
    results: SearchResult[];
  };
}

interface FilteredResponseData extends ResponseData {
  filter?: string;
}

function isError(error: any): error is Error {
  return error instanceof Error;
}

// [Skipping Interfaces for brevity...]

const logConfiguration = {
  transports: [new winston.transports.Console()],
};

const logger = winston.createLogger(logConfiguration);
let t0, t1;

const Hf = new HfInference(process.env.HUGGINGFACE_API_KEY!);

function similarity(s1: string, s2: string) {
  const words1 = new Set(s1.split(" "));
  const words2 = new Set(s2.split(" "));
  const intersection = new Set([...words1].filter((w) => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const OPENAI_API_KEY =
      "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";

    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not set");
    }
    const query: string = req.body.q;
    const messageId = req.body.messageId;

    if (!query) {
      console.log("body: ", req.body);
      throw new Error("No query");
    }

    if (!messageId) {
      throw new Error("No messageId");
    }

    const messages: Message[] = [{ role: "user", content: query }];

    const first60Chars = query.substring(0, 60);

    const functions: FunctionDescription[] = [
      {
        name: "search",
        description: `You are tasked to turn searches into natural language queries, and the associated google query. Be as clever as possible to transform the search, and retrieve a list of relevant results. Current date is ${new Date().toISOString()}. Your first task is to tranform this search query: \`\`\`${first60Chars}\`\`\``,
        parameters: {
          type: "object",
          properties: {
            // natural_query: {
            //   type: "string",
            //   description:
            //     `The natural language string. For example, if a user searches: 'best socks'. The string would be: The best socks to buy are... Always make it a statement, it does not have to be a complete sentence. This will be used for syntactic search. If the user
            //     `,
            // },
            serp_query: {
              type: "string",
              description: `The google style query. Craft precise SERP queries using specificity, keywords, boolean operators, quotes for exact phrases, site specific search, and wildcards. The query should be an improvement upon the following user query, while staying faithful to it. If the query is already optimized for google, just leave it be: \`\`\`${first60Chars}\`\`\.`,
            },
            // freshness: {
            //   type: "string",
            //   description: `Filters search results by when they were discovered.

            //     Defaults to None. The following time deltas are supported:

            //     None (default) (should be used for most queries)
            //     pw (should almost never be used, unless the user explicitly requests it)
            //     Discovered in last 7 Days.
            //     pm
            //     Discovered in last 31 Days.
            //     py
            //     Discovered in last 365 Days.
            //     YYYY-MM-DDtoYYYY-MM-DD
            //     A timeframe is also supported by specifying the date range in the format e.g. 2022-04-01to2022-07-30.
            //     `,
            // },
            // safesearch: {
            //   type: "string",
            //   description: `Filters search results for adult content.

            //   The default value is moderate. The following values are supported:

            //   off
            //   Adult content is included where relevant.
            //   moderate
            //   Adult text but no adult images or videos.
            //   strict
            //   No adult content with adult text, images, and videos.
            //   `,
            // },
            // search_lang: {
            //   type: "string",
            //   description: `The search language preference. The 2 or more character language code for which the search results are provided. Defaults to en.`
            // },
            // sorted_sources_len_10: {
            //   type: "string",
            //   description: "Content sources. Find the 10 most relevant sources to the query, sort them by relevance. Possible values include 'twitter', 'amazon', 'ai-image', 'stackoverflow', 'blog', 'news', 'podcast', 'book', 'journal', 'social-media', 'forum', 'website', 'tv', 'radio', 'newspaper', 'magazine', 'webinar', 'livestream', 'lecture', 'research-paper', 'white-paper', 'case-study', 'ebook', 'infographic', 'interview', 'web-series', 'film', 'documentary', 'conference', 'seminar', 'workshop', 'course', 'audiobook', 'webinar', 'online-course', 'mobile-app', 'physical-event', 'trade-show', 'press-release', 'product-review', 'customer-review', 'instagram', 'youtube'.",
            // },
            // items: {
            //     type: "string",
            //   enum: [
            //     "twitter",
            //     "amazon",
            //     "ai-image",
            //     "stackoverflow",
            //     "blog",
            //     "news",
            //     "podcast",
            //     "book",
            //     "journal",
            //     "social-media",
            //     "forum",
            //     "website",
            //     "tv",
            //     "radio",
            //     "newspaper",
            //     "magazine",
            //     "webinar",
            //     "livestream",
            //     "lecture",
            //     "research-paper",
            //     "white-paper",
            //     "case-study",
            //     "ebook",
            //     "infographic",
            //     "interview",
            //     "web-series",
            //     "film",
            //     "documentary",
            //     "conference",
            //     "seminar",
            //     "workshop",
            //     "course",
            //     "audiobook",
            //     "webinar",
            //     "online-course",
            //     "mobile-app",
            //     "physical-event",
            //     "trade-show",
            //     "press-release",
            //     "product-review",
            //     "customer-review",
            //     "instagram",
            //     "youtube",
            // ],
            //     }
            // }

            // possible_answer_to_query: {
            //   type: "string",
            //   description:
            //     "The possible answer to the query. For example if a user asks 'Who are the best US presidents?' The answer would be 'George Washington, Abraham Lincoln, and Franklin D. Roosevelt. Make it short and to the point.'",
            // },
          },
          required: ["serp_query"],
        },
      },
    ];

    const data = {
      messages: messages,
      functions: functions,
      function_call: {
        name: "search",
      },
      model: "gpt-3.5-turbo-0613",
      max_tokens: 400,
      temperature: 0.6,
    };

    type ClassificationResult = {
      label: string;
      score: number;
    };

    // t0 = performance.now();

    // const textClassificationResponse: ClassificationResult[] =
    //   await Hf.textClassification({
    //     model: "shahrukhx01/bert-mini-finetune-question-detection",
    //     inputs: query,
    //   });

    // t1 = performance.now();

    // logger.info(
    //   `Call to HuggingFace API for text classification took ${
    //     t1 - t0
    //   } milliseconds.`
    // );

    const textClassificationResponse = [
      {
        label: "LABEL_1",
        score: 0.9999998807907104,
      },
      {
        label: "LABEL_2",
        score: 1.1920928955078125e-7,
      },
    ];

    let predictedLabel: string | null = null; // Define predictedLabel at a higher scope so it's accessible later

    // Extract the label with the highest score
    if (textClassificationResponse && textClassificationResponse.length > 0) {
      const highestScoreLabel = textClassificationResponse.reduce(
        (prev: ClassificationResult, current: ClassificationResult) => {
          return prev.score > current.score ? prev : current;
        }
      );
      predictedLabel =
        highestScoreLabel.label === "LABEL_1" ? "question" : "statement"; // If the highest score label is LABEL_1, set predictedLabel to "question", otherwise set it to "statement
      console.log(predictedLabel);
    } else {
      console.log("The API response does not contain labels and scores");
    }

    console.log(predictedLabel, "predictedLabel");

    let response;
    let functionCallArguments: FunctionCallArguments;
    if (predictedLabel === "question" || query.length > 25) {
      try {
        t0 = performance.now();

        response = await fetchWithRetry(
          "https://api.openai.com/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: JSON.stringify(data),
          }
        );

        t1 = performance.now();
        logger.info(`Call to OpenAI API took ${t1 - t0} milliseconds.`);
      } catch (error) {
        throw new Error(`Failed to fetch from OpenAI API: ${error}`);
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      let responseData;
      try {
        responseData = (await response.json()) as OpenAIAPIResponse;
      } catch (error) {
        throw new Error(`Failed to parse response data: ${error}`);
      }

      let generation = responseData.choices[0]?.message;

      if (!generation) {
        throw new Error("No generation");
      }

      functionCallArguments = JSON.parse(generation.function_call.arguments);

      logger.info("functionCallArguments: ", functionCallArguments);
      logger.info("Sources ", functionCallArguments.sorted_sources_len_10);
    }

    const sites = [""];

    const headers = {
      Accept: "application/json",
      "Accept-Encoding": "gzip",
      "X-Subscription-Token": "BSAwZX_8UIF8rc5Z-vD8IC2e5NJ-3lS",
    };

    let promises = sites.map(async (site) => {
      // const query = site
      //   ? `${functionCallArguments.serp_query} site:${site}`
      //   : functionCallArguments.serp_query;

      const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
        functionCallArguments?.serp_query ?? query
      )}&extra_snippets=true&count=20

      `;
      // &safesearch=${functionCallArguments.safesearch}&search_lang=${functionCallArguments.search_lang}
      // &freshness=${functionCallArguments.freshness}

      logger.info(`Fetching ${url}`);

      let braveSearchResults;
      try {
        t0 = performance.now();
        braveSearchResults = await fetchWithRetry(url, { headers: headers });
        t1 = performance.now();
        logger.info(`Call to Brave Search API took ${t1 - t0} milliseconds.`);
        if (!braveSearchResults.ok) {
          throw new Error(
            `HTTP error! status: ${braveSearchResults.status} for ${site}`
          );
        }

        if (braveSearchResults.status === 204) {
          throw new Error(`No results for ${site}`);
        }
      } catch (error) {
        throw new Error(`Failed to fetch from Brave Search API: ${error}`);
      }

      let braveData: ResponseData;
      try {
        braveData = await braveSearchResults.json();
      } catch (error) {
        throw new Error(`Failed to parse Brave Search results: ${error}`);
      }

      logger.info(
        `Fetched ${braveData.web?.results?.length} braveSearchResults for ${site}`
      );

      // logger.info("braveData: ", braveData);

      return [braveData, site] as [ResponseData, string];
    });

    let braveDataMerged: FilteredResponseData = { web: { results: [] } };

    try {
      let braveDataArray: [ResponseData, string][] = await Promise.all(
        promises
      ); // Resolve all promises

      // Merge all the results into braveDataMerged

      braveDataArray.forEach(([braveData, site]) => {
        if (braveData && braveData.web && braveData.web.results) {
          braveDataMerged.web.results?.push(...braveData.web.results);
          braveDataMerged.filter = site;

          // if there are no results, throw an error
          if (braveData.web.results.length === 0) {
            throw new Error(`No results for ${site}`);
          }
          // If there are more fields to be merged, handle them here
        } else {
          logger.error(
            `No 'web' or 'results' in the response data for ${site}`
          );

          // throw new Error(`Missing results for ${site}`);
        }
      });

      logger.info(
        `Fetched ${braveDataMerged.web.results?.length} braveSearchResults`
      );
    } catch (error) {
      throw new Error(`An error occurred while fetching data: ${error}`);
    }

    const organicResults = braveDataMerged.web.results?.map(
      (result: SearchResult, index: number) => {
        const mainSnippet = result.description;

        let extraSnippets;
        if (result.extra_snippets) {
          extraSnippets = result.extra_snippets
            .filter(
              (extraSnippet) => similarity(mainSnippet, extraSnippet) < 0.5
            ) // Adjust the threshold as needed
            .map((extraSnippet) => ({
              text: extraSnippet,
              extraSnippet: true,
            }));
        }

        const organicResult: OrganicResultWithDiffbot = {
          position: index + 1,
          title: result.title,
          link: result.url,
          snippet: {
            text: mainSnippet,
            extraSnippet: false,
          },
          displayLink: result.meta_url.hostname,
          favicon: result.meta_url.favicon,
          messageId: messageId,
          extraSnippets: extraSnippets,
        };

        return organicResult;
      }
    );

    // const serpQuery = functionCallArguments.serp_query
    // const naturalQuery = functionCallArguments.natural_query;

    interface IdObject {
      id: number;
    }

    interface Document {
      pageContent: string;
      metadata: { id: number; title: string; isDefault: boolean };
    }

    // const OrganicResultSchema = z.object({
    //   position: z.number(),
    //   title: z.string(),
    //   link: z.string(),
    //   snippet: z.object({
    //     text: z.string(),
    //     extra_snippet: z.boolean().optional(),
    //     score: z.number().optional(),
    //   }),
    //   display_link: z.string(),
    //   favicon: z.string(),
    //   extra_snippets: z
    //     .array(
    //       z.object({
    //         text: z.string(),
    //         extra_snippet: z.boolean().optional(),
    //         score: z.number().optional(),
    //       })
    //     )
    //     .optional(),
    // });

    const DocumentSchema = z.object({
      text: z.string(),
      position: z.number(),
      id: z.number(),
      extra_snippet: z.boolean(),
    });

    const CohereRerankedResultSchema = z.object({
      document: DocumentSchema,
      relevance_score: z.number(),
    });

    const CohereAPIResponseSchema = z.array(CohereRerankedResultSchema);

    const cohereResults: z.infer<typeof DocumentSchema>[] = [];

    let id = 0;

    organicResults?.forEach(
      (result: OrganicResultWithDiffbot, index: number) => {
        result.extraSnippets?.forEach((snippet: SnippetType) => {
          id = id + 1;

          cohereResults.push({
            text: snippet.text,
            position: result.position,
            id: id,
            extra_snippet: true,
          });
        });

        if (result.snippet) {
          id = id + 1;

          cohereResults.push({
            text: result.snippet.text,
            position: result.position,
            id: id,
            extra_snippet: false,
          });
        }
      }
    );

    const fetchCohereData = async (): Promise<
      z.infer<typeof CohereAPIResponseSchema> | undefined
    > => {
      const options = {
        method: "POST",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          authorization: "Bearer Ml5NggcFkadDGzlkDAiWtBErPBCvNK2FoLfqROwL",
        },
        body: JSON.stringify({
          documents: cohereResults,
          return_documents: true,
          max_chunks_per_doc: 10,
          model: "rerank-english-v2.0",
          query: functionCallArguments?.serp_query ?? query,
        }),
      };

      try {
        t0 = performance.now();
        const response = await fetch(
          "https://api.cohere.ai/v1/rerank",
          options
        );
        t1 = performance.now();
        logger.info(`Call to Cohere API took ${t1 - t0} milliseconds.`);
        const data = await response.json();
        // logger.info("Cohere API response: ", data);
        const rData = CohereAPIResponseSchema.parse(data.results);
        return rData;
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error(
            "Validation error while parsing Cohere response initially:",
            error.errors
          );
        } else {
          console.error(error);
        }
      }
    };

    const handleRequest = async () => {
      logger.info("handleRequest - Start");

      let cohereAPIResponse:
        | z.infer<typeof CohereAPIResponseSchema>
        | undefined;

      try {
        cohereAPIResponse = await fetchCohereData();
        console.log("cohereAPIResponse: ", cohereAPIResponse);
      } catch (error) {
        logger.error(
          `Failed to fetch cohere data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
        throw new Error(
          `Failed to fetch cohere data: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }

      if (!cohereAPIResponse || !Object.keys(cohereAPIResponse).length) {
        const errorMsg = `No cohereRerankedResults ${cohereAPIResponse}`;
        logger.error(errorMsg);
        throw new Error(errorMsg);
      }

      logger.info(
        `Fetched ${Object.keys(cohereAPIResponse).length} cohereRerankedResults`
      );

      // logger.info("cohereRerankedResults: ", cohereAPIResponse);

      // merge cohereAPIResponse into a new OrganicResultType by using position as an id

      let organicResultsWithCohere: OrganicResultWithDiffbot[] = [
        ...(organicResults || []),
      ];

      Object.values(cohereAPIResponse).forEach(
        (result: z.infer<typeof CohereRerankedResultSchema>) => {
          const { document, relevance_score } = result;
          const position = document.position;
          let resultToUpdate = organicResultsWithCohere.find(
            (result) => result.position === position
          );

          // Update the score for the correct snippet
          if (resultToUpdate) {
            if (document.extra_snippet) {
              let snippetToUpdate = resultToUpdate.extraSnippets?.find(
                (snippet) => snippet.text === document.text
              );
              if (snippetToUpdate) {
                snippetToUpdate.score = relevance_score;
              }
            } else {
              if (resultToUpdate.snippet?.text === document.text) {
                resultToUpdate.snippet.score = relevance_score;
              }
            }
          }
        }
      );

      function getLetterByIndex(index: number) {
        return String.fromCharCode("a".charCodeAt(0) + index);
      }

      const filteredAndRankedResults = organicResultsWithCohere
        .map((result) => {
          // Filter out extra_snippets with score less than 0.7
          const extraSnippets =
            result.extraSnippets?.filter(
              (snippet) =>
                snippet.score !== undefined &&
                snippet.score >= 0.5 &&
                snippet.text.length < 1100 &&
                snippet.text.length > 38 //TODO this number is arbitrary
            ) || [];

          // Include the primary snippet in the scoring if it exists
          let allSnippets = extraSnippets;
          if (result.snippet) {
            allSnippets = [...extraSnippets, result.snippet];
          }

          // Calculate the average score
          const avgScore =
            allSnippets.reduce(
              (total, snippet) => total + (snippet.score || 0),
              0
            ) / (allSnippets.length || 1);

          // Return the updated result with average score and filtered snippets
          return {
            ...result,
            extraSnippets,
            avgScore,
          };
        })
        // Sort by average score in descending order, but prioritize results with at least one snippet
        .sort((a, b) => {
          // If a has snippets and b does not, a should come first
          if (a.extraSnippets.length > 0 && b.extraSnippets.length === 0) {
            return -1;
          }
          // If b has snippets and a does not, b should come first
          if (b.extraSnippets.length > 0 && a.extraSnippets.length === 0) {
            return 1;
          }
          // If both have snippets or both don't, sort by average score
          return b.avgScore - a.avgScore;
        })
        .map((result, resultIndex) => {
          const extraSnippets = result.extraSnippets.map(
            (snippet, snippetIndex) => ({
              ...snippet,
              snippetAlphaID: `${resultIndex + 1}.${getLetterByIndex(
                snippetIndex + 1
              )}`,
            })
          );

          const snippet = result.snippet
            ? {
                ...result.snippet,
                snippetAlphaID: `${resultIndex + 1}.a`,
              }
            : null;

          return {
            ...result,
            extraSnippets,
            snippet,
          };
        });

      // .map((result, resultIndex) => {
      //   const extraSnippets = result.extraSnippets.map(
      //     (snippet, snippetIndex) => {
      //       // Use compromise to segment the text into sentences
      //       const sentences = nlp(snippet.text).sentences().out('array');
      //       const updatedSentences = sentences.map((sentence: string) => {
      //         // Checks if sentence is similar to the query, and if so, wraps it in ** **.
      //         const similarity = nlp(sentence).
      //         return similarity > 0.5 // Set the threshold according to your requirement
      //           ? `**${sentence}**`
      //           : sentence;
      //       });
      //       return {
      //         ...snippet,
      //         text: updatedSentences.join('. '), // text is now a markdown string
      //         snippetAlphaID: `${resultIndex + 1}.${getLetterByIndex(
      //           snippetIndex + 1
      //         )}`,
      //       };
      //     }
      //   );
      //   return {
      //     ...result,
      //     extraSnippets,
      //   };
      // });

      const finalResults = filteredAndRankedResults.map((result, index) => {
        return {
          ...result,
          position: index + 1,
        };
      });

      //validate that the finalResults are valid
      try {
        finalResults.forEach((result, index) => {
          OrganicResultWithDiffbotSchema.parse(result);
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          error.errors.forEach((zodError) => {
            console.error(
              `Zod validation error on index ${zodError.path[0]}: ${zodError.message}`,
              `\nError details: ${JSON.stringify(zodError.code, null, 2)}`
            );
          });
          console.error(
            "Validation error while parsing finalResults:",
            error.errors
          );
        } else if (error instanceof SyntaxError) {
          console.error(
            "Syntax error while parsing finalResults:",
            error.message
          );
        } else {
          console.error(
            "Unknown error occurred while parsing finalResults:",
            error
          );
        }

        // Log data only when debugging to prevent sensitive data exposure or large data printouts
        if (process.env.NODE_ENV === "development") {
          console.log("Final results:", finalResults);
        }
      }

      res.status(200).json({
        organicResults: finalResults,
        naturalQuery: functionCallArguments?.natural_query ?? query,
        serpQuery: functionCallArguments?.serp_query ?? query,
        // organicResults,
        query,
        messageId,
        // cohereAPIResponse,
      });

      logger.info("handleRequest - End");
    };

    try {
      t0 = performance.now();
      handleRequest();
      t1 = performance.now();
      logger.info(
        `handleRequest (rerankig after cohere, should be only a few mili) took ${
          t1 - t0
        } milliseconds.`
      );
    } catch (error: any) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  } catch (error: any) {
    if (error instanceof ZodError) {
      console.error(
        "Validation error while parsing Cohere response initially:",
        error.errors
      );
    } else {
      console.error(error);
    }
  }
}

// console.log(texts);
// console.log(ids);
// console.log(texts.length);

// const fetchCohereData = async (): Promise<
//   ICohereAPIResponse | undefined
// > => {
//   const options = {
//     method: "POST",
//     headers: {
//       accept: "application/json",
//       "content-type": "application/json",
//       authorization: "Bearer Ml5NggcFkadDGzlkDAiWtBErPBCvNK2FoLfqROwL",
//     },
//     body: JSON.stringify({
//       documents: cohereResults,
//       return_documents: true,
//       max_chunks_per_doc: 10,
//       model: "rerank-english-v2.0",
//       query: naturalQuery,
//     }),
//   };

//   try {
//     const response = await fetch(
//       "https://api.cohere.ai/v1/rerank",
//       options
//     );
//     const data = await response.json();
//     // console.log(data);
//     const rData: ICohereAPIResponse = data.results;
//     return rData;
//   } catch (error) {
//     console.error(error);
//   }
// };

// const handleRequest = async () => {
//   logger.info("handleRequest - Start");

//   let cohereAPIResponse: ICohereAPIResponse | undefined;

//   try {
//     cohereAPIResponse = await fetchCohereData();
//   } catch (error) {
//     logger.error("Failed to fetch cohere data: ", error);
//     throw new Error("Failed to fetch cohere data");
//   }

//   if (!cohereAPIResponse) {
//     logger.error("No cohereRerankedResults");
//     throw new Error("No cohereRerankedResults");
//   }

//   logger.info(
//     `Fetched ${cohereAPIResponse.length} cohereRerankedResults`
//   );

//   logger.info("cohereRerankedResults: ", cohereAPIResponse);

//   // Filter out snippets with relevance_scores less than 0.7
//   const filteredResults = Object.values(cohereAPIResponse).filter(
//     (doc: ICohereRerankedResult) => doc.document.relevance_score > 0.7
//   );

//   logger.info(
//     `Filtered ${filteredResults.length} cohereRerankedResults with a relevance_score of over 0.7`
//   );

//   // Calculate average relevance_score for each organic result
//   const averageScores: { [key: string]: number } = {};
//   const count: { [key: string]: number } = {};

//   filteredResults?.forEach((doc: ICohereRerankedResult) => {
//     const organicResultId = doc.document.id;
//     if (!averageScores[organicResultId]) {
//       averageScores[organicResultId] = doc.document.relevance_score; // Initialize the score with the first score found
//       count[organicResultId] = 1;
//     } else {
//       averageScores[organicResultId] += doc.document.relevance_score;
//       count[organicResultId]++;
//     }
//   });

//   for (let id in averageScores) {
//     averageScores[id] /= count?.[id] ?? 1;
//   }

//   logger.info("Calculated average relevance_scores for each organic result");

//   // Rerank the organicResults based on average scores
//   const rerankedOrganicResults = organicResults
//     .slice()
//     .sort((a, b) => {
//       const scoreA = averageScores[a.position] || 0;
//       const scoreB = averageScores[b.position] || 0;

//       return scoreB - scoreA;
//     })
//     .map((organicResult) => {
//       // map to include the scores
//       return {
//         organicResult,
//         relevance_score: averageScores[organicResult.position] || 0,
//       };
//     });

//   logger.info("Reranked organic results based on average scores");

//   res.status(200).json({
//     naturalQuery,
//     serpQuery,
//     organicResults: rerankedOrganicResults,
//     query,
//     texts,
//   });

//   logger.info("handleRequest - End");
// };

// handleRequest();

// Use async function to handle the asynchronous fetchCohereData
// const handleRequest = async () => {
//   const cohereRerankedResults = await fetchCohereData();
//   res.status(200).json({cohereRerankedResults, naturalQuery, serpQuery, organicResults, query, texts});
// }

// handleRequest();

// res.status(200).json({ naturalQuery, serpQuery, organicResults, query, texts });

//     const handleRequest = async () => {
//       logger.info("handleRequest - Start");

//       let cohereAPIResponse: z.infer<typeof CohereAPIResponseSchema> | undefined;

//       try {
//         cohereAPIResponse = await fetchCohereData();
//       } catch (error) {
//         logger.error("Failed to fetch cohere data: ", error);
//         throw new Error("Failed to fetch cohere data");
//       }

//       if (!cohereAPIResponse) {
//         logger.error("No cohereRerankedResults");
//         throw new Error("No cohereRerankedResults");
//       }

//       logger.info(`Fetched ${Object.keys(cohereAPIResponse).length} cohereRerankedResults`);

//       logger.info("cohereRerankedResults: ", cohereAPIResponse);

//       // Filter out snippets with relevance_scores less than 0.7
//       const filteredResults = Object.values(cohereAPIResponse).filter(
//         (doc) => doc.relevance_score > 0.7
//       );

//       logger.info(
//         `Filtered ${filteredResults.length} cohereRerankedResults with a relevance_score of over 0.7`
//       );

//       // Calculate average relevance_score for each organic result
//       const averageScores: { [key: string]: number } = {};
//       const count: { [key: string]: number } = {};

//       filteredResults?.forEach((doc) => {
//         const organicResultId = doc.document.id.toString();
//         if (!averageScores[organicResultId]) {
//           averageScores[organicResultId] = doc.relevance_score;
//           count[organicResultId] = 1;
//         } else {
//           averageScores[organicResultId] += doc.relevance_score;
//           count[organicResultId]++;
//         }
//       });

//       for (let id in averageScores) {
//         averageScores[id] /= count?.[id] ?? 1;
//       }

//       logger.info("Calculated average relevance_scores for each organic result");

//       // Rerank the organicResults based on average scores
//       const rerankedOrganicResults = organicResults
//         .slice()
//         .sort((a, b) => {
//           const scoreA = averageScores[a.position.toString()] || 0;
//           const scoreB = averageScores[b.position.toString()] || 0;

//           return scoreB - scoreA;
//         })
//         .map((organicResult) => {
//           // map to include the scores
//           return {
//             organicResult,
//             relevance_score: averageScores[organicResult.position.toString()] || 0,
//           };
//         });

//       logger.info("Reranked organic results based on average scores");

//       res.status(200).json({
//         naturalQuery,
//         serpQuery,
//         organicResults: rerankedOrganicResults,
//         query,
//       });

//       logger.info("handleRequest - End");
//     };

//     handleRequest();
//   } catch (error: any) {
//     if (error.response) {
//       res.status(error.response.status).json(error.response.data);
//     } else {
//       res.status(500).json({ error: error.message });
//     }
//   }
// }

// const functionCallArguments: FunctionCallArguments = JSON.parse(
//   generation.function_call.arguments
// );
// const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
//   functionCallArguments.serp_query
// )}&extra_snippets=true&count=20`;
// const headers = {
//   Accept: "application/json",
//   "Accept-Encoding": "gzip",
//   "X-Subscription-Token": "BSAwZX_8UIF8rc5Z-vD8IC2e5NJ-3lS",
// };

// let braveSearchResults;
// try {
//   braveSearchResults = await fetch(url, { headers: headers });
// } catch (error) {
//   throw new Error(`Failed to fetch from Brave Search API: ${error}`);
// }

// let braveData: ResponseData;
// try {
//   braveData = await braveSearchResults.json();
// } catch (error) {
//   throw new Error(`Failed to parse Brave Search results: ${error}`);
// }

// const functionCallArguments: FunctionCallArguments = JSON.parse(
//   generation.function_call.arguments
// );

// const sites = ['reddit.com', 'stackoverflow.com', 'twitter.com', ''];

// const headers = {
//   Accept: "application/json",
//   "Accept-Encoding": "gzip",
//   "X-Subscription-Token": "BSAwZX_8UIF8rc5Z-vD8IC2e5NJ-3lS",
// };

// let promises = sites.map(async (site) => {
//   const query = site ? `${functionCallArguments.serp_query} site:${site}` : functionCallArguments.serp_query;
//   const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(
//     query
//   )}&extra_snippets=true&count=20`;

//   let braveSearchResults;
//   try {
//     braveSearchResults = await fetch(url, { headers: headers });
//   } catch (error) {
//     throw new Error(`Failed to fetch from Brave Search API: ${error}`);
//   }

//   let braveData: ResponseData;
//   try {
//     braveData = await braveSearchResults.json();
//   } catch (error) {
//     throw new Error(`Failed to parse Brave Search results: ${error}`);
//   }

//   return braveData;  // Each promise will resolve to its own braveData
// });

// try {
//   let braveDataArray: ResponseData[] = await Promise.all(promises);  // Resolve all promises
// } catch (error) {
//   throw new Error(`An error occurred while fetching data: ${error}`);
// }
