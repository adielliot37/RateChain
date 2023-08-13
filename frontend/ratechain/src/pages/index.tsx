import Homepage from "../component/Homepage";
import MainSection from "../component/MainSection";
import Hero from "../component/Hero";
import { Container } from "@chakra-ui/react";
import { useAsyncMemo } from "use-async-memo";

export default function Home() {
  return (
    <Container bgColor = "black"maxW={"10x1"}>
      <Homepage >
        <div>
          <Hero />
          <MainSection />
        </div>
      </Homepage>
    </Container>
  );
}
