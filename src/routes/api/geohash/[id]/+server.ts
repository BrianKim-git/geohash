import { db } from '$lib/firebase';
import { json } from '@sveltejs/kit';
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';

// encode get api
export async function GET({ params }) {
    try {
        const docSnap = await getDoc(doc(db, 'point', params.id));

        if (!docSnap.exists()) {
            return json({ error: `No Point Matching with Id:${params.id}` }, { status: 404 });
        } else {
            return json({ data: docSnap.data() }, { status: 404 });
        }
        
    } catch (error) {
        console.error(error);
        return json({ error: 'Failed to fetch document' }, { status: 500 });
    }
}

export async function PUT({ params, request }) {
    try {
        const body = await request.json();
        await updateDoc(doc(db, 'point', params.id), body);

        return json({ message: `point update success` });
    } catch (error) {
        console.error(error);
        return json({ error: 'Error updating point' }, { status: 500 });
    }
}

export async function DELETE({ params }) {
    try {
        await deleteDoc(doc(db, 'point', params.id));
        return json({ message: `point delete success` });
    } catch (error) {
        console.error(error);
        return json({ error: 'Error delete point' }, { status: 500 });
    }
}