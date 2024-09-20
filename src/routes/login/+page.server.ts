import { auth } from '$lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import type { Actions, PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = (async (event) => {
    const currentPath = event.url.pathname;
	let user = auth.currentUser ? { email: auth.currentUser.email } : null;
	
	if (user) {
		console.log(`Redirecting from ${currentPath} to /`);
		throw redirect(302, '/'); 
	}
}); 
  
export const actions: Actions = {
	default: async ({request}) => {
		try {
			const data = await request.formData();
			const email = data.get('email') as string;
			const password = data.get('password') as string;

			await signInWithEmailAndPassword(auth, email, password);
		} catch (error) {
		}
	} 
}