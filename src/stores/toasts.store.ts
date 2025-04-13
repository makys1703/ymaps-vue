import { defineStore } from "pinia"
import type { IToast } from "@/shared/types";
import { TITLE_ERROR } from './constants';


interface IAddErrorToast {
  id: string;
  text: string;
};

export const useToastsStore = defineStore('toasts', {
  state: () => ({
    toasts: [] as IToast[],
  }),
  actions: {
    addToast(toast: IToast) {
      this.toasts.push(toast);
    },
    addErrorToast({ id, text }: IAddErrorToast) {
      this.toasts.push({
        id,
        title: TITLE_ERROR,
        text,
        error: true
      });
    }
  }
})