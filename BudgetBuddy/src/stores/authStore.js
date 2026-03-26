import { createSignal } from "solid-js";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { authService } from "../services/auth";

const [user, setUser] = createSignal(null);
const [profile, setProfile] = createSignal(null);
const [loading, setLoading] = createSignal(true);

// Automatski prati promjene prijave/odjave
onAuthStateChanged(auth, async (firebaseUser) => {
  setUser(firebaseUser);
  if (firebaseUser) {
    const p = await authService.getUserProfile(firebaseUser.uid);
    setProfile(p);
  } else {
    setProfile(null);
  }
  setLoading(false);
});

export const authStore = {
  get user()    { return user(); },
  get profile() { return profile(); },
  get loading() { return loading(); },

  // Osvježi profil nakon ažuriranja
  async refreshProfile() {
    const u = user();
    if (u) {
      const p = await authService.getUserProfile(u.uid);
      setProfile(p);
    }
  },
};
