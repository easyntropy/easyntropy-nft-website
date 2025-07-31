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
    </div>

    <div class="listSection">
      <strong class="title">List of your NFTs:</strong>

      <div class="nftListWrapper">
        <div v-if="nfts.length === 0" class="example">
          <span>Example NFT:</span>
          <a href="../../assets/images/example-nft.svg" target="_blank">
            <img src="../../assets/images/example-nft.svg" alt="Example NFT" />
          </a>
        </div>

        <div class="nftList">
          <button v-if="connectionStatus === statuses.disconnected" class="item mint" @click="connect">
            <small>Click here to:</small><br /><br /><b>CONNECT your wallet!</b><br /><br />
            <small> MINT / see your NFTs</small>
          </button>
          <button v-if="connectionStatus === statuses.connecting" class="item connecting">Connecting...</button>
          <button v-if="connectionStatus === statuses.minting" class="item minting glowing">Minting...</button>
          <button v-if="connectionStatus === statuses.waitngForRng" class="item minting glowing">
            MINTED!<br /><br />now waiting<br />for RNG...
          </button>
          <button v-if="connectionStatus === statuses.connected" class="item mint" @click="mint">
            <small>click here to</small><br /><br /><b>MINT</b>
          </button>
          <button
            v-if="connectionStatus === statuses.errored"
            class="item error"
            @click="connectionStatus = statuses.connected"
          >
            Error...<br /><br />
            click to restart
          </button>

          <a
            v-for="(nft, index) in [...nfts].reverse()"
            :key="index"
            class="item"
            :class="{ glowing: justMinted && index === 0 }"
            :href="nft.ready ? nft.uri : ''"
            target="_blank"
          >
            <img v-if="nft.ready" :src="nft.uri" />
            <img v-else src="../../assets/images/crafting-nft.svg" />
          </a>
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
import { ref, watch, onMounted } from "vue";
import { getContract } from "../../lib/contract";

const statuses = {
  disconnected: "disconnected",
  connecting: "connecting",
  connected: "connected",
  minting: "minting",
  waitngForRng: "waitngForRng",
  errored: "errored",
};

const { connectWallet, connectedWallet } = useOnboard();
const connectionStatus = ref(statuses.disconnected);
const nfts = ref([]);
const justMinted = ref(false);

//
// --- walet hooks
async function onConnect() {
  if (connectionStatus.value === statuses.connected) return;
  connectionStatus.value = statuses.connected;
  await fetchList();
}

async function onDisconnectConnect() {
  connectionStatus.value = statuses.disconnected;
  nfts.value = [];
}

//
// --- wallet actions
async function connect() {
  try {
    await connectWallet();
  } catch (error) {
    connectionStatus.value = statuses.errored;
  }
}

//
// --- nft actions
async function fetchList() {
  if (!connectedWallet) await connect();

  const contract = await getContract(connectedWallet.value);
  const ownedTokenIds = await contract.ownedTokens(connectedWallet.value.accounts[0].address);

  const list = [];
  for (const tokenId of ownedTokenIds) {
    try {
      const encodedBased64TokenUri = await contract.tokenURI(tokenId);
      const tokenUri = atob(encodedBased64TokenUri.slice(29));
      const tokenData = JSON.parse(tokenUri);
      const uri = tokenData.image;
      list.push({ id: tokenId, uri, ready: true });
    } catch (error) {
      list.push({ id: tokenId, uri: null, ready: false });
    }
  }
  nfts.value = list;
}

async function mint() {
  if (!connectedWallet) await connect();

  try {
    connectionStatus.value = statuses.minting;
    const contract = await getContract(connectedWallet.value);
    const fee = await contract.easyntropyFee();
    const tx = await contract.mint({ value: fee });
    await tx.wait();

    connectionStatus.value = statuses.waitngForRng;

    const latestTokenIds = await contract.ownedTokens(connectedWallet.value.accounts[0].address);
    const latestMintedTokenIds = latestTokenIds[latestTokenIds.length - 1];

    let seedObtained = false;
    while (!seedObtained) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // eslint-disable-next-line no-console
      console.log("Waiting for RNG...");
      seedObtained = (await contract.seeds(latestMintedTokenIds)) !== 0n;
    }

    await fetchList();
    justMinted.value = true;
    connectionStatus.value = statuses.connected;
  } catch (error) {
    connectionStatus.value = statuses.errored;
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
  background: url("../../assets/images/kv.png") no-repeat 50% 100%;
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
      }

      .item.mint {
        border: 3px dashed #c559f3;
        color: #c559f3;
        font-size: 1.2rem;
        background: #c559f31a;
        cursor: pointer;

        &:hover {
          background: #c559f33d;
        }
      }

      .item.error {
        border: 3px dashed #f35959;
        color: #f33;
        font-size: 1.2rem;
        background: #ff00001a;
        cursor: pointer;

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
