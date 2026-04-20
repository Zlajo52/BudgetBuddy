import { A, useNavigate } from "@solidjs/router";
import { authService } from "../services/auth";
import { authStore } from "../stores/authStore";

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
        <A href="/dashboard" class="btn btn-ghost btn-sm">Pregled</A>
        <A href="/profile" class="btn btn-ghost btn-sm">Profil</A>
      </div>

      <div class="navbar-end gap-3">
        <span class="hidden md:block text-sm text-base-content/50">
          {authStore.user?.displayName}
        </span>
        <button class="btn btn-sm btn-outline btn-error" onClick={handleSignOut}>
          Odjava
        </button>
      </div>
    </div>
  );
}