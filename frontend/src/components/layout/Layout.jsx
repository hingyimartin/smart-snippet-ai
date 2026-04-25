import { useEffect, useState } from "react";
import LeftSidebar from "./LeftSidebar";
import RightPanel from "./RightPanel";
import Footer from "./Footer";
import { SnippetProvider } from "../../context/SnippetContext";

export default function Layout({ children }) {
  const [rightOpen, setRightOpen] = useState(() => {
    const v = localStorage.getItem("rightPanelOpen");
    return v !== null ? v === "true" : true;
  });
  const [selectedSnippet, setSelectedSnippet] = useState(null);

  useEffect(() => {
    const panel = localStorage.getItem("rightPanelOpen");
    if (panel != null) setRightOpen(panel === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("rightPanelOpen", String(rightOpen));
  }, [rightOpen]);

  return (
    <SnippetProvider onAnalyze={() => setRightOpen(true)}>
      <div className="h-screen bg-(--app-bg) text-(--app-text)">
        <div className="flex h-full">
          <LeftSidebar />

          <div className="flex flex-1 min-w-0">
            <div className="flex-1 min-w-0 flex flex-col">
              <main className="flex-1 min-w-0 overflow-y-auto no-scrollbar px-4 md:px-6 py-6">
                <div className="mx-auto w-full">{children}</div>
              </main>
              <Footer />
            </div>

            <RightPanel
              open={rightOpen}
              setOpen={setRightOpen}
              selectedSnippet={selectedSnippet}
              setSelectedSnippet={setSelectedSnippet}
            />
          </div>
        </div>
      </div>
    </SnippetProvider>
  );
}
