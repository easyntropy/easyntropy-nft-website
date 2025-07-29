import { ethers } from "ethers";

export async function getContract(connectedWallet) {
  const contractAddress = import.meta.env.VITE_NFT_CONTRACT_ADDRESS;
  const contractABI = [
    "function mint() public",
    "function easyntropyFee() public view returns (uint256 fee)",
    "function tokenURI(uint256 tokenId) public view returns (string memory result)",
    "function ownedTokens(address tokensOwner) external view returns (uint256[] memory result)",
    "function seeds(uint256 tokenId) public view returns (uint256)",
  ];

  while (!connectedWallet.value) await new Promise((resolve) => setTimeout(resolve, 100));
  const provider = new ethers.BrowserProvider(connectedWallet.value.provider);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
}
