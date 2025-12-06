import * as Sentry from "@sentry/vue";
import { createApp } from "vue";
import App from "./components/App/index.vue";
import "./lib/wallet-connection.js";

const app = createApp(App);
Sentry.init({ app, dsn: import.meta.env.VITE_BUGSINK_DSN });
app.mount("#app");
