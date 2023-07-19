import { devtools } from "zustand/middleware";
import { OrganicResultWithDiffbot, SearchParamsType } from "../types";
import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { useAutopromptBrave } from "@/src/lib/hooks/use-autoprompt-brave";
import { type Message } from "ai/react";

type State = {
  queries: SearchParamsType[];
  organicResultsWithDiffbot: OrganicResultWithDiffbot[];
  activeQuery: SearchParamsType | null;
  activeResults: OrganicResultWithDiffbot[];
  activeMessageId: string;
  isSidebarOpen: boolean;
  newMessageIsLoading: boolean;
  braveResultIsLoading: boolean;
  newMessageOrBraveIsLoading: boolean;
  language: string;
  selectedSearchResultIndex: number;
  selectedSearchResultAlphaId: string;
  searchParams: SearchParamsType | null;
  recommendations: {
    messageId: string;
    followUpQuery: string;
    followUpQueryId: string;
  }[]; //TODO import type

  setQueries: (searchParams: SearchParamsType[]) => void;
  setOrganicResultsWithDiffbot: (
    organicResultsWithDiffbot: OrganicResultWithDiffbot[],
    activeMessageId: string,
    activeQuery: SearchParamsType,
    initial: boolean
  ) => void;
  setActiveMessageId: (messageId: string) => void;
  addQuery: (searchParam: SearchParamsType) => void;
  setIsSidebarOpen: (isSidebarOpen: boolean) => void;
  setActiveQuery: (activeQuery: SearchParamsType) => void;
  setNewMessageIsLoading: (newMessageIsLoading: boolean) => void;
  setBraveResultIsLoading: (loading: boolean) => void;
  setLanguage: (language: string) => void;
  setSelectedSearchResultIndex: (
    index: number,
    messageId: string,
    alphaId: string
  ) => void;
  setSelectedSearchResultAlphaId: (alphaId: string) => void;
  setRecommendations: (
    recommendations: {
      messageId: string;
      followUpQuery: string;
      followUpQueryId: string;
    }[]
  ) => void;
  setNewMessageOrBraveIsLoading: (newMessageOrBraveIsLoading: boolean) => void;
  onSubmit: (value: string) => void;
  setSearchParams: (searchParams: SearchParamsType | null) => void;
  submitQuery: (value: string, messageId: string) => void;
};

export const useSearchResultsStore = create<State>((set, get) => ({
  queries: [],
  organicResultsWithDiffbot: [],
  activeQuery: null,
  activeResults: [],
  activeMessageId: "",
  isSidebarOpen: true,
  newMessageIsLoading: true,
  braveResultIsLoading: false,
  newMessageOrBraveIsLoading: false,
  language: "default",
  selectedSearchResultIndex: 0,
  selectedSearchResultAlphaId: "",
  recommendations: [],
  searchParams: {
    q: "",
    messageId: "",
  },

  setQueries: (searchParams) =>
    set((state) => ({
      ...state,
      queries: [...state.queries, ...searchParams],
    })),

  setNewMessageIsLoading: (newMessageIsLoading) =>
    set((state) => ({
      ...state,
      newMessageIsLoading,
    })),

  setOrganicResultsWithDiffbot: (
    organicResultsWithDiffbot: OrganicResultWithDiffbot[],
    activeMessageId: string,
    activeQuery: SearchParamsType,
    initial: boolean
  ) =>
    set((state) => {
      const previousResults = state.organicResultsWithDiffbot;
      if (organicResultsWithDiffbot.length !== previousResults.length) {
        const activeResults = organicResultsWithDiffbot
          .filter((result) => result.messageId === activeMessageId)
          .map((result, index) => ({
            ...result,
            messageId: activeMessageId,
            id: index,
          }));

        const alphaId = undefined;
        const selectedIndex = 1;
        const braveResultIsLoading = false;

        let newQueries = state.queries;

        if (initial) {
          newQueries = [activeQuery];
        }

        return {
          ...state,
          organicResultsWithDiffbot,
          activeResults,
          activeMessageId,
          activeQuery,
          selectedSearchResultAlphaId: alphaId,
          selectedSearchResultIndex: selectedIndex,
          braveResultIsLoading,
          queries: newQueries,
          //   queries: [...state.queries, activeQuery],
        };
      }
      return { ...state, organicResultsWithDiffbot };
    }),

  setActiveMessageId: (messageId) =>
    set((state) => {
      const activeQuery = state.queries.find(
        (query) => query.messageId === messageId
      );
      const activeResults = state.organicResultsWithDiffbot.filter(
        (result) => result.messageId === messageId
      );
      return {
        ...state,
        activeMessageId: messageId,
        activeQuery,
        activeResults,
      };
    }),

  addQuery: (searchParam) =>
    set((state) => ({
      ...state,
      queries: [...state.queries, searchParam],
    })),

  setIsSidebarOpen: (isSidebarOpen) =>
    set((state) => ({
      ...state,
      isSidebarOpen,
    })),

  setActiveQuery: (activeQuery) =>
    set((state) => ({
      ...state,
      activeQuery,
    })),

  setBraveResultIsLoading: (braveResultIsLoading) =>
    set((state) => ({
      ...state,
      braveResultIsLoading,
    })),

  setLanguage: (language) =>
    set((state) => ({
      ...state,
      language,
    })),

  // TODO fix this
  setSelectedSearchResultIndex: (index, messageId, alhpaId) =>
    set((state) => {
      const selectedResult = state.organicResultsWithDiffbot.find(
        (result) => result.messageId === messageId && result.position === index
      );

      const activeResults = state.organicResultsWithDiffbot.filter(
        (result) => result.messageId === messageId
      );

      return {
        ...state,
        selectedSearchResultIndex: index,
        activeResults,
        selectedSearchResultAlphaId: alhpaId,
      };
    }),

  setSelectedSearchResultAlphaId: (alphaId) =>
    set((state) => ({
      ...state,
      selectedSearchResultAlphaId: alphaId,
    })),

  setRecommendations: (recommendations) =>
    set((state) => ({
      ...state,
      recommendations,
    })),

  setNewMessageOrBraveIsLoading: (newMessageOrBraveIsLoading) =>
    set((state) => ({
      ...state,
      newMessageOrBraveIsLoading,
    })),

  setSearchParams: (searchParams) =>
    set((state) => ({
      ...state,
      searchParams,
    })),

  onSubmit: async (value) => {
    const messageId = uuidv4();

    // Call the function that updates all the state at once
    get().submitQuery(value, messageId);
  },

  submitQuery: (value, messageId) => {
    set(state => ({
      ...state,
      queries: [...state.queries, { messageId, q: value }], // Assuming 'queries' is an array of queries
      activeQuery: { messageId, q: value },
      activeMessageId: messageId,
      searchParams: { q: value, messageId }
    }));
  }
  
}));

// import { create } from 'zustand';
// import { OrganicResultWithDiffbot, SearchParamsType } from '../types';

// interface SearchResultState {
//     queries: SearchParamsType[];
//     organicResultsWithDiffbot: OrganicResultWithDiffbot[];
//     setOrganicResultsWithDiffbot: (organicResultsWithDiffbot: OrganicResultWithDiffbot[]) => void;
//     setQueries: (searchParams: SearchParamsType[]) => void; // updated type to be an array
//     activeMessageId: string;
//     setActiveMessageId: (messageId: string) => void;
//     isSidebarOpen: boolean;
//     setIsSidebarOpen: (isSidebarOpen: boolean) => void;
//     activeResults: OrganicResultWithDiffbot[];
//     activeQuery: SearchParamsType | null;
//     setActiveQuery: (activeQuery: SearchParamsType) => void;
// }

// export const useSearchResultsStore = create<SearchResultState>((set, get) => ({
//     queries: [],
//     organicResultsWithDiffbot: [],
//     activeQuery: null,
//     // setOrganicResultsWithDiffbot: (organicResultsWithDiffbot: OrganicResultWithDiffbot[]) => {
//     //     const previousResults = get().organicResultsWithDiffbot;

//     //     set({ organicResultsWithDiffbot });

//     //     // If the length of the new array is different from the old one
//     //     if (organicResultsWithDiffbot.length !== previousResults.length) {
//     //         const { activeMessageId } = get();
//     //         const activeResults = organicResultsWithDiffbot.map((result, index) => ({
//     //             ...result,
//     //             messageId: activeMessageId,
//     //             id: index,
//     //         }));
//     //         set({ activeResults });
//     //     }
//     // },
//     setOrganicResultsWithDiffbot: (organicResultsWithDiffbot: OrganicResultWithDiffbot[]) => {
//         const previousResults = get().organicResultsWithDiffbot;

//         set({ organicResultsWithDiffbot });

//         // If the length of the new array is different from the old one
//         if (organicResultsWithDiffbot.length !== previousResults.length) {
//             const { activeMessageId } = get();
//             const activeResults = organicResultsWithDiffbot
//                 .filter(result => result.messageId === activeMessageId)
//                 .map((result, index) => ({
//                     ...result,
//                     messageId: activeMessageId,
//                     id: index,
//                 }));
//             set({ activeResults });
//         }
//     },

//     activeResults: [],
//     activeMessageId: '',
//     setActiveMessageId: (messageId: string) => {
//         set({ activeMessageId: messageId });

//         const { organicResultsWithDiffbot, queries } = get();

//         const activeQuery = queries.find(query => query.messageId === messageId);
//         if (activeQuery) {
//             set({ activeQuery });
//         }

//         console.log('organicResultsWithDiffbot after update', organicResultsWithDiffbot);

//         const activeResults = organicResultsWithDiffbot.filter(result => result.messageId === messageId);
//         set({ activeResults });

//         console.log('activeResults', activeResults);
//         console.log('activeQuery', activeQuery);
//         console.log('queries', queries);
//         console.log('messageId', messageId);
//     },

//     setQueries: (searchParams: SearchParamsType[]) => set({ queries: [...get().queries, ...searchParams] }),
//     isSidebarOpen: true,
//     setIsSidebarOpen: (isSidebarOpen: boolean) => set({ isSidebarOpen }),
//     setActiveQuery: (activeQuery: SearchParamsType) => set({ activeQuery }),
// }));

// import { create } from 'zustand';
// import { OrganicResultWithDiffbot, SearchParamsType } from '../types';

// interface SearchResultState {
//     queries: SearchParamsType[];
//     organicResultsWithDiffbot: OrganicResultWithDiffbot[];
//     setOrganicResultsWithDiffbot: (organicResultsWithDiffbot: OrganicResultWithDiffbot[]) => void;
//     setQueries: (searchParams: SearchParamsType[]) => void; // updated type to be an array
//     activeMessageId: string;
//     setActiveMessageId: (messageId: string) => void;
//     isSidebarOpen: boolean;
//     setIsSidebarOpen: (isSidebarOpen: boolean) => void;
// }

// export const useSearchResultsStore = create<SearchResultState>((set, get) => ({
//     queries: [],
//     organicResultsWithDiffbot: [],
//     setOrganicResultsWithDiffbot: (organicResultsWithDiffbot: OrganicResultWithDiffbot[]) => set({ organicResultsWithDiffbot }),
//     setQueries: (searchParams: SearchParamsType[]) => set({ queries: [...get().queries, ...searchParams] }), // use spread operator on searchParams
//     activeMessageId: '',
//     setActiveMessageId: (messageId: string) => set({ activeMessageId: messageId }),
//     isSidebarOpen: true,
//     setIsSidebarOpen: (isSidebarOpen: boolean) => set({ isSidebarOpen }),
// }));

// const [activeTab, setActiveTab] = useState("key insights");
// const [snippets, setSnippets] = useState<string[]>([]);
// const [selectedResult, setSelectedResult] =
//   useState<OrganicResultWithDiffbot | null>(null);
// const [selectedIndex, setSelectedIndex] = useState(0);
// const isSidebarOpen = useSearchResultsStore((state) => state.isSidebarOpen);

// const [results, setResults] = useState<ResultsType>([
//     organicResults.map((result, index) => ({
//       ...result,
//       messageId: messageId,
//       id: index,
//     })),
//   ]);

// setOrganicResultsWithDiffbot: (organicResultsWithDiffbot) =>
//   set((state) => {
//     const previousResults = state.organicResultsWithDiffbot;
//     if (organicResultsWithDiffbot.length !== previousResults.length) {
//       const activeResults = organicResultsWithDiffbot
//         .filter(result => result.messageId === state.activeMessageId)
//         .map((result, index) => ({
//           ...result,
//           messageId: state.activeMessageId,
//           id: index,
//         }));
//       return { ...state, organicResultsWithDiffbot, activeResults };
//     }
//     return { ...state, organicResultsWithDiffbot };
//   }),
