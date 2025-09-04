import { useState } from "react";
import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import TopBar from "../components/TopBar";
import UploadForm from "../components/UploadForm";
import SummaryDisplay from "../components/SummaryDisplay";

const Summarizer = () => {
  const [summary, setSummary] = useState("");
  const [font, setFont] = useState("Arial");
  const [wordCount, setWordCount] = useState(150);

  return (
    <Box bg={useColorModeValue("gray.100", "gray.800")} minH="100vh">
      <TopBar
        font={font}
        setFont={setFont}
        wordCount={wordCount}
        setWordCount={setWordCount}
        showControls
      />
      <Container maxW="container.md" py={8}>
        <UploadForm setSummary={setSummary} wordCount={wordCount} />
        <SummaryDisplay summary={summary} font={font} />
      </Container>
    </Box>
  );
};

export default Summarizer;
