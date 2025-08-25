<template>
  <div class="host">
    <div class="header">
      <a href="/" class="logo">Easyntrophy NFT</a>
      <a href="https://easyntropy.tech/" class="poweredBy" target="_blank">
        <span> Powered by Easyntropy, <br />The Eth rng Oracle </span>
        <img src="../../assets/images/easyntropy.png" alt="Easyntropy Logo" />
      </a>
    </div>
    <div class="kv">
      <img src="../../assets/images/elements.png" class="elements" />
      <div class="taglineWrapper">
        <h1 class="tagline">
          Easyntrophy is a collection of unique,<br />randomly generated, stored purely onchain NFTs!<br /><br />
          <small>powered by the <i>Easyntropy</i> Eth rng Oracle.</small>
        </h1>
      </div>

      <div class="networkBanner" v-if="connectionStatus !== connectionStatuses.disconnected">
        <span v-if="connectedToSepolia">You are connected to the <i>Sepolia test network</i>.</span>
        <span v-else>You are connected to the <i>Ethereum Mainnet</i>.</span>
        <br /><br /><small>You can change the network using the widget in the corner.</small>
      </div>
    </div>

    <div class="listSection">
      <strong class="title">List of your NFTs:</strong>
      <small class="loading">
        &nbsp;
        <template v-if="fetchingStatus === fetchingStatuses.fetching">Loading...</template>
        <template v-if="fetchingStatus === fetchingStatuses.errored">Errored...</template>
        &nbsp;
      </small>

      <div class="nftListWrapper">
        <div v-if="ownedTokenIds.length === 0" class="example">
          <span>Example NFT:</span>
          <a href="../../assets/images/example-nft.svg" target="_blank">
            <img src="../../assets/images/example-nft.svg" alt="Example NFT" />
          </a>
        </div>

        <div class="nftList">
          <button v-if="connectionStatus === connectionStatuses.disconnected" class="item mint" @click="connect">
            <small>Click here to:</small><br /><br /><b>CONNECT your wallet!</b><br /><br />
            <small> MINT / see your NFTs</small>
          </button>
          <button v-if="connectionStatus === connectionStatuses.connecting" class="item connecting">
            Connecting...
          </button>
          <button v-if="connectionStatus === connectionStatuses.minting" class="item minting glowing">
            Minting...
          </button>
          <button v-if="connectionStatus === connectionStatuses.waitngForRng" class="item minting glowing">
            MINTED!<br /><br />now waiting<br />for RNG...
          </button>
          <button v-if="connectionStatus === connectionStatuses.connected" class="item mint" @click="mint">
            <small>click here to</small><br /><br /><b>MINT</b><br /> {{ displayPrice }}
          </button>
          <button
            v-if="connectionStatus === connectionStatuses.errored"
            class="item error"
            @click="connectionStatus = connectionStatuses.connected"
          >
            Error...<br /><br />
            click to restart
          </button>

          <button
            v-for="(tokenId) in [...ownedTokenIds].reverse()"
            :key="tokenId"
            class="item"
            :class="{ glowing: justMintedId === tokenId }"
            @click="tokenUrls[tokenId] && openNft(tokenUrls[tokenId])"
            :title="`#${tokenId}`"
          >
            <img v-if="!tokenUrls[tokenId] && justMintedId === tokenId" src="../../assets/images/crafting-nft.svg" />
            <img v-else-if="!tokenUrls[tokenId] && justMintedId !== tokenId" src="../../assets/images/loading-nft.svg" />
            <img v-else :src="tokenUrls[tokenId]" />
          </button>
        </div>
      </div>
    </div>
    <div class="footer">
      Made with love by <a href="https://easyntropy.tech/" target="_blank">easyntropy.tech</a> © 2024-present
    </div>
  </div>
</template>

<script setup>
import { useOnboard } from "@web3-onboard/vue";
import { ref, watch, onMounted, computed } from "vue";
import { getReadContract, getWriteContract } from "../../lib/contract";

const connectionStatuses = {
  disconnected: "disconnected",
  connecting: "connecting",
  connected: "connected",
  minting: "minting",
  waitngForRng: "waitngForRng",
  errored: "errored",
};

const fetchingStatuses = {
  idle: "idle",
  fetching: "fetching",
  errored: "errored",
};

const { connectWallet, connectedWallet } = useOnboard();
const connectionStatus = ref(connectionStatuses.disconnected);
const fetchingStatus = ref(fetchingStatuses.idle);
const ownedTokenIds = ref([]);
const tokenUrls = ref({});
const justMintedId = ref(0);
const price = ref(-1);

const connectedToSepolia = computed(() => {
  return connectedWallet.value?.chains?.[0]?.id === "0xaa36a7"; // Sepolia chain ID
});

const displayPrice = computed(() => {
  if (price.value <= 0) return "";
  const eth = Number(price.value) / 1e18;
  if (eth < 0.0001) {
    const gwei = Number(price.value) / 1e9;
    return `${gwei} Gwei`;
  }
  return `${eth} ETH`;
});

//
// --- wallet hooks
async function onConnect() {
  if (connectionStatus.value === connectionStatuses.connected) return;
  connectionStatus.value = connectionStatuses.connected;
  fetchList();
  fetchPrice();
}

async function onDisconnectConnect() {
  connectionStatus.value = connectionStatuses.disconnected;
  ownedTokenIds.value = [];
}

//
// --- wallet actions
async function connect() {
  try {
    await connectWallet();
  } catch (error) {
    connectionStatus.value = connectionStatuses.errored;
  }
}

//
// --- nft actions
function openNft(uri) {
  const byteString = atob(uri.split(',')[1]);
  const byteArray = new Uint8Array(byteString.length);
  for (let i = 0; i < byteString.length; i++) {
    byteArray[i] = byteString.charCodeAt(i);
  }
  const blob = new Blob([byteArray], { type: 'image/svg+xml' });
  const blobUrl = URL.createObjectURL(blob);
  window.open(blobUrl, '_blank');
}

async function fetchPrice() {
  if (!connectedWallet) await connect();
  const contract = await getReadContract(connectedWallet.value);
  price.value = await contract.easyntropyFee();
  return price.value;
}

async function fetchList() {
  if (!connectedWallet) await connect();

  const contract = await getReadContract(connectedWallet.value);
  try {
    fetchingStatus.value = fetchingStatuses.fetching;
    ownedTokenIds.value = await contract.ownedTokens(connectedWallet.value.accounts[0].address);
    fetchingStatus.value = fetchingStatuses.idle;
  } catch (error) {
    fetchingStatus.value = fetchingStatuses.errored;
    throw error;
  }

  const shuffledTokenIds = [...ownedTokenIds.value].sort(() => Math.random() - 0.5);
  for (const tokenId of shuffledTokenIds) {
    if (tokenUrls.value[tokenId]) continue;
    try {
      const encodedBased64TokenUri = await contract.tokenURI(tokenId);
      const tokenUri = atob(encodedBased64TokenUri.slice(29));
      const tokenData = JSON.parse(tokenUri);
      const uri = tokenData.image;
      tokenUrls.value[tokenId] = uri;
    } catch (error) {}
  }
}

async function mint() {
  if (!connectedWallet) await connect();

  try {
    connectionStatus.value = connectionStatuses.minting;
    const writeContract = await getWriteContract(connectedWallet.value);
    const readContract = await getReadContract(connectedWallet.value);
    const fee = await fetchPrice();
    const tx = await writeContract.mint({ value: fee });
    await tx.wait();

    connectionStatus.value = connectionStatuses.waitngForRng;

    const latestTokenIds = await writeContract.ownedTokens(connectedWallet.value.accounts[0].address);
    const latestMintedTokenIds = latestTokenIds[latestTokenIds.length - 1];
    justMintedId.value = latestMintedTokenIds;

    await fetchList();
    let seedObtained = false;
    while (!seedObtained) {
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // eslint-disable-next-line no-console
      console.log("Waiting for RNG...");
      seedObtained = (await readContract.seeds(latestMintedTokenIds)) !== 0n;
    }

    await fetchList();
    connectionStatus.value = connectionStatuses.connected;
  } catch (error) {
    connectionStatus.value = connectionStatuses.errored;
    throw error;
  }
}

// --- lifecycle
onMounted(() => {
  if (connectedWallet.value) {
    onConnect();
  } else {
    onDisconnectConnect();
  }
});

watch(
  connectedWallet,
  (newWallet, oldWallet) => {
    if (newWallet && !oldWallet) {
      onConnect();
    } else if (!newWallet && oldWallet) {
      onDisconnectConnect();
    }
  },
  { deep: true }
);

watch(
  connectedToSepolia,
  () => {
    if(!connectedWallet.value) return;
    fetchList();
    fetchPrice();
  },
);
</script>

<style lang="scss">
@import "./css/variables";
@import "./css/normalize";

@font-face {
  font-weight: normal;
  font-family: Minecraft-Regular;
  font-style: normal;
  src: url("@/frontend/assets/fonts/Minecraft-Regular.ttf.woff") format("woff"),
    url("@/frontend/assets/fonts/Minecraft-Regular.ttf.svg") format("svg"),
    url("@/frontend/assets/fonts/Minecraft-Regular.ttf.eot") format("embedded-opentype");
  font-display: swap;
}

html {
  font-size: 16px;
}

html,
body,
#app {
  height: 100%;
  color: $text;
  font-family: Minecraft-Regular, Tahoma, Geneva, sans-serif;
}

html,
body,
ul,
ol,
p,
h1,
h2,
h3,
h4,
h5 {
  margin: 0;
  padding: 0;
  font-weight: normal;
}

* {
  box-sizing: border-box;
  outline: none;
}

.sp {
  display: none;
  @media screen and (max-width: $md) {
    display: inherit;
  }
}

.pc {
  @media screen and (max-width: $md) {
    display: none;
  }
}

// -----

.host {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100%;
  background: #97450e;
}

.header {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  padding: 0 20px;
  background-color: #0000004b;

  .logo {
    color: $text;
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
    text-decoration: none;
  }

  .poweredBy {
    display: flex;
    gap: 10px;
    align-items: center;
    color: $text;
    color: #e5c9ff;
    font-weight: bold;
    font-size: 0.8rem;
    text-decoration: none;
    filter: drop-shadow(0 0 5px #a852fb);

    img {
      width: 45px;
      height: 45px;
    }
  }
}

.kv {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 40px;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: max(60vh, 400px);
  border-bottom: 1px solid #CB7A34;
  background: #93461a url("../../assets/images/kv.png") no-repeat 50% 100%;
  background-size: cover;

  .elements {
    width: 250px;
  }

  .taglineWrapper {
    padding: 2rem;
    border: 2px solid #d07927;
    text-align: center;
    background-color: #492915;
  }

  .tagline {
    font-weight: bold;
    font-size: 1.4rem;
    text-align: center;
    animation: color-cycle 8s infinite;
  }

  @keyframes color-cycle {
    0%,
    100% {
      color: #b99461;
      filter: drop-shadow(0 0 5px #b99461);
    }

    25% {
      color: #ffa806;
      filter: drop-shadow(0 0 5px #ffa806);
    }

    50% {
      color: #4bb6c1;
      filter: drop-shadow(0 0 5px #4bb6c1);
    }

    75% {
      color: #bcdcc7;
      filter: drop-shadow(0 0 5px #bcdcc7);
    }
  }

  .networkBanner {
    position: absolute;
    right: 0;
    bottom: -1px;
    padding: 10px;
    border: 1px solid #CB7A34;
    border-bottom: none;
    color: #CB7A34;
    font-weight: bold;
    background-color: #97450e;
  }
}

.listSection {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 20px;
  align-items: center;

  .title {
    margin: 1.5rem 0 0;
    color: #492915;
    font-weight: bold;
    font-size: 1.2rem;
    text-align: center;
  }

  .nftListWrapper {
    display: flex;
    gap: 40px;
    justify-content: space-between;
    width: 100%;
    max-width: 1200px;
    height: 100%;

    img {
      width: 200px;
      object-fit: cover;
    }

    .example {
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
    }

    .nftList {
      display: flex;
      flex-grow: 1;
      flex-wrap: wrap;
      gap: 20px;
      padding: 36px;
      border: 3px dashed #492915;

      .item {
        display: block;
        width: 200px;
        height: 200px;
        padding: 0;
        border: none;
        background: transparent;
        cursor: pointer;
      }

      .item.mint {
        border: 3px dashed #c559f3;
        color: #c559f3;
        font-size: 1.2rem;
        background: #c559f31a;

        &:hover {
          background: #c559f33d;
        }
      }

      .item.error {
        border: 3px dashed #f35959;
        color: #f33;
        font-size: 1.2rem;
        background: #ff00001a;

        &:hover {
          background: #ff00003d;
        }
      }

      .item.connecting,
      .item.minting {
        border: 3px dashed #c559f3;
        color: #c559f3;
        font-size: 1.2rem;
        background: #c559f31a;
        box-shadow: 0 0 10px #c559f3;
        cursor: wait;
      }

      .item.glowing {
        animation: glow 1.5s infinite alternate;
      }

      @keyframes glow {
        from {
          box-shadow: 0 0 5px #c559f3, 0 0 10px #c559f3;
        }

        to {
          box-shadow: 0 0 10px #c559f3, 0 0 20px #c559f3, 0 0 30px #c559f3;
        }
      }
    }
  }
}

.footer {
  padding: 1rem;
  color: #d07927;
  text-align: center;

  a {
    color: inherit;
    font-style: italic;
  }
}
</style>
