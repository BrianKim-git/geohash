import { db } from '$lib/firebase_admin';
import { json } from '@sveltejs/kit';

// encode get api
export async function GET() {
    try {
        const pointRef = db.collection('point');
        const snapshot = await pointRef.get();

        let points: { id: string; }[] = [];
        snapshot.forEach(doc => {
            points.push({id: doc.id, ...doc.data()});
        })
        const response = {points: points};
        return json(response);
    } catch (error) {
        console.error(error);
        return json({ error: 'Failed to fetch document' }, { status: 500 });
    }
}