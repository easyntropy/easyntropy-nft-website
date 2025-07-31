import { init } from "@web3-onboard/vue";
import injectedModule from "@web3-onboard/injected-wallets";
import logo from "../assets/images/easyntropy.png";

init({
  wallets: [injectedModule()],
  chains: [
    ...(import.meta.env.DEV
      ? [
          {
            id: "0x7a69", // 31337,
            token: "ETH",
            label: "DEV Chain",
            rpcUrl: "http://localhost:8545",
          },
        ]
      : []),
    // {
    //   id: "0x1",
    //   token: "ETH",
    //   label: "Ethereum Mainnet",
    //   rpcUrl: "wss://eth.drpc.org",
    // },
    {
      id: "0xaa36a7",
      token: "ETH",
      label: "Sepolia Testnet",
      rpcUrl: "wss://sepolia.drpc.org",
    },
  ],
  appMetadata: {
    name: "Easyntrophy",
    icon: logo,
    logo,
    description: "NFT from guys from https://easyntropy.tech/",
    recommendedInjectedWallets: [{ name: "MetaMask", url: "https://metamask.io" }],
  },
  connect: {
    autoConnectLastWallet: true,
  },
});
