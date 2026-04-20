import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import { SimpleEditor } from "./components/tiptap-templates/simple/simple-editor";
import { Titlebar } from "./components/Titlebar";
import { SidebarProvider } from "./components/ui/sidebar";
import { SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

import "./App.css";
import { ResizeHandles } from "./components/ResizeHandles";

function App() {
  const [selectedModel, setSelectedModel] = useState<string>("gemma3:270m");
  const [embmodel,setEmbmodel] = useState<string>("snowflake-arctic-embed:22m")
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);


  async function findModel() {
    try{
      const res = await invoke<boolean> ("is_model" , {model: selectedModel});
      setResponse(res);
    }
    catch (e){
    }
  }

return (
  <div className="app-container" style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
    <ResizeHandles/>
    <Titlebar title="Untitled Note" />
    <SidebarProvider style={{ flex: 1, overflow: "hidden",minHeight: "0" }}>
      <AppSidebar />
      <main className="overflow-y-hidden">
        <SidebarTrigger />
        <SimpleEditor />
      </main>
    </SidebarProvider>

  </div>
);

}

export default App;
