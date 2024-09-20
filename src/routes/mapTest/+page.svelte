<script>
	import { onMount } from "svelte";
	import "ol/ol.css";
	import Map from "ol/Map";
	import View from "ol/View";
	import { Tile as TileLayer } from "ol/layer";
	import { OSM } from "ol/source";
	import { Cluster, Vector as VectorSource } from "ol/source";
	import { Point } from "ol/geom";
	import { Vector as VectorLayer } from "ol/layer";
	import { Feature } from "ol";
	import { Circle as CircleStyle, Fill, Stroke, Style, Text } from "ol/style";
	import { fromLonLat } from "ol/proj";
	import ngeohash from "ngeohash";
  
	let map;
  
	// 임의의 좌표 데이터
	const coordinates = [
	  [127.001, 37.570],
	  [127.002, 37.571],
	  [127.003, 37.572],
	  [127.004, 37.573],
	  [127.005, 37.574],
	];
  
	// GeoHash로 변환된 좌표 클러스터링
	const geohashCoords = coordinates.map((coord) => {
	  const geohash = ngeohash.encode(coord[1], coord[0]); // GeoHash 변환 (위도, 경도)
	  const { latitude, longitude } = ngeohash.decode(geohash);
	  return [longitude, latitude];
	});
  
	// 피처 생성
	const features = geohashCoords.map((coord) => {
	  return new Feature({
		geometry: new Point(fromLonLat(coord)),
	  });
	});
  
	// 소스 및 클러스터 소스 설정
	const vectorSource = new VectorSource({
	  features: features,
	});
  
	const clusterSource = new Cluster({
	  distance: 50, // 클러스터링 거리 (픽셀 단위)
	  source: vectorSource,
	});

	const vectorLayer = new VectorLayer({
		source: vectorSource
	})
  
	// 스타일 설정
	const clusterLayer = new VectorLayer({
	  source: clusterSource,
	  style: function (feature) {
		const size = feature.get("features").length;
		let style = new Style({
		  image: new CircleStyle({
			radius: 10,
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
	  },
	});
  
	// 맵 설정
	onMount(() => {
	  map = new Map({
		target: "map",
		layers: [
		  new TileLayer({
			source: new OSM(),
		  }),
		  clusterLayer,
		  vectorLayer
		],
		view: new View({
		  center: fromLonLat([127.001, 37.570]), // 서울 중심 좌표
		  zoom: 10,
		}),
	  });
	});
  </script>
  
  <style>
	#map {
	  width: 100%;
	  height: 500px;
	}
  </style>
  
  <div id="map"></div>
  