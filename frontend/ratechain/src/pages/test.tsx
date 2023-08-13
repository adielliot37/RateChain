import React, { useEffect, useState } from "react";
import { useg } from "../component/useg";
import { Box, Flex, Heading, VStack } from "@chakra-ui/react";

const TopContractsPage: React.FC = () => {
  const { queryContracts } = useg();
  const [topContracts, setTopContracts] = useState([]);

  useEffect(() => {
    const fetchTopContracts = async () => {
      try {
        const contractsData = await queryContracts();
        setTopContracts(contractsData);
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
    };

    fetchTopContracts();
  }, [queryContracts]);

  return (
    <Flex
      align="center"
      justify="center"
      minHeight="100vh"
      bg="gray.900"
      color="white"
    >
      <Box p={8} bg="gray.800" borderRadius="xl" boxShadow="xl">
        <Heading size="xl" mb={4} textAlign="center" color="blue.300">
          Least Rated Contracts
        </Heading>
        <VStack spacing={4} align="stretch">
          {topContracts.map((contract) => (
            <Box
              key={contract.id}
              p={4}
              bg="gray.700"
              borderRadius="md"
              boxShadow="md"
            >
              <Heading size="md" color="white">
                Contract ID: {contract.id}
              </Heading>
              <Heading size="sm" color="green.300">
                Rating: {contract.scoreAvg}
              </Heading>
            </Box>
          ))}
        </VStack>
      </Box>
    </Flex>
  );
};

export default TopContractsPage;
