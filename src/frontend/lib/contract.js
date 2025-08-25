import { ethers } from "ethers";
import chains from "./chains";

const contractAddresses = {
  "0x7a69": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // dev chain
  "0xaa36a7": "0xA7ac0896Ebbe0E70Ad6Ce97f3AB083E76a960617", // sepolia testnet
  "0x1": "0xBc3489B963CC5E44f90E6f559144B0AAEe1B31C6", // main net
};

const contractABI = [
  "function mint() public",
  "function easyntropyFee() public view returns (uint256 fee)",
  "function tokenURI(uint256 tokenId) public view returns (string memory result)",
  "function ownedTokens(address tokensOwner) external view returns (uint256[] memory result)",
  "function seeds(uint256 tokenId) public view returns (uint256)",
];

export async function getReadContract(wallet) {
  const chainId = wallet.chains[0].id;
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
