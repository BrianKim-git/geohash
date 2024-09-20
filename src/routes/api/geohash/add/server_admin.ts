import { db } from '$lib/firebase_admin';
import { json } from '@sveltejs/kit';

export async function POST({ request }) {
    try {
        const body = await request.json();
        const pointRef = await db.collection('point').add(body);
        return json({ message: `point with the id: ${pointRef.id} adding success`, id: pointRef.id });
    } catch (error) {
        console.error(error);
        return json({ error: 'Error creating point' }, { status: 500 });
    }
}