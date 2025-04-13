<template>
  <div class="p-3 w-[350px] absolute bottom-3 left-3 bg-stone-50 rounded-lg backdrop-blur-xl shadow-lg opacity-95">
    <label for="steps-range" class="block mb-2 text-sm font-medium text-gray-900">
      <span>
        Увеличить размер полигона
        <span v-if="expandValue > 0"> на <strong>{{ expandValue }}км</strong></span>
      </span>
    </label>
    <input 
      class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
      id="minmax-range" 
      type="range" 
      min="0" 
      max="30" 
      step="5"
      :value="expandValue"
      @input="inputHandler"
    >
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { usePolygonStore } from '@/stores';

const polygonStore = usePolygonStore();
const { expandValue } = storeToRefs(polygonStore);

const inputHandler = (e: Event) =>
  polygonStore.expandPolygon(Number((e.target as HTMLInputElement).value));

</script>