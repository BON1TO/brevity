import {
  Box, Button, Container, Heading, Text, SimpleGrid, useColorModeValue, Icon, Flex
} from "@chakra-ui/react";
import { MotionBox, fadeUp, float } from "../components/motion";
import { Link as RouterLink } from "react-router-dom";
import { FiZap, FiStar, FiFeather } from "react-icons/fi";


const Feature = ({ icon, title, desc, delay = 0 }) => (
  <MotionBox
    variants={fadeUp}
    initial="initial"
    animate="animate"
    transition={{ delay }}
    p={5}
    rounded="xl"
    border="1px solid"
    borderColor={useColorModeValue("gray.200", "whiteAlpha.200")}
    bg={useColorModeValue("white", "gray.800")}
    whileHover={{ y: -6, boxShadow: "0 12px 30px rgba(0,0,0,0.15)" }}
  >
    <Flex align="center" gap={3} mb={2}>
      <Icon as={icon} boxSize={6} color="purple.400" />
      <Heading size="md">{title}</Heading>
    </Flex>
    <Text opacity={0.85}>{desc}</Text>
  </MotionBox>
);

const AnimatedBlobs = () => (
  <>
    <MotionBox
      pos="absolute" top="-80px" left="-80px" w="260px" h="260px" rounded="full"
      bgGradient="radial(purple.400, transparent 60%)" filter="blur(40px)" variants={float} animate="animate"
    />
    <MotionBox
      pos="absolute" bottom="-80px" right="-80px" w="260px" h="260px" rounded="full"
      bgGradient="radial(blue.400, transparent 60%)" filter="blur(40px)" variants={float} animate="animate" transition={{ duration: 4 }}
    />
  </>
);

const Home = () => {
  const heroText = useColorModeValue("gray.800", "whiteAlpha.900");
  const subText = useColorModeValue("gray.600", "whiteAlpha.800");
  const panelBg = useColorModeValue("whiteAlpha.800", "blackAlpha.500");
  const panelBorder = useColorModeValue("gray.200", "whiteAlpha.200");

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.900")} overflow="hidden">
      <Box pos="relative" py={20}>
        <AnimatedBlobs />

        <Container maxW="6xl" pos="relative">
          <MotionBox
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.7 } }}
            textAlign="center"
            bg={panelBg}
            border="1px solid"
            borderColor={panelBorder}
            rounded="2xl"
            px={{ base: 6, md: 12 }}
            py={{ base: 10, md: 14 }}
            backdropFilter="blur(6px)"
          >
            <Heading
              size="2xl"
              mb={4}
              bgGradient="linear(to-r, blue.400, purple.400)"
              bgClip="text"
            >
              Turn Papers into Clarity
            </Heading>
            <Text fontSize="lg" color={subText} maxW="3xl" mx="auto">
              Brevity chews through research papers, articles, even book chapters —
              then emerges with crisp summaries and a visual mental model.
            </Text>

            <Flex gap={3} justify="center" mt={8}>
              <Button as={RouterLink} to="/summarize" size="lg" colorScheme="purple">
                Start Summarizing
              </Button>
              <Button as={RouterLink} to="/summarize" size="lg" variant="outline" colorScheme="purple">
                Try a Sample PDF
              </Button>
            </Flex>
          </MotionBox>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mt={12}>
            <Feature
              icon={FiZap}
              title="Fast & Focused"
              desc="Chunking + AI yields concise results tuned to your word goal."
              delay={0.05}
            />
           <Feature
                icon={FiStar}
                title="Beautiful Output"
                desc="Readable typography and a distraction-free reading experience."
                delay={0.15}
            />

            <Feature
              icon={FiFeather}
              title="Your Style"
              desc="Pick your font & summary length — Brevity fits your flow."
              delay={0.25}
            />
          </SimpleGrid>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
