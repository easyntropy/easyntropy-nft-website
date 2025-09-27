import { ethers } from "ethers";
import chains from "./chains";

const contractAddresses = {
  "0x7a69": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // dev chain
  "0xaa36a7": "0xdA1253E36cde9CCe502bB18E3F63C9435B305A5b", // sepolia testnet
  "0x1": "0x03628a9C9454878511F542F6F52e57fdE331265f", // mainnet
};

const contractABI = [
  "function mint() public",
  "function easyntropyFee() public view returns (uint256 fee)",
  "function tokenURI(uint256 tokenId) public view returns (string memory result)",
  "function ownedTokens(address tokensOwner) external view returns (uint256[] memory result)",
  "function seeds(uint256 tokenId) public view returns (uint256)",
  "function lastTokenId() public view returns (uint256)",
];

export async function getReadContract(wallet) {
  const chainId = wallet.chains[0].id;
  return getReadContractBasedOnChain(chainId);
}

export async function getReadContractBasedOnChain(chainId = "0x1") {
  const contractAddress = contractAddresses[chainId];
  const rpcUrl = chains.find((chain) => chain.id === chainId)?.rpcUrl;

  const provider = new ethers.JsonRpcProvider(rpcUrl);
  const contract = new ethers.Contract(contractAddress, contractABI, provider);
  return contract;
}

export async function getWriteContract(wallet) {
  const chainId = wallet.chains[0].id;
  const contractAddress = contractAddresses[chainId];

  const provider = new ethers.BrowserProvider(wallet.provider);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
}
