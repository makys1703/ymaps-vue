<template>
  <vue-transition>
    <div v-show="show" 
      class="text-sm py-3 px-5 w-[350px] rounded-lg backdrop-blur-xl shadow-lg opacity-90" 
      :class="{
        'bg-red-100': error,
        'bg-stone-50': !error
      }"
    >
    <header>
      <strong>{{ title.toUpperCase() }}</strong>
    </header>
    <main class="py-1">
      <p>{{ text }}</p>
      <p v-show="!error && distance" class="pt-1">
        <strong>Расстояние до полигона: {{ distance?.toFixed(1) }} км.</strong>
      </p>
    </main>
  </div>
  </vue-transition>
</template>

<script setup lang="ts">
import { ref, onMounted, Transition as VueTransition } from 'vue';
import type { IToast } from '@/shared/types';


type IProps = Omit<IToast, 'id'>;

defineProps<IProps>();

const SHOW_TIME = 3000;

const emit = defineEmits<{
  (e: 'close', timeoutId: number): void
}>();

const show = ref<boolean>(true);

onMounted(() => {
  const timeoutId = setTimeout(() => {
    show.value = false;
    emit('close', timeoutId);
  }, SHOW_TIME)
});

</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease-in;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
