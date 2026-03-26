// blokira pristup stranici ako korisnik nije prijavljen
import { Show, createEffect } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { authStore } from "../stores/authStore";

export default function ProtectedRoute(props) {
  const navigate = useNavigate();

  createEffect(() => {
    if (!authStore.loading && !authStore.user) {
      navigate("/login", { replace: true });
    }
  });

  return (
    <Show
      when={authStore.user}
      fallback={
        <div class="flex h-screen items-center justify-center bg-base-200">
          <span class="loading loading-spinner loading-lg"></span>
        </div>
      }
    >
      {props.children}
    </Show>
  );
}
