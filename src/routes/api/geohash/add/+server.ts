import { db } from '$lib/firebase';
import { json } from '@sveltejs/kit';
import { addDoc, collection } from 'firebase/firestore';

export async function POST({ request }) {
    try {
        const body = await request.json();
        const pointRef = await addDoc(collection(db, 'point'), body);
        return json({ message: `point with the id: ${pointRef.id} adding success`, id: pointRef.id });
    } catch (error) {
        console.error(error);
        return json({ error: 'Error creating point' }, { status: 500 });
    }
}