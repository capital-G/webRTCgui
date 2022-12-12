import { createApp } from "vue";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { createPinia } from "pinia";

import App from "./App.vue";

const vuetify = createVuetify({
  components,
  directives
});

const pinia = createPinia();

createApp(App)
  .use(vuetify)
  .use(pinia)
  .mount("#app");
