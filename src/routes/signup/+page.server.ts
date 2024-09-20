import { auth } from '$lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
  
export const actions: Actions = {
	default: async ({url, request}) => {
		try {
			const currentPath = url.pathname;
			const data = await request.formData();
			const email = data.get('email') as string;
			const password = data.get('password') as string;

			await createUserWithEmailAndPassword(auth, email, password);
			console.log(`Redirecting from ${currentPath} to /login`);
			throw redirect(302, '/login');
		} catch (error) {
			console.log(error);
		}
	} 
}