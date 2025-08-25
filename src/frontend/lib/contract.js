import { ethers } from "ethers";

export async function getContract(wallet) {
  let contractAddress;
  //
  // dev chain
  if (wallet.chains[0].id === "0x7a69") {
    contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    //
    // sepolia testnet
  } else if (wallet.chains[0].id === "0xaa36a7") {
    contractAddress = "0xA7ac0896Ebbe0E70Ad6Ce97f3AB083E76a960617";
    //
    // mainnet
  } else {
    contractAddress = "0xBc3489B963CC5E44f90E6f559144B0AAEe1B31C6";
  }

  const contractABI = [
    "function mint() public",
    "function easyntropyFee() public view returns (uint256 fee)",
    "function tokenURI(uint256 tokenId) public view returns (string memory result)",
    "function ownedTokens(address tokensOwner) external view returns (uint256[] memory result)",
    "function seeds(uint256 tokenId) public view returns (uint256)",
  ];

  const provider = new ethers.BrowserProvider(wallet.provider);
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);
  return contract;
}
