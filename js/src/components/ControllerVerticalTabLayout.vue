<script setup lang="ts">
import type { PropType } from "@vue/runtime-core";
import { ref } from "vue";
import type { VerticalTabLayoutController } from "../communication";
import ControllerSwitch from "./ControllerSwitch.vue";

const props = defineProps({
  controller: { type: Object as PropType<VerticalTabLayoutController>, required: true }
});

const tab = ref(null);
</script>

<template>
  <v-container>
    <v-card>
      <!-- <v-toolbar
        color="primary"
      >
        <v-toolbar-title>User Profile</v-toolbar-title>
      </v-toolbar> -->
      <div class="d-flex flex-row">
        <v-tabs
          v-model="tab"
          direction="vertical"
          color="primary"
        >
          <v-tab v-for="(_, tabName) in props.controller.controllers" :key="tabName" :value="tabName">
            {{ tabName }}
          </v-tab>
        </v-tabs>
        <v-window v-model="tab">
          <v-window-item v-for="(c, tabName) in props.controller.controllers" :key="tabName" :value="tabName">
            <ControllerSwitch
              :controller="c"
            />
          </v-window-item>
        </v-window>
      </div>
    </v-card>
  </v-container>
</template>
