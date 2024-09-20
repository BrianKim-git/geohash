import { json } from '@sveltejs/kit';
import geohash from 'ngeohash';

// encode get api
export async function GET({ url }) {
    let hash = url.searchParams.get('geohash') as string;
    const response = {decode: geohash.decode(hash)};
    return json(response);
}