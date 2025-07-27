<template>
  <div>
    <h1>hello world!</h1>
  </div>
</template>

<script setup></script>

<style lang="scss">
@import "./css/variables.scss";
@import "./css/normalize";

html {
  font-size: 8px;
}

html,
body,
#app {
  height: 100%;
  color: $text;
  font-family: Tahoma, sans-serif;
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
</style>
