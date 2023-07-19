import { useState, useEffect } from "react";
import { SearchParamsType, ISerpApiResponse } from "@/src/types";
import { useSearchResultsStore } from "@/src/store/searchResultsContext";
import { useChat } from "ai/react";
import { toast } from "react-hot-toast";

export const useAutopromptBrave = (searchParams: SearchParamsType | null) => {
  const [response, setResponse] = useState<ISerpApiResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  // const [braveLoading, setBraveLoading] =
  //   useState<boolean>(false);

  const { messages, append, reload, stop, isLoading, input, setInput } =
    useChat({
      api: "/api/chat",
      onResponse(response) {
        // TODO do I even have a toaster?
        if (response.status === 401) {
          console.log("401 error in chat");
          toast.error(response.statusText);
        }
      },
    });

  const [
    setOrganicResultsWithDiffbot,
    organicResultsWithDiffbot,
    addQuery,
    setBraveResultIsLoading,
    setNewMessageOrBraveIsLoading,
  ] = useSearchResultsStore((state) => [
    state.setOrganicResultsWithDiffbot,
    state.organicResultsWithDiffbot,
    state.addQuery,
    state.setBraveResultIsLoading,
    state.setNewMessageOrBraveIsLoading,
  ]);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchParams) {
        return;
      }

      if (searchParams.q === "" || searchParams.q === undefined) {
        return;
      }

      setBraveResultIsLoading(true);
      setNewMessageOrBraveIsLoading(true);
      // addQuery(searchParams);
      try {
        const res = await fetch("http://localhost:3000/api/autopromptBrave", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(searchParams),
        });

        if (!res.ok) {
          throw new Error(res.statusText);
        }

        const json: ISerpApiResponse = await res.json();
        setResponse(json);

        console.log("setting search params from useAutopromptBrave", searchParams);

        // Update Zustand store
        if (searchParams?.messageId) {
          const newOrganicResults = json.organicResults.map(
            (result, index) => ({
              ...result,
              messageId: searchParams.messageId,
            })
          );

          setOrganicResultsWithDiffbot(
            [...organicResultsWithDiffbot, ...newOrganicResults],
            searchParams.messageId,
            searchParams,
            false,
          );
        }
      } catch (error) {
        setBraveResultIsLoading(false);
        setError(error as Error);
      } finally {
        setBraveResultIsLoading(false);
      }
    };

    if (searchParams) {
      fetchData();
    }
  }, [searchParams]);

  return { response, error };
};
