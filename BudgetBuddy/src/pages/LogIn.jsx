import { createSignal, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { authService } from "../services/auth";
import Message from "../components/Message";

export default function LogIn() {
  const navigate = useNavigate();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal(null);
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login(email(), password());
      navigate("/dashboard");
    } catch (err) {
      if (
        err.code === "auth/invalid-credential" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password"
      ) {
        setError("Pogrešan email ili lozinka.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Previše neuspješnih pokušaja. Pokušaj kasnije.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body gap-4">
          <div class="text-center">
            <h1 class="text-3xl font-bold">💰 BudgetBuddy</h1>
            <p class="text-base-content/60 mt-1">Prijavi se u svoj račun</p>
          </div>

          <Message message={error()} type="error" />

          <form class="flex flex-col gap-3" onSubmit={handleSubmit}>
            <label class="floating-label">
              <input
                type="email"
                placeholder="Email adresa"
                class="input input-bordered w-full"
                value={email()}
                onInput={(e) => setEmail(e.target.value)}
                required
              />
              <span>Email adresa</span>
            </label>

            <label class="floating-label">
              <input
                type="password"
                placeholder="Lozinka"
                class="input input-bordered w-full"
                value={password()}
                onInput={(e) => setPassword(e.target.value)}
                required
              />
              <span>Lozinka</span>
            </label>

            <div class="text-right -mt-1">
              <A href="/reset-password" class="link link-primary text-sm">
                Zaboravili ste lozinku?
              </A>
            </div>

            <button
              type="submit"
              class="btn btn-primary"
              disabled={loading() || !email() || !password()}
            >
              <Show when={loading()} fallback="Prijavi se">
                <span class="loading loading-spinner loading-sm"></span>
                Prijava...
              </Show>
            </button>
          </form>

          <p class="text-center text-sm text-base-content/60">
            Nemaš račun?{" "}
            <A href="/signup" class="link link-primary">Registriraj se</A>
          </p>
        </div>
      </div>
    </div>
  );
}
