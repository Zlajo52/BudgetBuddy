import ProtectedRoute from "../components/ProtectedRoute";
import { authStore } from "../stores/authStore";
import { A } from "@solidjs/router";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div class="min-h-screen flex flex-col items-center justify-center gap-4 bg-base-200">
        <div class="card bg-base-100 shadow-xl p-8 text-center">
          <h1 class="text-2xl font-bold mb-2">💰 BudgetBuddy</h1>
          <p class="text-base-content/60">
            Dobrodošao, <strong>{authStore.user?.displayName}</strong>!
          </p>
          <p class="text-sm text-base-content/40 mt-2 mb-6">
            
          </p>
          <div class="flex flex-col gap-2">
            <A href="/profile" class="btn btn-primary btn-sm">Moj profil</A>
            <A href="/signout" class="btn btn-outline btn-error btn-sm">Odjava</A>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
