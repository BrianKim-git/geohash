import { db } from '$lib/firebase';
import { json } from '@sveltejs/kit';
import { collection, getDocs } from 'firebase/firestore';

// encode get api
export async function GET() {
    try {
        const pointRef = collection(db, 'point');
        const snapshot = await getDocs(pointRef);

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