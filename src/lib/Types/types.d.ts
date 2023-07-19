// export interface Result {
//   title?: string;
//   url: string;
//   dateCreated?: string;
//   author?: string;
//   provider: string;
//   snippet?: string;
//   displayLink?: string;
//   position?: number;
//   favicon?: string;
// }

// export interface SidebarProps {
//   results: Result[];
// }

export interface Query {
  query: string;
  llmConfig?: Config;
}

export interface Config {
  type: string;
  apiKey?: string;
  instanceName?: string;
  deploymentName?: string;
  apiVersion?: string;
  model?: string;
}
