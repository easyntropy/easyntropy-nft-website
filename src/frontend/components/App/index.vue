<template>
  <div class="host">
    <div class="header">
      <a href="/" class="logo">Easyntrophy NFT</a>
      <a href="https://easyntropy.tech/" class="poweredBy">
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
  </div>
</template>

<script setup></script>

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
  height: max(70vh, 400px);
  background: url("../assets/images/kv.png") no-repeat 50% 100%;
  background-size: cover;

  .elements {
    width: 300px;
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
</style>
