<script>
	import Map from "../../components/map.svelte";
    export let data;
</script>

<svelte:head>
	<title>Geohash</title>
</svelte:head>

<div>
	<Map initAll={data}></Map>
</div>

<style>
</style>