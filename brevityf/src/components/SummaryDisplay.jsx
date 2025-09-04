import { Box, Text, useColorModeValue } from "@chakra-ui/react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const SummaryDisplay = ({ summary, font }) => {
  if (!summary) return null;

  const cardBg = useColorModeValue("gray.50", "gray.900");
  const cardText = useColorModeValue("gray.800", "whiteAlpha.900");

  return (
    <MotionBox
      p={6}
      mt={6}
      bg={cardBg}
      color={cardText}
      rounded="lg"
      shadow="md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Text fontWeight="bold" fontSize="lg" mb={3}>
        Summary
      </Text>
      <Text style={{ fontFamily: font, lineHeight: "1.7", whiteSpace: "pre-wrap" }}>
        {summary}
      </Text>
    </MotionBox>
  );
};

export default SummaryDisplay;
