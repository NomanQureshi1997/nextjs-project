import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

// Create an OpenAI API client (that's edge friendly!)
const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
})
const openai = new OpenAIApi(config)
 
// IMPORTANT! Set the runtime to edge
export const runtime = 'edge'
 
export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()

  console.log("messages", messages)

  // make sure that we have messages and that the messages are not empty

  if (!messages || messages.length === 0) {
    return new Response("No messages in the request", { status: 400 })
  }


  
  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo-16k',
    stream: true,
    // messages: messages, TAKE LAST MESSAGE ONLY
    messages: messages.slice(-1),
    max_tokens: 1500,
    stop: ['Sources:', 'References:', '# References', '# Sources'], //TODO I should track when these are called out and make sure the output is ok
  })

  // console.log("data", data)
  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}


// import { OpenAIStream, StreamingTextResponse, type Message } from 'ai'
// import { Configuration, OpenAIApi, CreateChatCompletionResponse } from 'openai-edge'

// // interface RequestBody {
// //   messages: Message[]
// // }

// // Create an OpenAI API client (that's edge friendly!)
// const config = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
// })

// const openai = new OpenAIApi(config)

// // IMPORTANT! Set the runtime to edge
// export const runtime = 'edge'

// const MAX_RETRIES = 5;
// const INITIAL_BACKOFF_MS = 500;

// export async function POST(req: Request): Promise<Response> {
//   try {
//     // const requestBody: RequestBody = await req.json()

//     // if (!requestBody.messages || requestBody.messages.length === 0) {
//     //   throw new Error("No messages in the request")
//     // }

//     const { messages } = await req.json()

//     let backoffMs = INITIAL_BACKOFF_MS;
//     let retries = 0;
//     let response: any;

//     do {
//       try {
//         // Ask OpenAI for a streaming chat completion given the prompt
//         response = await openai.createChatCompletion({
//           model: 'gpt-3.5-turbo-16k',
//           stream: true,
//           messages: messages.slice(-1),
//           max_tokens: 1200,
//           stop: ['Sources:', 'References:', '# References', '# Sources'],
//         })

//         // If successful, break the retry loop
//         break;
//       } catch (err) {
//         // If reached the maximum number of retries, throw the error
//         if (retries >= MAX_RETRIES) {
//           throw err;
//         }

//         // Wait for the backoff time and then retry
//         await new Promise(resolve => setTimeout(resolve, backoffMs));
//         backoffMs *= 2;
//         retries++;
//       }
//     } while (retries < MAX_RETRIES)

//     // Convert the response into a friendly text-stream
//     const stream = OpenAIStream(response)

//     // Respond with the stream
//     return new StreamingTextResponse(stream)
//   } catch (unknownError) {
//     let error = unknownError as Error & { status?: number };
//     console.error(error)

//     const status = typeof error.status === 'number' ? error.status : 500;

//     return new Response(JSON.stringify({
//       error: error.message || 'Internal Server Error',
//     }), {
//       status,
//       headers: { 'Content-Type': 'application/json' },
//     })
//   }
// }