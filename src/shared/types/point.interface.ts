import type { LngLat } from '@yandex/ymaps3-types';


export interface IPoint {
  id: string;
  title: string;
  text: string;
  clickedPoint: LngLat;
  nearestPoint?: LngLat;
  distance?: number;
  error?: boolean;
}