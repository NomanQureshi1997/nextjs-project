import axios from 'axios';
import { DuckduckgoParameters, getJson } from 'serpapi';
import { NextApiRequest, NextApiResponse } from 'next';

interface FunctionParameterProperties {
  type: string;
  description: string;
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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const OPENAI_API_KEY = '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';
  const SERPAPI_API_KEY = 'b93d3b69f44cfb8330f2f64b25cbabea279f375b62d35f64751a47603149f23c';

  const query = req.body.query;
  const messages: Message[] = [{ role: "user", content: query }];

    
  const functions: FunctionDescription[] = [
    {
      name: "search",
      description: `You are tasked to turn searches into natural language queries, and the associated google query. Be as clever as possible to transform the search, and retrieve a list of relevant results. Current date is ${new Date().toISOString()}.`,
      parameters: {
        type: "object",
        properties: {
          natural_query: {
            type: "string",
            description: "The natural language string. For example, if a user searches: 'best socks'. The string would be: What are the best socks to buy?"
          },
          serp_query: {
            type: "string",
            description: `The google style query. Craft precise SERP queries using specificity, keywords, boolean operators, quotes for exact phrases, site specific search, and wildcards.`,
          },
        },
        required: ["natural_query", "serp_query"]
      },
    }
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

  await axios.post<OpenAIAPIResponse>(
    'https://api.openai.com/v1/chat/completions',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      }
    }
  )
  .then(async function (response) {
    let generation = response.data.choices[0]?.message
    if (generation == null) {
      throw new Error("No generation");
    }
    
    const functionCallArguments: FunctionCallArguments = JSON.parse(generation.function_call.arguments);
    
    const serpParams = {
      q: functionCallArguments.serp_query,
      kl: "us-en",
      api_key: SERPAPI_API_KEY,
    } satisfies DuckduckgoParameters;

    const serpResponse = await getJson("duckduckgo", serpParams);

    console.log("serpResponse", serpResponse)

    const organicResults = serpResponse.organic_results;

    console.log("organicResults", organicResults)

    const serpQuery = functionCallArguments.serp_query;
    const naturalQuery = functionCallArguments.natural_query;

    res.status(200).json({ organicResults, serpQuery, naturalQuery });
  })
  .catch(function (error: any) {
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  });
}


// {
// 	"generation": {
// 		"role": "assistant",
// 		"content": null,
// 		"function_call": {
// 			"name": "search",
// 			"arguments": "{\n  \"natural_query\": \"Show me funny memes\",\n  \"serp_query\": \"funny memes\"\n}"
// 		}
// 	},
// 	"organicResults": [