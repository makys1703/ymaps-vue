import { defineStore } from "pinia"
import { buffer } from '@turf/buffer';
import { polygon as turfPolygon } from '@turf/helpers';
import { INITIAL_POLYGON_DATA, MAX_EXPAND_VALUE, CANNOT_EXPAND_POLYGON_ERROR } from './constants';
import type { LngLat } from '@yandex/ymaps3-types';
import type { Position } from 'geojson';


interface IPolygon {
  expandBy: number;
  data: LngLat[];
};

export const usePolygonStore = defineStore('polygon', {
  state: () => ({
    polygon: {
      expandBy: 0,
      data: INITIAL_POLYGON_DATA
    } as IPolygon
  }),
  getters: {
    polygonData: (state) => state.polygon.data,
    expandValue: (state) => state.polygon.expandBy
  },
  actions: {
    expandPolygon(value: number) {

      if (value <= 0) {
        this.polygon.expandBy = 0;
        this.polygon.data = INITIAL_POLYGON_DATA;
      }

      if (value > MAX_EXPAND_VALUE) {
        value = MAX_EXPAND_VALUE;
      }

      const polygon = turfPolygon([INITIAL_POLYGON_DATA] as Position[][]);
      const bufferedData = buffer(polygon, value, { units: 'kilometers' });

      if (!bufferedData) {
        console.error(CANNOT_EXPAND_POLYGON_ERROR);
        return;
      }

      const expandedPolygon = bufferedData.geometry.coordinates[0] as LngLat[];
      this.polygon.data = expandedPolygon;
      this.polygon.expandBy = value;
    }
  },
  persist: {
    key: 'polygonData'
  }
})