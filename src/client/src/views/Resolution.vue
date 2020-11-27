<template>
  <v-main>
    <!-- inputs to add resolutions -->
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs4 px-4>
          <v-select
            color="secondary"
            prepend-icon="mdi-map"
            :items="tileURLs"
            item-text="name"
            item-value="url"
            v-model="tileURL"
          ></v-select>
        </v-flex>
        <v-flex xs3 px-2>
          <v-text-field
            readonly
            color="secondary"
            prepend-icon="mdi-map-marker-radius"
            label="Flag Location"
            :value="resolutionLatLng"
          ></v-text-field>
        </v-flex>
        <v-flex xs4>
          <v-text-field
            color="secondary"
            prepend-icon="mdi-book-education-outline"
            label="Make Your Resolution"
            v-model="resolution"
          ></v-text-field>
        </v-flex>
        <v-flex xs1>
          <v-btn
            block
            color="secondary"
            class="ma-2 white--text"
            @click="addMarker"
          >
            Add Flag
            <v-icon right dark>
              mdi-flag-plus-outline
            </v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-container>
    <!-- resolution over world map -->
    <l-map 
      ref="resolutionMap"
      style="z-index: 1;"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      @dblclick="updateResolutionLatLng"
    >
      <l-tile-layer
        :url="tileURL"
        :attribution="attribution"
      ></l-tile-layer>
      <template v-for="(marker, index) in markers">
        <l-marker
          draggable
          :key="index"
          :lat-lng="marker.latlng"
          @dblclick="markerRemove(index)"
          @update:lat-lng	="markerMove(index, $event)"
        >
          <l-popup :key="index">{{ marker.popup }}</l-popup>
        </l-marker>
      </template>
    </l-map>
  </v-main>
</template>

<script>

  // eslint-disable-next-line
  import L from 'leaflet'
  // eslint-disable-next-line
  import { LMap, LTileLayer, LMarker, LPopup, LGeoJson } from 'vue2-leaflet'

  // marker lost due to webpack
  import { Icon } from 'leaflet'

  delete Icon.Default.prototype._getIconUrl
  Icon.Default.mergeOptions({
    // iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconUrl: require('./Resolution/flag-icon.png'),
    // iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconRetinaUrl: require('./Resolution/flag-icon-2x.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  })

  // load data from local
  import markers from './Resolution/markers.json'

  export default {
    name: 'apps-resolution',
    components: {
      // eslint-disable-next-line
      LMap,
      // eslint-disable-next-line
      LTileLayer,
      // eslint-disable-next-line
      LMarker,
      // eslint-disable-next-line
      LPopup,
      // eslint-disable-next-line
      LGeoJson,
    },
    data: () => ({
      zoom: 3,
      center: L.latLng(31.415926, 180.000000),
      tileURLs: [
        {
          name: 'OpenStreetMap.Mapnik' ,
          url:'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
        },
        {
          name: 'CartoDB.Positron',
          url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
        }
      ],
      tileURL: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution:'&copy; Overcoded 2020',
      markers: markers,
      resolution: '',
      resolutionLatLng: L.latLng(31.415926, 180.000000),
    }),
    computed: {

    },
    methods: {
      zoomUpdated (zoom) {
        this.zoom = zoom
      },
      centerUpdated (center) {
        this.center = center
      },
      boundsUpdated (bounds) {
        this.bounds = bounds
      },
      updateResolutionLatLng (e) {
        this.resolutionLatLng = e.latlng
      },
      addMarker () {
        this.markers.push({
          latlng: this.resolutionLatLng,
          popup: this.resolution,
        });
      },
      markerMove (index, event) {
        this.$set(this.markers[index], 'latlng', event)
      },
      markerRemove (index) {
        this.markers.splice(index, 1);
      },

    },
    created () {

    },
    mounted () {

    },
    beforeDestroy () {
      // save the markers to file
      let fn = 'markers.json'
      let ms = JSON.stringify(this.markers)
      let bb = new Blob([ms], { type: 'text/plain;charset=utf-8;' })
      if (navigator.msSaveBlob) {
        // ie 10+
        navigator.msSaveBlob(bb, fn)
      } else {
        let link = document.createElement('a')
        if (link.download !== undefined) {
          // feature detection, browsers that support HTML5 download attribute
          let url = URL.createObjectURL(bb)
          link.setAttribute('href', url)
          link.setAttribute('download', fn)
          link.style.visibility = 'hidden'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }
      }
    },
  }
</script>

<style scoped>

</style>