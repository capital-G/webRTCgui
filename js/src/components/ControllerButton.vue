<script setup lang="ts">
import type { PropType, Ref } from "vue";
import { defineProps, ref } from "vue";
import { useSocketIO } from "../services/socketio.service";
import type { ButtonController } from "../communication";

const props = defineProps({
  controller: { type: Object as PropType<ButtonController>, required: true }
});

const { socket } = useSocketIO();

const value: Ref<number> = ref(props.controller.value);

async function buttonPress() {
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
        <div>
          <v-btn
            v-model="value"
            color="orange"
            @click="buttonPress()"
          >
            {{ $props.controller.name }}
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
