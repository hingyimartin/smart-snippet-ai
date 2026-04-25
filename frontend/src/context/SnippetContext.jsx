import { createContext, useContext, useState } from "react";

const SnippetContext = createContext(null);

export function SnippetProvider({ children, onAnalyze }) {
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  const analyzeSnippet = (snippet) => {
    setSelectedSnippet(snippet);
    if (onAnalyze) onAnalyze();
  };

  return (
    <SnippetContext.Provider
      value={{ selectedSnippet, setSelectedSnippet, analyzeSnippet }}
    >
      {children}
    </SnippetContext.Provider>
  );
}

export const useSnippet = () => useContext(SnippetContext);
