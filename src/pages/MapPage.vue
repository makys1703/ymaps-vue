<template>
  <yandex-map v-model="map" :settings="{
    location: {
      center: MAP_CENTER_COORDS,
      zoom: 10
    },
  }" width="100%" height="100vh">

    <yandex-map-default-scheme-layer />
    <yandex-map-default-features-layer />
    
    <yandex-map-controls :settings="{ position: 'left' }">
      <yandex-map-zoom-control />
    </yandex-map-controls>

    <yandex-map-feature :settings="{
      geometry: {
        type: 'Polygon',
        coordinates: [INITIAL_POLYGON_DATA],
      },
      style: {
        stroke: [{
          color: '#312c85',
          width: 2,
        }],
        fill: 'rgba(56, 56, 219, 0.5)',
      }
    }" />

    <yandex-map-feature :settings="{
      geometry: {
        type: 'Polygon',
        coordinates: [polygonData],
      },
      style: {
        stroke: [{
          color: '#ff6467',
          width: 2,
        }],
        fill: '#ffc9c9',
      }
    }" />

    <yandex-map-default-marker v-if="isReady && lastClickedPoint" :settings="{
      coordinates: lastClickedPoint,
      color: 'rgb(193, 0, 7, 0.75)',
      draggable: false,
    }" />

    <yandex-map-feature v-if="isReady && lastClickedPoint && lastNearestPoint" :settings="{
      geometry: {
        type: 'LineString',
        coordinates: [lastClickedPoint, lastNearestPoint],
      },
      style: {
        stroke: [{
          color: '#9f2d00',
          width: 2,
          dash: [5, 5]
        }],
        fill: 'rgba(56, 56, 219, 0.5)',
      }
    }" />

    <yandex-map-listener :settings="{
      onClick: (_, e) => drawDirectRoute(e.coordinates)
    }" />

  </yandex-map>

  <app-toast-list :list="toasts" />

  <app-expand-range />

</template>

<script setup lang="ts">
import { shallowRef, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { findNearest, isPointInPolygon, getDistance, convertDistance } from 'geolib';
import { PointError } from '@/shared/enums';
import AppToastList from '@/components/AppToastList.vue';
import AppExpandRange from '@/components/AppExpandRange.vue';
import {
  YandexMap,
  YandexMapDefaultSchemeLayer,
  YandexMapDefaultFeaturesLayer,
  YandexMapControls,
  YandexMapZoomControl,
  YandexMapFeature,
  YandexMapDefaultMarker,
  YandexMapListener
} from 'vue-yandex-maps';
import { usePointsStore, useToastsStore, usePolygonStore } from '@/stores';
import type { YMap, LngLat } from '@yandex/ymaps3-types';
import { INITIAL_POLYGON_DATA } from '@/stores/constants';

const MAP_CENTER_COORDS: LngLat = [37.617644, 55.755819];

const pointsStore = usePointsStore();
const { isReady, lastClickedPoint, lastNearestPoint } = storeToRefs(pointsStore);

const toastsStore = useToastsStore();
const { toasts } = storeToRefs(toastsStore);

const { polygon, polygonData } = storeToRefs(usePolygonStore());

const getPlaceInfo = async (point: LngLat) => {

  if (isPointInPolygon(point, polygonData.value)) {
    throw new Error(PointError.Point);;
  }

  try {
    const searchResult = await ymaps3.search({ text: point.toString() });
    const title = searchResult[0].properties.name;

    if (!title) {
      throw new Error(PointError.NotFound);
    }

    const text = searchResult[0].properties.description ?? '';

    return {
      title,
      text
    }
  } catch {
    throw new Error(PointError.Fetch);
  }
};

const getDirectDistance = (pointA: LngLat, pointB: LngLat): number => 
  convertDistance(getDistance(pointA, pointB), 'km');

const drawDirectRoute = async (point: LngLat) => {
  try {
    const { title, text } = await getPlaceInfo(point);
    const nearestPoint = findNearest(point, polygonData.value) as LngLat;
    const distance = getDirectDistance(nearestPoint, point);
    const id = crypto.randomUUID();

    pointsStore.addPoint({
      id,
      title,
      text,
      clickedPoint: point,
      nearestPoint,
      distance
    });

    toastsStore.addToast({
      id,
      title,
      text,
      distance
    });

  } catch(error: unknown) {
    const id = crypto.randomUUID();

    if (error instanceof Error) {
      pointsStore.addErrorPoint({
        id,
        errorMessage: error.message,
        clickedPoint: point
      });

      toastsStore.addErrorToast({
        id,
        text: error.message
      });

      return;
    }

    pointsStore.addErrorPoint({
      id,
      errorMessage: PointError.Unknown,
      clickedPoint: point
    });

    toastsStore.addErrorToast({
      id,
      text: PointError.Unknown
    });
  }
}

watch(polygon.value, () => {
  drawDirectRoute(lastClickedPoint.value);
});

const map = shallowRef<null | YMap>(null);
</script>