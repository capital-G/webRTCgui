<script setup lang="ts">
import type { PropType, Ref } from "vue";
import { defineProps, ref } from "vue";
import { useSocketIO } from "../services/socketio.service";
import type { TextController } from "../communication";

const props = defineProps({
  controller: { type: Object as PropType<TextController>, required: true }
});

const { socket } = useSocketIO();

const value: Ref<string> = ref(props.controller.value);

async function updateText() {
  // as we can not update props in vue
  // we instead copy it and use it to set the values
  const c = structuredClone({ ...props.controller });
  c.value = value.value;
  socket.emit("changeController", c);
}
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div :class="{ monospace: props.controller.monospace }">
          <div class="text-caption">
            {{ $props.controller.name }}
          </div>
          <v-textarea
            v-model="value"
            color="orange"
            @change="updateText()"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
  .monospace {
    font-family: monospace;
  }
</style>
