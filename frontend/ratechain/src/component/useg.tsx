import fetch from "cross-fetch";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { gql } from "@apollo/client";

const Client = () =>
  new ApolloClient({
    link: new HttpLink({
      uri: "https://api.studio.thegraph.com/query/50836/ratechain/version/latest",
      fetch,
    }),
    cache: new InMemoryCache(),
  });

type ContractsQueryResult = {
  scoreAvg: string;
  id: string;
};

export const useg = () => {
  const queryContracts = async (): Promise<ContractsQueryResult[]> => {
    const query = gql`
      {
        contracts(first: 5, orderBy: scoreAvg, orderDirection: asc) {
          scoreAvg
          id
        }
      }
    `;
    const response = (await Client().query({
      query,
    })) as any;

    return response.data.contracts;
  };

  return {
    queryContracts,
  };
};
