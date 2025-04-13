<template>
  <div 
    v-show="Boolean(list.length)" 
    class="pt-3 pb-3 pr-3 absolute max-h-screen overflow-x-hidden overflow-scroll top-0 right-0 flex flex-col-reverse gap-3"
  >
      <AppToast 
        v-for="(toast) in list"
        :title="toast.title"
        :text="toast.text"
        :distance="toast.distance"
        :error="toast.error"
        :key="toast.id"
        @close="onClose"
      />
  </div>
</template>

<script setup lang="ts">
import AppToast from './AppToast.vue';
import type { IToast } from '@/shared/types';


defineProps<{
  list: IToast[]
}>();

const onClose = (timeoutId: number) => {
  clearTimeout(timeoutId);
};
</script>
