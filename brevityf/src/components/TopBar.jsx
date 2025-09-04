import {
  Box, Flex, Heading, Menu, MenuButton, MenuItem, MenuList, Button,
  IconButton, useColorMode, useColorModeValue
} from "@chakra-ui/react";
import { ChevronDownIcon, SunIcon, MoonIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useLocation } from "react-router-dom";

const TopBar = ({ font, setFont, wordCount, setWordCount, showControls = true }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const barBg = useColorModeValue("whiteAlpha.900", "gray.900");
  const borderCol = useColorModeValue("gray.200", "whiteAlpha.200");
  const menuBg = useColorModeValue("white", "gray.700");
  const itemColor = useColorModeValue("gray.800", "whiteAlpha.900");
  const loc = useLocation();

  const fonts = ["Arial", "Times New Roman", "Courier New", "Verdana", "Georgia"];
  const wordOptions = [50, 100, 150, 200, 250];

  return (
    <Box pos="sticky" top="0" zIndex="docked" bg={barBg} borderBottom="1px" borderColor={borderCol} px={6} py={3}>
      <Flex justify="space-between" align="center" maxW="6xl" mx="auto">
        <Heading size="md" bgGradient="linear(to-r, blue.400, purple.400)" bgClip="text">
          Brevity 📄✨
        </Heading>

        <Flex gap={3} align="center">
          <Button as={RouterLink} to="/" variant={loc.pathname === "/" ? "solid" : "ghost"} colorScheme="blue" size="sm">
            Home
          </Button>
          <Button as={RouterLink} to="/summarize" variant={loc.pathname === "/summarize" ? "solid" : "ghost"} colorScheme="purple" size="sm">
            Summarize
          </Button>

          {showControls && (
            <>
              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" size="sm">
                  Font: {font}
                </MenuButton>
                <MenuList bg={menuBg}>
                  {fonts.map((f) => (
                    <MenuItem key={f} onClick={() => setFont(f)} color={itemColor}>
                      {f}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>

              <Menu>
                <MenuButton as={Button} rightIcon={<ChevronDownIcon />} variant="outline" size="sm">
                  {wordCount} words
                </MenuButton>
                <MenuList bg={menuBg}>
                  {wordOptions.map((w) => (
                    <MenuItem key={w} onClick={() => setWordCount(w)} color={itemColor}>
                      {w} words
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            </>
          )}

          <IconButton
            aria-label="Toggle Dark Mode"
            icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            variant="ghost"
            size="sm"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default TopBar;
