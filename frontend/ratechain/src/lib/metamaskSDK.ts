import MetaMaskSDK from "@metamask/sdk";

export const instantiateSdk = () => {
  new MetaMaskSDK({
    dappMetadata: {
      name: "RateChain",
      url: "RateChain",
    },
  });
};
