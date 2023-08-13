import { Box, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import { walletm } from "../hooks/walletm";
import { useListen } from "../hooks/useListen";
import Image from "next/image";

export default function Wallet() {
  const {
    dispatch,
    state: { status, wallet },
  } = walletm();

  const listen = useListen();
  const isConnected = status !== "pageNotLoaded" && typeof wallet === "string";

  const handleConnect = async () => {
    dispatch({ type: "loading" });
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];

    if (accounts.length > 0) {
      const balance = (await window.ethereum!.request({
        method: "eth_getBalance",
        params: [accounts[0], "latest"],
      })) as string;

      dispatch({ type: "connect", wallet: accounts[0], balance });
      listen();
    }
  };

  const handleDisconnect = () => {
    dispatch({ type: "disconnect" });
  };

  return (
    <Box
      p={2}
      bgGradient="linear(to-r, black, gray.800)"

      margin={"auto"}
      width={"fit-content"}
      cursor={"pointer"}
      onClick={isConnected ? handleDisconnect : handleConnect}
      rounded={"xl"}
    >
      <Flex>
        <Text
          width={isConnected ? 100 : "fit-content"}
          fontSize={16}
          isTruncated={true}
          fontWeight={"bold"}
          color={useColorModeValue("white", "white")}
        >
          {isConnected ? wallet : "Connect Wallet"}
        </Text>
      </Flex>
    </Box>
  );
}
