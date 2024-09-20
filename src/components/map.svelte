<script>
// @ts-nocheck

	import Map from 'ol/Map.js';
	import TileLayer from 'ol/layer/Tile';
	import { OSM } from 'ol/source';
	import View from 'ol/View';
    import { defaults } from 'ol/control'
	import { Point } from 'ol/geom';
	import Feature from 'ol/Feature';
	import { Cluster, Vector as VectorSource } from 'ol/source';
	import VectorLayer from 'ol/layer/Vector';
    import GeoLocation from 'ol/Geolocation';
	import Overlay from 'ol/Overlay';
    import { onDestroy, onMount } from 'svelte';
    import Style from 'ol/style/Style';
    import {Circle, Stroke, Fill, Text} from 'ol/style';
    import geohash from 'ngeohash';


    export let initAll;

    let currentPosition = JSON.parse(localStorage.getItem('currentPosition'));
    let targetCoordinate;
    let targetGeohash;

    let map;

    let currentLocationFeature = new Feature();
    currentLocationFeature.setStyle(new Style({
        image: new Circle({
            stroke: new Stroke({
                color: '#ff0000',
                width: 2
            }),
            radius: 9
        })
    }))

    if (currentPosition) {
        currentLocationFeature.setGeometry(new Point([currentPosition.lng, currentPosition.lat]))
    }
    
    let popupFeature = new Feature();
    let vectorSource = new VectorSource({
        features: [currentLocationFeature, popupFeature]
    });
    
    let vectorLayer = new VectorLayer({
        source: vectorSource
    });

    

    const addGeohash = async (/** @type {string} */ geohash, /** @type {number[]} */ coordinate) => {
        const response = await fetch(`/api/geohash/add`, {
            method: 'POST',
            body: JSON.stringify({geohash: geohash})
        });
        const json = await response.json();
        if (response.status === 200) {
            const feature = new Feature({
                id: json.id,
                geometry: new Point(coordinate)
            })
            const style = new Style({
                image: new Circle({
                    fill: new Fill({
                        color: '#ff00000'
                    }),
                    radius: 5
                })
            })
            feature.setStyle(style);
            // @ts-ignore
            vectorSource.addFeature(feature);
        }
    }

    const updateClusterDistance = (zoom) => {
        let distance;
        if (zoom < 10) {
            distance = 80;
        } else if (zoom < 12) {
            distance = 50;
        } else {
            distance = 30;
        }
        return distance;
    }

    onMount(() => {
        map = new Map({
            layers: [new TileLayer({ source: new OSM() }), vectorLayer],
            view: new View({
                zoom: 8,
                projection: 'EPSG:4326',
                center: currentPosition ? [currentPosition.lng, currentPosition.lat] : [0,0]
            }),
            controls: defaults({
                attribution: false,
                zoom: false,
                rotate: false,
            }),
            target: 'map'
        });

        const geoLocation = new GeoLocation({
            trackingOptions: {
                enableHighAccuracy: true
            },
            projection: map.getView().getProjection(),
            tracking: true
        })

        geoLocation.on('change:position', (e) => {
            const coordinate = geoLocation.getPosition();
            currentLocationFeature.setGeometry(coordinate ? new Point(coordinate) : undefined);
            map.getView().setCenter(coordinate);
        })

        const container = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        const closer = document.getElementById('popup-closer');

        let popup = new Overlay({
            element: container ?? undefined
        });

        if (closer !== null) {
            closer.onclick = function () {
                popup.setPosition(undefined);
                closer.blur();
                return false;
            }   
        }
        
        map.addOverlay(popup);

        const features = initAll.points.map(e => {
            const feature = new Feature({
                id: e.id,
                geometry: new Point([e.coordinate.longitude, e.coordinate.latitude])
            })
            const style = new Style({
                image: new Circle({
                    fill: new Fill({
                        color: '#ff00000'
                    }),
                    radius: 5
                })
            })
            feature.setStyle(style);
            return feature;
        })

        let clusterSource = new Cluster({
            id: 'cluster',
            distance: 300,
            source: new VectorSource({
                features: features
            })
        })

        let clusterLayer = new VectorLayer({
            source: clusterSource,
            style: function (feature) {
                const size = feature.get("features").length;
                let style = new Style({
                    image: new Circle({
                        radius: 30,
                        stroke: new Stroke({
                        color: "#fff",
                        }),
                        fill: new Fill({
                        color: "#3399CC",
                        }),
                    }),
                    text: new Text({
                        text: size.toString(),
                        fill: new Fill({
                        color: "#fff",
                        }),
                    }),
                });
                return style;
            }
        });

        map.addLayer(clusterLayer);

        map.on('click', async (evt) => {
            const coordinate = evt.coordinate;
            targetGeohash = geohash.encode(coordinate[1], coordinate[0], Math.floor(map.getView().getZoom() ?? 10));
            popup.setPosition(coordinate);
        });

        map.getView().on("change:resolution", (e) => {
            const zoom = map.getView().getZoom();
            const extent = map.getView().calculateExtent();
            const bbox = geohash.bboxes (extent[0], extent[1], extent[2], extent[3], 3);

            clusterSource.setDistance(updateClusterDistance(zoom));
        });
        
        map.getView().on("change:center", async (e) => {
            const zoom = map.getView().getZoom();
            const extent = map.getView().calculateExtent();
            const bbox = geohash.bboxes (extent[0], extent[1], extent[2], extent[3], 3);
        })
    })

    onDestroy(() => {
        const coordinate = currentLocationFeature.getGeometry().getCoordinates();
        localStorage.setItem('currentPosition', JSON.stringify({
            lat: coordinate[1],
            lng: coordinate[0]
        }))
    })
</script>

<div>
	<div id="map" class="map"></div>
    <div id="popup" class="ol-popup">
        <!-- svelte-ignore a11y-invalid-attribute -->
        <!-- svelte-ignore a11y-missing-content -->
        <a href="#" id="popup-closer" class="ol-popup-closer"></a>
        <div>
            <div id="popup-content">
                <p>You clicked here:</p>
                <code>{targetGeohash}</code>
                <input type="button" value="追加" on:click={addGeohash(targetGeohash, targetCoordinate)}>
            </div>
        </div>
    </div>
</div>

<style>
	.map {
		width: 1500px;
		height: 800px;
		margin: auto;
		margin-top: 25px;
	}
    .ol-popup {
        position: absolute;
        background-color: white;
        box-shadow: 0 1px 4px rgba(0,0,0,0.2);
        padding: 15px;
        border-radius: 10px;
        border: 1px solid #cccccc;
        bottom: 12px;
        left: -50px;
        min-width: 280px;
      }
      .ol-popup:after, .ol-popup:before {
        top: 100%;
        border: solid transparent;
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
      }
      .ol-popup:after {
        border-top-color: white;
        border-width: 10px;
        left: 48px;
        margin-left: -10px;
      }
      .ol-popup:before {
        border-top-color: #cccccc;
        border-width: 11px;
        left: 48px;
        margin-left: -11px;
      }
      .ol-popup-closer {
        text-decoration: none;
        position: absolute;
        top: 2px;
        right: 8px;
      }
      .ol-popup-closer:after {
        content: "✖";
      }
</style>