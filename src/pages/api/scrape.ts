// import axios from "axios";
// import TurndownService from "turndown";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { url } = req.query;
//   if (!url) {
//     return res.status(400).send({ message: "Missing url query parameter" });
//   }

//   try {
//     const response = await axios.get(url as string);
//     const turndownService = new TurndownService();
//     const markdown = turndownService.turndown(response.data);
//     res.send({ markdown });
//   } catch (error) {
//     res.status(500).send({ message: error });
//   }
// }

// import axios from "axios";
// import readability from "node-readability";
// import { NextApiRequest, NextApiResponse } from "next";
// import TurndownService from "turndown";

// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { url } = req.query;
//   if (!url) {
//     return res.status(400).send({ message: "Missing url query parameter" });
//   }

//   readability(url as string, (error: Error, article: any) => {
//     if (error || !article) {
//       res.status(500).send({ message: error || "Unable to extract article" });
//       return;
//     }

//     const { title, content, textContent, length, excerpt, siteName, author } = article;

//     article.close(); // free resources

//     const turndownService = new TurndownService();

//     const markdown = turndownService.turndown(content);

//     res.send({ title, markdown });
//   });
// }

// import axios from "axios";
// import { JSDOM } from "jsdom";
// import { Readability } from "@mozilla/readability";
// import { NextApiRequest, NextApiResponse } from "next";
// import TurndownService from "turndown";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { url } = req.query;
//   if (!url) {
//     return res.status(400).send({ message: "Missing url query parameter" });
//   }

//   try {
//     const response = await axios.get(url as string);
//     const { document } = new JSDOM(response.data).window;
//     const article = new Readability(document).parse();

//     if (!article) {
//       res.status(500).send({ message: "Unable to extract article" });
//       return;
//     }

//     const { title, content } = article;
//     const turndownService = new TurndownService();
//     const markdown = turndownService.turndown(content);

//     console.log({ title, markdown });
//     res.send({ title, markdown });
//   } catch (error) {
//     res.status(500).send({ message: error });
//   }
// }

// import axios from 'axios';
// import cheerio from 'cheerio';
// import { Readability } from '@mozilla/readability';
// import { NextApiRequest, NextApiResponse } from 'next';
// import TurndownService from 'turndown';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { url } = req.query;
//   if (!url) {
//     return res.status(400).send({ message: 'Missing url query parameter' });
//   }

//   try {
//     const response = await axios.get(url as string);
//     const $ = cheerio.load(response.data);
//     const document = $.html();

//     const parsedDoc = new JSDOM(document);
//     const article = new Readability(parsedDoc.window.document).parse();

//     if (!article) {
//       res.status(500).send({ message: 'Unable to extract article' });
//       return;
//     }

//     const { title, content } = article;
//     const turndownService = new TurndownService();
//     const markdown = turndownService.turndown(content);
//     res.send({ title, markdown });
//   } catch (error) {
//     res.status(500).send({ message: error });
//   }
// }

// import axios from "axios";
// import { Readability } from "@mozilla/readability";
// import { NextApiRequest, NextApiResponse } from "next";
// import TurndownService from "turndown";
// import fetch from 'node-fetch';
// import { htmlToText } from 'html-to-text';

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { url } = req.query;
//   if (!url) {
//     return res.status(400).send({ message: "Missing url query parameter" });
//   }

//   try {
//     const response = await fetch(url as string);
//     const html = await response.text();
//     const textContent = htmlToText(html);

//     const article = new Readability(textContent).parse();

//     if (!article) {
//       res.status(500).send({ message: "Unable to extract article" });
//       return;
//     }

//     const { title, content } = article;
//     const turndownService = new TurndownService();
//     const markdown = turndownService.turndown(content);

//     console.log({ title, markdown });
//     res.send({ title, markdown });
//   } catch (error) {
//     res.status(500).send({ message: error });
//   }
// }

// https://content-parser.com/markdown?url=

//use the above url to get the markdown from a url

import axios from "axios";

import { NextApiRequest, NextApiResponse } from "next";

import TurndownService from "turndown";

// const _ = require('lodash');

function isApprovedTextHeader(segment: any) {
  const approvedHeaders = ["other", "normal_text_short", "normal_text"];
  return approvedHeaders.includes(segment["segmentType"]);
}

function isApprovedLength(segment: any, minChars = 150, maxChars = 600) {
  const text = segment["segmentText"].length;
  return text > minChars && text < maxChars;
}

function cleanText(text: any) {
  let cleanedText = text.replace("\n", "");
  cleanedText = cleanedText.replace("\xa0", "");
  return cleanedText;
}

function convertDataStructure(chunkedDocuments: any) {
  const ret = chunkedDocuments.map((document: any) => {
    const documentId = document["id"];
    const documentSegmentTexts = document["segments"].map(
      (segment: any) => segment["segmentText"]
    );
    return { id: documentId, snippets: documentSegmentTexts };
  });
  return ret;
}

function processDocuments(document: any) {
  let chunkedDocuments: any = [];
  let numSegmentsMissing = 0;

  if ("segments" in document) {
    const processed = document["segments"].filter(isApprovedTextHeader);
    document["segments"] = processed;
    chunkedDocuments.push(document);
  }

  chunkedDocuments.forEach((document: any, i: any) => {
    const processed = document["segments"].filter(isApprovedLength);
    document["segments"] = processed;
  });

  chunkedDocuments.forEach((document: any, i: any) => {
    document["segments"].forEach((segment: any, j: any) => {
      segment["segmentText"] = cleanText(segment["segmentText"]);
    });
  });

  return [chunkedDocuments];
}



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send({ message: "Missing url query parameter" });
  }

  try {
    const response = await axios.get(
      ("https://content-parser.com/markdown?url=" + url) as string
    );

    // const options = {
    //     method: 'POST',
    //     headers: {
    //       accept: 'application/json',
    //       'content-type': 'application/json',
    //       Authorization: 'Bearer NGajDNcjtHg0GXuj823e6NyJkAP8LSyA'
    //     },
    //     body: JSON.stringify({
    //       sourceType: 'URL',
    //       source: url,
    //     })
    //   };

    //   fetch('https://api.ai21.com/studio/v1/segmentation', options)
    //     .then(response => response.json())
    //     .then(response => console.log(response))
    //     .catch(err => console.error(err));

    // const ai21 = await fetch(
    //   "https://api.ai21.com/studio/v1/segmentation",
    //   options
    // );

    // const ai21json = await ai21.json();

    // const [processedDocuments] = processDocuments(ai21json);

    // console.log(ai21json, "ai21json");

    // console.log(processedDocuments, "pd");

    // const turndownService = new TurndownService();

    // const markdown = turndownService.turndown(response.data);

    res.send({ markdown: response.data });
  } catch (error) {
    res.status(500).send({ message: error });
  }
}
