import { OpenAIStream, StreamingTextResponse } from "ai";
import { Configuration, OpenAIApi } from "openai-edge";
import { v4 as uuidv4 } from "uuid";
import { z, ZodError } from "zod";
import fetchRetry from "fetch-retry";
import fetch from "isomorphic-fetch";

//TODO remove errors. maybe add sentry?

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

interface FunctionCallArguments {
    follow_up_queries: string[];
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

interface Message {
  role: string;
  content: string;
}

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(config);

// IMPORTANT! Set the runtime to edge
export const runtime = "edge";

const querySchema = z.object({
  query: z.string(),
  serpResults: z.string(),
  messageId: z.string(),
});

export async function POST(req: Request) {
  try {
    const reqBody = await req.json();
    console.log("Request body: ", reqBody);
    const parsedBody = querySchema.parse(reqBody);
    console.log("Parsed request body: ", parsedBody);

    const { query, serpResults, messageId } = parsedBody;

    if (!query || !serpResults) {
      throw new Error("Invalid request: missing 'query' or 'serpResults'");
    }

    const prompt = `Based on the following SERP results for the query "${query}":\n\n${serpResults}\n\nGive me three follow up search queries that you would use to continue your research on this topic.\n\n`;

    const messages: Message[] = [
      {
        content: prompt,
        role: "user" as const,
      },
    ];

    const firstFortyCharsOfQuery = query.slice(0, 40);
    const first400CharsOfSerpResults = serpResults.slice(0, 400);

    const functions: FunctionDescription[] = [
      {
        name: "search",
        description: `You are tasked with finding the best follow up search queries for the following SERP results: ${first400CharsOfSerpResults} and the query: ${firstFortyCharsOfQuery} that I can use to continue my research on this topic. Current date is ${new Date().toISOString()}.`,
        parameters: {
          type: "object",
          properties: {
            follow_up_queries: {
              type: "array",
              items: {
                type: "string",
              },
              description: "The follow up queries to the original query. They should be diverse enough to cover the topic, but not too diverse to be irrelevant. They should also be phrased naturally and not serp-like. ALWAYS start the query with a lowercase letter and do not add punctuation, that means no periods, commas, or question marks.",
            },
          },
          required: ["follow_up_queries"],
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

    let response;
    try {
      response = await fetchWithRetry(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify(data),
        }
      );
      console.log(`Call to OpenAI API was successful.`);
    } catch (error) {
      throw new Error(`Failed to fetch from OpenAI API: ${error}`);
    }

    if (!response.ok) {
      console.log(`Response from OpenAI API was not ok: ${response.statusText}`);
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

    let functionCallArguments = JSON.parse(generation.function_call.arguments);

    console.log("Function call arguments: ", functionCallArguments);
    console.log("Follow up queries: ", functionCallArguments.follow_up_queries);

    const followUpQueries = functionCallArguments.follow_up_queries;

    type FollowUpQueries = {
      messageId: string;
      followUpQuery: string;
      followUpQueryId: string;
    }[];

    const followUpQueriesWithIds: FollowUpQueries = followUpQueries.map(
      (followUpQuery: string) => {
        return {
          messageId: messageId,
          followUpQuery: followUpQuery,
          followUpQueryId: uuidv4(),
        };
      }
    );

    return new Response(JSON.stringify(followUpQueriesWithIds), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.log(err);
    return new Response(`Internal server error: ${err}`, {
      status: 500,
    });
  }
}