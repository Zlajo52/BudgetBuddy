import { createSignal } from "solid-js";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

async function Register() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");

  const register = async (e) => {
    e.preventDefault();

    if (password() !== confirmPassword() && <p class="text-red-500 text-sm">Lozinke se ne podudaraju!</p>) {
      alert("Lozinke se ne podudaraju!");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email(), password());
      // postavi displayName
      await updateProfile(userCredential.user, { displayName: name() });
      alert("Korisnik uspješno registriran!");
    } catch (error) {
      alert(error.message);
    }
  };

  const userCredential = await createUserWithEmailAndPassword(auth, email(), password());
  const user = userCredential.user;
  await updateProfile(user, { displayName: name() });

  await setDoc(doc(db, "users", user.uid), {
    name: name(),
    email: email(),
    role: "user",
    createdAt: new Date()
  });

  return (
    <form class="flex flex-col gap-3" onSubmit={register}>
      <input
        type="text"
        placeholder="Ime"
        class="input input-bordered"
        onInput={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        class="input input-bordered"
        onInput={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Lozinka"
        class="input input-bordered"
        onInput={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Potvrdi lozinku"
        class="input input-bordered"
        onInput={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button class="btn btn-primary mt-2">Registriraj se</button>
    </form>
  );
}

export default Register;