import type { PageLoad } from './$types';
import geohash from 'ngeohash';

export const load: PageLoad = (async ({ fetch }) => {
    try {
        const res = await fetch(`/api/geohash/all`, {
            method: "GET"
        });
    
        if (!res.ok) {
            throw new Error(`Failed to get all the geohash : HTTP error! status: ${res.status}`);
        }
        let data = await res.json();
        for (const e of data.points) {
            // const res = await fetch(`/api/geohash/decode?geohash=${e.geohash}`, {method: "GET"});
            // const data = await res.json();
            e.coordinate = geohash.decode(e.geohash);
        }
        return data;
    } catch (error) {
        console.error(error);
    }
});