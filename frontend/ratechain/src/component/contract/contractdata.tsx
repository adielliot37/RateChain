import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Heading,
  Stack,
  Flex,
  Icon,
  Text,
  useColorMode,
  useColorModeValue,
  Alert,
  AlertIcon,
  AlertTitle,
  Link,
  Image,
  Center,
} from "@chakra-ui/react";

import axios from "axios"; // Import axios for making HTTP requests
import { Select } from "@chakra-ui/react";

import { graph } from "../../hooks/graph";
import {
  CredentialType,
  IDKitWidget,
  ISuccessResult,
} from "@worldcoin/idkit";
import { generateAttestation, generateSignal } from "../../utils/helpers";
import { walletm } from "../../hooks/walletm";
import NumberAnimation from "../../animations/number";
import { SubmitReview } from "../SubmitReview";
import { useAsyncMemo } from "use-async-memo";


interface Props {
  contractAddress: string;
}

export default function ContractView(props: Props) {
  const { contractAddress } = props;
  const {
    state: { wallet },
  } = walletm();

  const { queryAttestation } = graph();
  const [isLoading, setIsLoading] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [reviewsCount, setReviewsCount] = useState<number | null>(null);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [activeStars, setActiveStars] = useState(0);
  const [contractBalance, setContractBalance] = useState<number | null>(null); // State for contract balance
  const [totalHolders, setTotalHolders] = useState(null);
  //const [totalTransactions, setTotalTransactions] = useState<number | null>(null);
  const [firstTransactionDate, setFirstTransactionDate] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState("eth-mainnet"); // Default network


  const signal = useMemo(() => {
    if (!wallet || !contractAddress || !selectedRating) return;
    return generateSignal(wallet, contractAddress, selectedRating);
  }, [wallet, contractAddress]);

  useAsyncMemo(async () => {
    if (!contractAddress) return;
    const res = await queryAttestation(contractAddress);
    if (res && res[0] && res[0].attestationsCount && res[0].scoreAvg) {
      setReviewsCount(res[0].attestationsCount);
      setRating(Number(res[0].scoreAvg));
    }
  }, [contractAddress]);

  useEffect(() => {
    // Set a timeout for each star to activate with a delay
    const timeout = setTimeout(() => {
      setActiveStars((prev) => prev + 1);
    }, 100);

    // Clear the timeout when the component unmounts
    return () => clearTimeout(timeout);
  }, [activeStars]);

  const fetchContractBalance = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.covalenthq.com/v1/${selectedNetwork}/address/${contractAddress}/balances_v2/?key=cqt_rQ8yWTR3tV39gQBqwBKm9txp3BFG`
      );
      const data = response.data;
      const contractBalance = data.data.items[0].balance; // Assuming the first item is the contract's balance
      const decimalFactor = 10 ** data.data.items[0].contract_decimals; // Get the decimal factor
      const formattedBalance = (Number(contractBalance) / decimalFactor).toFixed(2); // Divide the balance by the decimal factor and format with 2 decimal places
      const balanceAsNumber = Number(formattedBalance); // Convert the formatted balance to a number
      setContractBalance(balanceAsNumber);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching contract balance:", error);
      setIsLoading(false);
    }
  };
  const fetchTotalHolders = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `https://api.covalenthq.com/v1/${selectedNetwork}/tokens/${contractAddress}/token_holders_v2/?key=cqt_rQ8yWTR3tV39gQBqwBKm9txp3BFG`
      );
      const data = response.data;
      console.log("Covalent API Response:", data); // Log the API response for debugging
  
      if (data && data.data) {
        const totalHolders = data.data.pagination.total_count;
        setTotalHolders(totalHolders);
      } else {
        console.error("Invalid Covalent API response:", data);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching total holders:", error);
      setIsLoading(false);
    }
  };
  
const covalentApiKey = `cqt_rQ8yWTR3tV39gQBqwBKm9txp3BFG`;

  
const fetchFirstTransactionDate = async () => {
  try {
    const headers = new Headers();
    headers.set('Authorization', `Bearer ${covalentApiKey}`);

    const response = await fetch(
      `https://api.covalenthq.com/v1/${selectedNetwork}/address/${contractAddress}/transactions_v2/?key=cqt_rQ8yWTR3tV39gQBqwBKm9txp3BFG&format=csv`,
      { method: 'GET', headers: headers }
    );

    const csvData = await response.text();
    const lines = csvData.split('\n');
    if (lines.length > 1) {
      const firstTransaction = lines[1].split(',')[0]; // Assuming the first column is "block_signed_at"
      setFirstTransactionDate(firstTransaction);
    } else {
      setFirstTransactionDate('No transactions found');
    }
  } catch (error) {
    console.error('Error fetching first transaction date:', error);
    setFirstTransactionDate('Error fetching data');
  }
};

    
   
  
  



  useEffect(() => {
    // Fetch contract balance using Covalent API
    
    
  
  
    fetchContractBalance();
    fetchTotalHolders();
    fetchFirstTransactionDate();
  }, [contractAddress, selectedNetwork]);

 


  const { colorMode } = useColorMode();

  const message =
    rating === null ? (
      <Alert status="info" rounded="xl" bg="blue.600">
        <AlertIcon />
        <AlertTitle color="white">You are the first one to rate</AlertTitle>
      </Alert>
    ) : rating <= 5 ? (
      <Alert status="error" rounded="xl" bg="red.600">
        <AlertIcon />
        <AlertTitle color="white">May be a scam contract.</AlertTitle>
      </Alert>
    ) : (
      <Alert status="success" rounded="xl" bg="green.600">
        <AlertIcon />
        <AlertTitle color="white">High Rating</AlertTitle>
      </Alert>
    );

  return (
    <Flex alignItems="center" justifyContent="center" h="100vh" bg="gray.900">
      <Box
        w="1200px"
        mx="auto"
        borderRadius="xl"
        alignContent="center"
        bg={useColorModeValue("gray.800", "gray.700")}
        p={20}
        
      >
        
        <Text fontSize="lg" mb={2} textAlign="center"color="white">
            Network Select:
          </Text>
          <Select
          textAlign="center"
            value={selectedNetwork}
            onChange={(event) => setSelectedNetwork(event.target.value)}
            size="sm"
            width="180px" // Adjust the width as needed
            mb={4}
            mx="auto"
            color = "red"
          >
           
  <option value="eth-mainnet">Ethereum Mainnet</option>
  <option value="matic-mainnet">Polygon Mainnet</option>
  <option value="bsc-mainnet">Binance Smart Chain Mainnet</option>
  <option value="ftm-mainnet">Fantom Opera Mainnet</option>
  <option value="heco-mainnet">Huobi Eco Chain Mainnet</option>
  <option value="sol-mainnet">Solana Mainnet</option>
  <option value="avax-mainnet">Avalanche Mainnet</option>

  <option value="arbitrum-mainnet">Arbitrum Mainnet</option>
  <option value="optimism-goerli">optimism-goerli</option>
  <option value="matic-testnet">Polygon Testnet</option>
  <option value="rinkeby-testnet">Ethereum Rinkeby Testnet</option>
  <option value="ropsten-testnet">Ethereum Ropsten Testnet</option>
  <option value="kovan-testnet">Ethereum Kovan Testnet</option>
  <option value="goerli-testnet">Ethereum Goerli Testnet</option>
  <option value="binance-testnet">Binance Smart Chain Testnet</option>
  <option value="fantom-testnet">Fantom Opera Testnet</option>
 

</Select>

          
        <Heading
          fontSize="2xl"
          textAlign="center"
          pb={10}
          color={useColorModeValue("white", "gray.100")}
        >
          Contract Address:
          <Link
            href={`https://etherscan.io/address/${contractAddress}`}
            target="_blank"
            rel="noopener noreferrer"
            color={useColorModeValue("blue.500", "blue.300")}
            textUnderlineOffset={2}
          >
            {contractAddress}
          </Link>
        </Heading>

        <Flex justifyContent="center" alignItems="center">
          <Flex direction="column" alignItems="left" mt={8} gap={3}>
            <NumberAnimation
              Box={Box}
              targetValue={reviewsCount}
              animationDuration={20}
            />
           
            <Stack align="center">
              <Text color="white" fontSize="xl" fontWeight="semibold">
                {rating === null ? "No Rating" : `${rating.toFixed(1)}/10`}
              </Text>
            </Stack>
            {rating !== null && (
              <Box fontWeight="bold" fontSize="2xl">
                {message}
              </Box>
            )}

            {isLoading ? (
              <Text color="white">Loading contract balance...</Text>
            ) : (
              <Text color="white">
                Contract Balance: {contractBalance !== null ? contractBalance : "N/A"}
              </Text>
            )}
             {isLoading ? (
              <Text color="white">Loading contract balance...</Text>
            ) : (
              <Text color="white">
                Holders: {totalHolders !== null ? totalHolders : "N/A"}
              </Text>
            )}


{isLoading ? (
  <Text color="white">Loading ...</Text>
) : (
  <Text color="white">
       Recent Transaction Date: {firstTransactionDate || 'Loading...'}
  </Text>
)}



            <IDKitWidget
              app_id="app_9e9ab92aa9b87725e01986fd9c1c3ee4"
              action={"attest"}
              signal={signal}
              theme={colorMode}
              onSuccess={async (proof: ISuccessResult) => {
                await generateAttestation(
                  proof.merkle_root,
                  proof.proof,
                  proof.nullifier_hash,
                  selectedRating,
                  contractAddress
                );
                await new Promise((r) => setTimeout(r, 2000));
                setRating(
                  (reviewsCount * rating + selectedRating) /
                  (reviewsCount + 1)
                );
                setReviewsCount(reviewsCount + 1);
              }}
              credential_types={[CredentialType.Orb, CredentialType.Phone]}
              enableTelemetry
            >
              {({ open }) => (
                <SubmitReview
                  open={open}
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                />
              )}
            </IDKitWidget>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
}