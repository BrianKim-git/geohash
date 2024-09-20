import { signOut } from "firebase/auth";
import type { PageServerLoad } from "./$types";
import { auth } from "$lib/firebase";

export const load: PageServerLoad = (async ({ }) => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
  }
});
