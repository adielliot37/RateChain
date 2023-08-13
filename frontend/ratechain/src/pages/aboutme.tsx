import React from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Stack,
  IconButton,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaTwitter,
  FaLinkedin,
  FaInstagram,
  FaGithub,
} from "react-icons/fa";

const socialLinks = [
  { icon: FaTwitter, link: "https://twitter.com/adimrelliot" },
  { icon: FaLinkedin, link: "https://www.linkedin.com/in/aditya-chaplot-3a5b6b239/" },
  { icon: FaInstagram, link: "https://instagram.com/adielliot37?utm_source=qr&igshid=NGExMmI2YTkyZg%3D%3D" },
  { icon: FaGithub, link: "https://github.com/adielliot37" },
];

const AboutMePage: React.FC = () => {
  return (
    <Flex align="center" justify="center" minHeight="100vh">
      <Box p={8} textAlign="center">
        <Flex direction="column" align="center">
          <Heading size="xl" mb={4}>
            Hello, I'm Aditya
          </Heading>
          <Text fontSize="lg">
            I'm a passionate Web3 developer and explorer of new technologies.
          </Text>
        </Flex>
        <Box mt={12}>
          <Heading size="md" mb={4}>
            Connect with Me
          </Heading>
          <Stack direction="row" spacing={4} align="center" justify="center">
            {socialLinks.map((link) => (
              <Link
                key={link.link}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                
                <IconButton
                  as={link.icon}
                  size="lg"
                  color={useColorModeValue("black", "white")}
                  bg={useColorModeValue("white", "black")}
                  boxShadow="md"
                  _hover={{ bg: useColorModeValue("gray.200", "gray.700") }}
                >
                </IconButton>
              </Link>
            ))}
          </Stack>
        </Box>
      </Box>
    </Flex>
  );
};

export default AboutMePage;
