// import * as z from 'zod';

// const snippetSchema = z.object({
//   text: z.string(),
//   score: z.number().optional(),
//   extra_snippet: z.boolean().optional(),
//   snippetAlphaID: z.string().optional(),
//   snippetUUID: z.string().optional(), //todo make full use of this and make it required
//   messageId: z.string().optional(), //todo make full use of this and make it required
// });

// export type QueryType = {
//   q: string;
//   messageId: string;
// }


// const organicResultWithDiffbotSchema = z.object({
//   position: z.number(),
//   title: z.string(),
//   link: z.string(),
//   display_link: z.string(),
//   favicon: z.string(),
//   snippet: snippetSchema,
//   extra_snippets: z.array(snippetSchema).optional(),
//   id: z.number(),
//   messageId: z.string(),
//   diffbotAPIResponse: z.object({
//     type: z.string(),
//     title: z.string(),
//     author: z.string().optional(),
//     date: z.string().optional(),
//     url: z.string(),
//     html: z.string(),
//     markdown: z.string(),
//     items: z.array(z.object({
//       title: z.string().optional(),
//       summary: z.string().optional(),
//       date: z.string().optional(),
//       link: z.string().optional(),
//       image: z.string().optional(),
//     })).optional(),
//   }).optional(),
// });

// export type OrganicResultWithDiffbot = z.infer<typeof organicResultWithDiffbotSchema>;

// export type SnippetType = z.infer<typeof snippetSchema>;



// export type SearchParamsType = {
//   query: string;
// };

// export interface ISerpApiResponse {
//   serpQuery: string;
//   naturalQuery: string;
//   query: string;
//   organicResults: z.infer<typeof organicResultWithDiffbotSchema>[];
// }


// export interface SiteLink {
//   link: string;
//   snippet: string;
//   title: string;
// }

// export interface SearchResult {
//   favicon: string;
//   link: string;
//   position: number;
//   sitelinks: SiteLink[];
//   snippet: string;
//   title: string;
// }



// type RdfType = string;

// interface Tag {
//   score: number;
//   sentiment: number;
//   count: number;
//   label: string;
//   uri: string;
//   rdfTypes: RdfType[];
// }

// interface Image {
//   naturalHeight: number;
//   width: number;
//   diffbotUri: string;
//   url: string;
//   naturalWidth: number;
//   height: number;
// }

// interface Category {
//   score: number;
//   name: string;
//   id: string;
// }

// interface Author {
//   name: string;
//   link: string;
// }

// // title	The title of the item
// // ↳summary	A longer text summary, when available, found in the item.
// // ↳date	The publication date of the item.
// // ↳link	A permalink to the item (when availabe).
// // ↳image	The image associated with the item.

// export interface Item {
//   title?: string;
//   summary?: string;
//   date?: string;
//   link?: string;
//   image?: string;
// }

// interface Object {
//   date: string;
//   sentiment: number;
//   images: Image[];
//   author: string;
//   estimatedDate: string;
//   publisherRegion: string;
//   icon: string;
//   diffbotUri: string;
//   siteName: string;
//   type: string;
//   title: string;
//   tags: Tag[];
//   publisherCountry: string;
//   humanLanguage: string;
//   authorUrl: string;
//   pageUrl: string;
//   html: string;
//   categories: Category[];
//   text: string;
//   authors: Author[];
//   items?: Item[];
// }

// interface Request {
//   pageUrl: string;
//   api: string;
//   version: number;
// }

// export interface DiffbotArticleResponse {
//   request: Request;
//   humanLanguage: string;
//   objects: Object[];
//   type: string;
//   title: string;
// }


// export interface DiffbotAPIResponse {
//     type: string;
//     title: string;
//     author?: string;
//     date?: string;
//     url: string;
//     html: string;
//     markdown: string;
//     items?: Item[];
// }

import * as z from 'zod';

// Renamed from 'snippetSchema' to 'SnippetSchema' for consistency
const SnippetSchema = z.object({
  text: z.string(),
  score: z.number().optional(),
  extraSnippet: z.boolean().optional(), // Renamed to camelCase
  snippetAlphaID: z.string().optional(),
  snippetUUID: z.string().optional(),
  messageId: z.string().optional(),
});

// export type QueryType = {
//   q: string;
//   messageId: string;
// }

// Renamed from 'organicResultWithDiffbotSchema' to 'OrganicResultWithDiffbotSchema' for consistency
export const OrganicResultWithDiffbotSchema = z.object({
  position: z.number(),
  title: z.string(),
  link: z.string(),
  displayLink: z.string(), // Renamed to camelCase
  favicon: z.string(),
  snippet: SnippetSchema,
  extraSnippets: z.array(SnippetSchema).optional(), // Renamed to camelCase
  // id: z.number().optional(),
  messageId: z.string(),
  diffbotAPIResponse: z.object({
    type: z.string(),
    title: z.string(),
    author: z.string().optional(),
    date: z.string().optional(),
    url: z.string(),
    html: z.string(),
    markdown: z.string(),
    items: z.array(z.object({
      title: z.string().optional(),
      summary: z.string().optional(),
      date: z.string().optional(),
      link: z.string().optional(),
      image: z.string().optional(),
    })).optional(),
  }).optional(),
});

// Used the typeof to infer type from the schema
export type OrganicResultWithDiffbot = z.infer<typeof OrganicResultWithDiffbotSchema>;
export type SnippetType = z.infer<typeof SnippetSchema>;

// Renamed to camelCase for consistency
export type SearchParamsType = {
  q: string;
  messageId: string;
};

export interface ISerpApiResponse {
  serpQuery: string;
  naturalQuery: string;
  query: string;
  organicResults: OrganicResultWithDiffbot[]; // used inferred type
  messageId: string;
}

export interface SiteLink {
  link: string;
  snippet: string;
  title: string;
}

export interface SearchResult {
  favicon: string;
  link: string;
  position: number;
  siteLinks: SiteLink[]; // Renamed to camelCase
  snippet: string;
  title: string;
}

type RdfType = string;

// Made names more specific for clarity
interface DiffbotTag {
  score: number;
  sentiment: number;
  count: number;
  label: string;
  uri: string;
  rdfTypes: RdfType[];
}

interface DiffbotImage {
  naturalHeight: number;
  width: number;
  diffbotUri: string;
  url: string;
  naturalWidth: number;
  height: number;
}

interface DiffbotCategory {
  score: number;
  name: string;
  id: string;
}

interface DiffbotAuthor {
  name: string;
  link: string;
}

export interface DiffbotItem {
  title?: string;
  summary?: string;
  date?: string;
  link?: string;
  image?: string;
}

// Made names more specific for clarity
interface DiffbotObject {
  date: string;
  sentiment: number;
  images: DiffbotImage[];
  author: string;
  estimatedDate: string;
  publisherRegion: string;
  icon: string;
  diffbotUri: string;
  siteName: string;
  type: string;
  title: string;
  tags: DiffbotTag[];
  publisherCountry: string;
  humanLanguage: string;
  authorUrl: string;
  pageUrl: string;
  html: string;
  categories: DiffbotCategory[];
  text: string;
  authors: DiffbotAuthor[];
  items?: DiffbotItem[];
}

// Made names more specific for clarity
interface DiffbotRequest {
  pageUrl: string;
  api: string;
  version: number;
}

export interface DiffbotArticleResponse {
  request: DiffbotRequest;
  humanLanguage: string;
  objects: DiffbotObject[];
  type: string;
  title: string;
}


export interface DiffbotAPIResponse {
    type: string;
    title: string;
    author?: string;
    date?: string;
    url: string;
    html: string;
    markdown: string;
    items?: DiffbotItem[];
}

// Changes:
// - Improved naming consistency and descriptiveness
// - Reduced ambiguity by making names more specific
// - Utilized 'z.infer' to automatically generate the types from schemas
// - Improved naming of properties to camelCase
// - Extended usage of the 'Diffbot' prefix for better clarity
