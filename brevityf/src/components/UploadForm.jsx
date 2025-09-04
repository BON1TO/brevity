import { useState } from "react";
import axios from "axios";
import {
  Box, Button, Input, Text, VStack, useToast, useColorModeValue,
} from "@chakra-ui/react";

const UploadForm = ({ setSummary, wordCount }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const cardText = useColorModeValue("gray.800", "whiteAlpha.900");

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file) {
      toast({ title: "Please upload a PDF first!", status: "warning" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("wordCount", wordCount);

    try {
      setLoading(true);
      setSummary("");

      // change this later to your backend url
      const response = await axios.post("http://127.0.0.1:8000/upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSummary(response.data.summary);
      toast({ title: "Summary generated!", status: "success" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error summarizing PDF!", status: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box p={6} mt={6} bg={cardBg} color={cardText} rounded="lg" shadow="md">
      <VStack spacing={4} align="stretch">
        <Text fontWeight="bold" fontSize="lg">
          Upload Your PDF
        </Text>
        <Input type="file" accept="application/pdf" onChange={handleFileChange} />
        <Button colorScheme="blue" onClick={handleUpload} isLoading={loading} loadingText="Summarizing...">
          Upload & Summarize
        </Button>
      </VStack>
    </Box>
  );
};

export default UploadForm;
