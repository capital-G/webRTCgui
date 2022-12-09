<script setup lang="ts">
import type { PropType, Ref } from "vue";
import { defineProps, ref, watch } from "vue";
import { useSocketIO } from "../services/socketio.service";
import type { SliderController } from "../communication";

const props = defineProps({
  controller: { type: Object as PropType<SliderController>, required: true }
});

const { socket } = useSocketIO();

const value: Ref<number> = ref(props.controller.value);

async function sendUpdate() {
  // as we can not update props in vue
  // we instead copy it and use it to set the values
  const c = structuredClone({ ...props.controller });
  c.value = value.value;
  socket.emit("changeController", c);
}

watch(value, sendUpdate);
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div>
          <div class="text-caption">
            {{ $props.controller.name }}
          </div>
          <v-slider
            v-model="value"
            color="orange"
            :min="$props.controller.min"
            :max="$props.controller.max"
            thumb-label
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
