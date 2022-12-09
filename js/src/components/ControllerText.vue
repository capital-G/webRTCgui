<script setup lang="ts">
import { defineProps, ref, Ref, PropType } from "vue";
import { useSocketIO } from "../services/socketio.service";
import { TextController } from "../communication";

const { socket } = useSocketIO();

const props = defineProps({
  controller: {type: Object as PropType<TextController>, required: true}
});

var value: Ref<string> = ref(props.controller.value);

async function updateText() {
    // as we can not update props in vue
    // we instead copy it and use it to set the values
    var c = structuredClone({...props.controller});
    c.value = value.value;
    socket.emit("changeController", c);
}
</script>

<template>
  <v-container>
    <v-row class="text-center">
      <v-col>
        <div>
          <div class="text-caption">{{ $props.controller.name }}</div>
          <v-textarea
            v-model="value"
            @change="updateText()"
            color="orange"
          />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
