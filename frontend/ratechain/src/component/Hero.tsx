import { Container, Heading, Stack, Text, Button } from "@chakra-ui/react";

export default function Hero() {
  return (
    <Container maxW={"5xl"}>
      <Stack
        textAlign={"center"}
        align={"center"}
        spacing={{ base: 8, md: 10 }}
        pb={{ base: 1, md: 2 }}
        pt={{ base: 2, md: 40 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "3xl", sm: "4xl", md: "5xl" }}
          lineHeight={"110%"}
        >
           <Text as={"span"} color={"gray"}> Empowering Your Voice in the{" "}</Text>
     
          <Text as={"span"} color={"brown"}>
          Blockchain
          </Text>
          <Text as={"span"} color={"gray"}> 
          : Welcome to <Text as={"span"} color={"white"}>  RateChain </Text>, Where Contracts Earn Their Ratings!</Text>
        </Heading>
        
      </Stack>
    </Container>
  );
}
