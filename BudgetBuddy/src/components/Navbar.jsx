// src/components/Navbar.jsx
import { A, useNavigate } from "@solidjs/router";
import { Show } from "solid-js";
import { authService } from "../services/auth";
import { authStore } from "../stores/authStore";
import { themeStore } from "../stores/themeStore";

export default function Navbar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await authService.signOut();
    navigate("/login");
  };

  return (
    <div class="navbar bg-base-100 border-b border-base-200 px-4">
      <div class="navbar-start">
        <A href="/dashboard" class="text-xl font-bold tracking-tight">
          💰 BudgetBuddy
        </A>
      </div>

      <div class="navbar-center hidden md:flex gap-2">
        <A href="/dashboard"    class="btn btn-ghost btn-sm">Pregled</A>
        <A href="/transactions" class="btn btn-ghost btn-sm">Transakcije</A>
        <A href="/stats"        class="btn btn-ghost btn-sm">Statistike</A>
        <A href="/profile"      class="btn btn-ghost btn-sm">Profil</A>
        <Show when={authStore.profile?.role === "admin"}>
          <A href="/admin" class="btn btn-ghost btn-sm text-warning">👑 Admin</A>
        </Show>
      </div>

      <div class="navbar-end gap-2">
        <span class="hidden md:block text-sm text-base-content/50 mr-1">
          {authStore.user?.displayName}
        </span>
        <button
          class="btn btn-ghost btn-sm btn-square"
          onClick={() => themeStore.toggle()}
          title={themeStore.isDark ? "Svjetla tema" : "Tamna tema"}
        >
          <Show when={themeStore.isDark} fallback="🌙">☀️</Show>
        </button>
        <button class="btn btn-sm btn-outline btn-error" onClick={handleSignOut}>
          Odjava
        </button>
      </div>
    </div>
  );
}