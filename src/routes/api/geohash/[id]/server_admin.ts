import { db } from '$lib/firebase_admin';
import { json } from '@sveltejs/kit';

// encode get api
export async function GET({ params }) {
    try {
        const pointRef = db.collection('point');
        const doc = await pointRef.doc(params.id).get();

        if (!doc.exists) {
            return json({ error: `No Point Matching with Id:${params.id}` }, { status: 404 });
        } else {
            return json({ data: doc.data() }, { status: 404 });
        }
        
    } catch (error) {
        console.error(error);
        return json({ error: 'Failed to fetch document' }, { status: 500 });
    }
}

export async function PUT({ params, request }) {
    try {
        const body = await request.json();
        await db.collection('point').doc(params.id).update(body);
        return json({ message: `point update success` });
    } catch (error) {
        console.error(error);
        return json({ error: 'Error updating point' }, { status: 500 });
    }
}

export async function DELETE({ params }) {
    try {
        const pointRef = await db.collection('point').doc(params.id).delete();
        return json({ message: `point delete success` });
    } catch (error) {
        console.error(error);
        return json({ error: 'Error delete point' }, { status: 500 });
    }
}