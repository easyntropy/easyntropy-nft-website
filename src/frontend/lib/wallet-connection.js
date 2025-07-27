import { init } from "@web3-onboard/vue";
import injectedModule from "@web3-onboard/injected-wallets";
import logo from "../assets/images/easyntropy.png";

const MAINNET_RPC_URL = "wss://eth.drpc.org";

init({
  wallets: [injectedModule()],
  chains: [
    {
      id: "0x1",
      token: "ETH",
      label: "Ethereum Mainnet",
      rpcUrl: MAINNET_RPC_URL,
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
