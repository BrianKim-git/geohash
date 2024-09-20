import { auth } from '$lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = (async (event) => {
    let user = auth.currentUser ? { email: auth.currentUser.email } : null;
    
    if(user) {
        onAuthStateChanged(auth, (authUser) => {
            user = authUser;
        });
    }

    return {
        user
    };
});