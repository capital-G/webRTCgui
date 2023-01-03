<script setup lang="ts">
import type { PropType } from "@vue/runtime-core";
import { ref } from "vue";
import type { TabLayoutController } from "../communication";
import ControllerSwitch from "./ControllerSwitch.vue";

const props = defineProps({
  controller: { type: Object as PropType<TabLayoutController>, required: true }
});

const tab = ref(null);
</script>

<template>
  <v-container>
    <v-card>
      <v-tabs
        v-model="tab"
        bg-color="primary"
      >
        <v-tab v-for="(_, tabName) in props.controller.controllers" :key="tabName" :value="tabName">
          {{ tabName }}
        </v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="tab">
          <v-window-item v-for="(c, tabName) in props.controller.controllers" :key="tabName" :value="tabName">
            <ControllerSwitch
              :controller="c"
            />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>
