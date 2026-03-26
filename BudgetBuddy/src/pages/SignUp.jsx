import { createSignal, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { authService } from "../services/auth";
import Message from "../components/Message";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [error, setError] = createSignal(null);
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password() !== confirmPassword()) {
      setError("Lozinke se ne podudaraju!");
      return;
    }
    if (password().length < 6) {
      setError("Lozinka mora imati najmanje 6 znakova.");
      return;
    }

    setLoading(true);
    try {
      await authService.register(name(), email(), password());
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Račun s tom email adresom već postoji.");
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
            <p class="text-base-content/60 mt-1">Kreiraj novi račun</p>
          </div>

          <Message message={error()} type="error" />

          <form class="flex flex-col gap-3" onSubmit={handleSubmit}>
            <label class="floating-label">
              <input
                type="text"
                placeholder="Ime i prezime"
                class="input input-bordered w-full"
                value={name()}
                onInput={(e) => setName(e.target.value)}
                required
              />
              <span>Ime i prezime</span>
            </label>

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
              <span>Lozinka (min. 6 znakova)</span>
            </label>

            <label class="floating-label">
              <input
                type="password"
                placeholder="Ponovi lozinku"
                class="input input-bordered w-full"
                value={confirmPassword()}
                onInput={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <span>Ponovi lozinku</span>
            </label>

            <button
              type="submit"
              class="btn btn-primary mt-2"
              disabled={loading() || !name() || !email() || !password() || !confirmPassword()}
            >
              <Show when={loading()} fallback="Registriraj se">
                <span class="loading loading-spinner loading-sm"></span>
                Registracija...
              </Show>
            </button>
          </form>

          <p class="text-center text-sm text-base-content/60">
            Već imaš račun?{" "}
            <A href="/login" class="link link-primary">Prijavi se</A>
          </p>
        </div>
      </div>
    </div>
  );
}
