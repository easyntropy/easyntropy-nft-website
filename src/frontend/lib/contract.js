import { ethers } from "ethers";

export async function getContract(connectedWallet) {
  const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
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
