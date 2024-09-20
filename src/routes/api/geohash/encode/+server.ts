import { json } from '@sveltejs/kit';
import geohash from 'ngeohash';

// encode get api
export async function GET({ url }) {
    let lat = Number(url.searchParams.get('lat') ?? 0);
    let lng = Number(url.searchParams.get('lng') ?? 0);
    let zoom = Number(url.searchParams.get('zoom') ?? 10);
    
    const response = {encode: geohash.encode(lat, lng, zoom)};
    return json(response);
}