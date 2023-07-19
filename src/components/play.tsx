import React, { useState } from "react"

interface Query {
    query: string,
    llmConfig?: Config,
}
  
interface Config {
    type: string;
    apiKey?: string;
    instanceName?: string;
    deploymentName?: string;
    apiVersion?: string;
    model?: string;
}

const Play: React.FC = () => {
    const [inputText, setInputText] = useState<string>("")
    const [result, setResult] = useState<string>("")

    const fetchModelResults = async (inputText: string) => {
        // Create a Config object
      
        // Create a Query object
        const query: Query = {
          query: inputText,
        };
      
        console.log("query: ", query);
        
        // Make the API request
        const response = await fetch("/api/inference", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        });
      
        if (!response.ok) throw new Error(response.statusText);
        if (!response.body) throw new Error('Response body is missing');
      
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");
      
        while (true) {
          const { done, value } = await reader.read();
      
          if (done) {
            break;
          }
      
          const chunkValue = decoder.decode(value, {stream: !done});

          setResult(
            (prevResult: string) => {
                return prevResult + chunkValue;
            }
            )
        }
      };

      const handleRun = async () => {
        setResult("");
        await fetchModelResults(inputText);
        };
        

            


    return (
        <div className="simple-play">
            <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
            />
            <button onClick={handleRun}>Run</button>
            <div>{result}</div>
        </div>
    )
}

export default Play;    
