import { createSignal, Show } from "solid-js";
import { A } from "@solidjs/router";
import { authService } from "../services/auth";
import Message from "../components/Message";

export default function ResetPassword() {
  const [error, setError] = createSignal(null);
  const [success, setSuccess] = createSignal(null);
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const data = new FormData(e.target);
    const email = data.get("email");

    try {
      await authService.passwordReset(email);
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body gap-4">
          <h1 class="text-2xl font-bold text-center">Zaboravljena zaporka</h1>

          <Message message={error()} type="error" />

          <Show when={!success()}>
            <form class="flex flex-col gap-3" onSubmit={handleSubmit}>
              <label class="floating-label">
                <input
                  class="input input-bordered w-full"
                  type="email"
                  name="email"
                  placeholder="E-mail adresa"
                  required
                />
                <span>E-mail adresa</span>
              </label>

              <button type="submit" class="btn btn-primary" disabled={loading()}>
                <Show when={loading()} fallback="Potvrdi">
                  <span class="loading loading-spinner loading-sm"></span>
                  Slanje...
                </Show>
              </button>
            </form>
          </Show>

          <Show when={success()}>
            <Message message="Na e-mail adresu ste primili upute za ponovno postavljanje zaporke." />
          </Show>

          <p class="text-center text-sm text-base-content/60">
            <A href="/login" class="link link-primary">← Natrag na prijavu</A>
          </p>
        </div>
      </div>
    </div>
  );
}
