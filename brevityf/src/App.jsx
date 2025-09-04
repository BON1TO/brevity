import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Summarizer from "./pages/Summarizer";
import TopBar from "./components/TopBar";
import { useState } from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

function App() {
  // navbar state for Home (controls hidden there)
  const [font, setFont] = useState("Arial");
  const [wordCount, setWordCount] = useState(150);

  return (
    <Box bg={useColorModeValue("gray.50", "gray.900")} minH="100vh">
      {/* Global navbar without controls on Home */}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <TopBar
                font={font}
                setFont={setFont}
                wordCount={wordCount}
                setWordCount={setWordCount}
                showControls={false}
              />
              <Home />
            </>
          }
        />
        <Route path="/summarize" element={<Summarizer />} />
      </Routes>
    </Box>
  );
}

export default App;
