const chains = [
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
  {
    id: "0x1",
    token: "ETH",
    label: "Ethereum Mainnet",
    rpcUrl: "https://eth.drpc.org",
  },
  {
    id: "0xaa36a7",
    token: "ETH",
    label: "Sepolia Testnet",
    rpcUrl: "https://sepolia.drpc.org",
  },
];

export default chains;
