import { createSignal } from "solid-js";
import { loginUser } from "../services/auth";
import { auth } from "../firebase";

function LogIn() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");

  const login = async (e) => {
    e.preventDefault();
    setError("");

    if (!email() || !password()) {
      setError("Molimo unesite email i lozinku");
      return;
    }

    try {
      await loginUser(email(), password());

      alert(`Dobrodošao, ${auth.currentUser.displayName || "korisniče"}!`);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        setError("Korisnik ne postoji");
      } else if (err.code === "auth/wrong-password") {
        setError("Pogrešna lozinka");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <form class="flex flex-col gap-3" onSubmit={login}>
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

      {error() && <p class="text-red-500 text-sm">{error()}</p>}

      <button class="btn btn-primary mt-2" disabled={!email() || !password()}>
        Prijavi se
      </button>
    </form>
  );
}

export default LogIn;