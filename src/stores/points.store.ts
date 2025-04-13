import { defineStore } from "pinia"
import type { IPoint } from "@/shared/types";
import type { LngLat } from '@yandex/ymaps3-types';
import { TITLE_ERROR } from "./constants";


interface IAddErrorPoint {
  id: string;
  clickedPoint: LngLat;
  errorMessage: string;
}

export const usePointsStore = defineStore('points', {
  state: () => ({
    points: [] as IPoint[],
  }),
  getters: {
    isReady: (state) => {
      const isEmpty = state.points.length === 0;
      const isError = state.points[state.points.length - 1]?.error;
      return !isError && !isEmpty;
    },
    lastClickedPoint: (state) =>
      state.points[state.points.length - 1].clickedPoint,
    lastNearestPoint: (state) =>
      state.points[state.points.length - 1].nearestPoint
  },
  actions: {
    addPoint(point: IPoint) {
      this.points.push(point);
    },
    addErrorPoint({ id, clickedPoint, errorMessage }: IAddErrorPoint) {
      this.points.push({
        id,
        clickedPoint,
        title: TITLE_ERROR,
        text: errorMessage,
        error: true
      });
    }
  },
  persist: {
    key: 'pointsData'
  }
})