import type { LngLat } from '@yandex/ymaps3-types';


export const generateId = (clickedPoint: LngLat): string => `${Date.now()}_${clickedPoint}`;