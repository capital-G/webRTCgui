<script setup lang="ts">
import { defineProps, ref, Ref, PropType } from "vue";
import { useSocketIO } from "../services/socketio.service";
import { ButtonController } from "../communication";

const { socket } = useSocketIO();

const props = defineProps({
  controller: {type: Object as PropType<ButtonController>, required: true}
});

var value: Ref<number> = ref(props.controller.value);

async function buttonPress() {
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
          <v-btn
            v-model="value"
            @click="buttonPress()"
            color="orange"
          >{{ $props.controller.name }}</v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
