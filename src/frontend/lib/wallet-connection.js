import { init } from "@web3-onboard/vue";
import injectedModule from "@web3-onboard/injected-wallets";
import logo from "../assets/images/easyntropy.png";
import chains from "./chains";

init({
  wallets: [injectedModule()],
  chains,
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
