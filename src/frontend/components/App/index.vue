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
          Lets add some easy-to-use RNG to Eth contracts!<br /><br /><br />
          Easyntropy is a collection of unique,<br />randomly generated, stored purely onchain NFTs,<br />powered by the
          Easyntropy Eth RNG Oracle.
        </h1>
      </div>
    </div>

    <div class="listSection">
      <strong class="title">List of NFTs:</strong>

      <div class="nftListWrapper">
        <div v-if="nfts.length === 0" class="example">
          <span>Example NFT:</span>
          <a href="../../assets/images/example-nft.svg" target="_blank">
            <img src="../../assets/images/example-nft.svg" alt="Example NFT" />
          </a>
        </div>

        <div class="nftList">
          <button v-if="connected" class="item mint" @click="mint">
            CLICK HERE<br />
            to MINT
          </button>
          <button v-else class="item mint" @click="connect">
            <b>Click here to CONNECT:</b><br /><br />
            - MINT <br />
            - see your NFTs
          </button>

          <a v-for="(nft, index) in nfts" :key="index" class="item" :href="nft.uri" target="_blank">
            <img :src="nft.uri" />
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
import placeholderImg from "../../assets/images/example-nft.svg";

import { ref } from "vue";

const connected = ref(false);
const nfts = ref([]);

async function connect() {
  try {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      if (accounts.length > 0) {
        connected.value = true;
      }
    } else {
      alert("Please install MetaMask to connect and mint NFTs");
    }
  } catch (error) {
    console.error("Connection error:", error);
  }
}

async function mint() {
  if (!connected.value) {
    await connect();
    if (!connected.value) return;
  }

  try {
    alert("NFT minted successfully!");

    nfts.value.push({ uri: placeholderImg });
  } catch (error) {
    console.error("Minting error:", error);
  }
}
</script>

<style lang="scss">
@import "./css/fonts";
@import "./css/variables.scss";
@import "./css/normalize";

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
  background: url("../assets/images/kv.png") no-repeat 50% 100%;
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
    margin: 1rem;
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
