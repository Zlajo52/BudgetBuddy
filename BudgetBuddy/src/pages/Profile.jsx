import { createSignal, createEffect, Show } from "solid-js";
import { A } from "@solidjs/router";
import { authStore } from "../stores/authStore";
import { authService } from "../services/auth";
import ProtectedRoute from "../components/ProtectedRoute";
import Message from "../components/Message";

export default function Profile() {
  const [name, setName] = createSignal("");
  const [monthlyBudget, setMonthlyBudget] = createSignal("");
  const [savingsGoal, setSavingsGoal] = createSignal("");
  const [savingsGoalAmount, setSavingsGoalAmount] = createSignal("");
  const [profileMsg, setProfileMsg] = createSignal(null);
  const [profileErr, setProfileErr] = createSignal(null);
  const [savingProfile, setSavingProfile] = createSignal(false);

  const [currentPassword, setCurrentPassword] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [confirmNewPassword, setConfirmNewPassword] = createSignal("");
  const [passMsg, setPassMsg] = createSignal(null);
  const [passErr, setPassErr] = createSignal(null);
  const [savingPass, setSavingPass] = createSignal(false);

  // Popuni formu kad se profil učita
  createEffect(() => {
    const p = authStore.profile;
    if (p) {
      setName(p.name || authStore.user?.displayName || "");
      setMonthlyBudget(p.monthlyBudget || "");
      setSavingsGoal(p.savingsGoal || "");
      setSavingsGoalAmount(p.savingsGoalAmount || "");
    }
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg(null);
    setProfileErr(null);
    setSavingProfile(true);

    try {
      await authService.updateProfile(authStore.user.uid, {
        name: name(),
        monthlyBudget: parseFloat(monthlyBudget()) || 0,
        savingsGoal: savingsGoal() || null,
        savingsGoalAmount: parseFloat(savingsGoalAmount()) || 0,
      });
      await authStore.refreshProfile();
      setProfileMsg("Profil je uspješno ažuriran!");
    } catch (err) {
      setProfileErr(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg(null);
    setPassErr(null);

    if (newPassword() !== confirmNewPassword()) {
      setPassErr("Nove lozinke se ne podudaraju.");
      return;
    }
    if (newPassword().length < 6) {
      setPassErr("Nova lozinka mora imati najmanje 6 znakova.");
      return;
    }

    setSavingPass(true);
    try {
      await authService.changePassword(currentPassword(), newPassword());
      setPassMsg("Lozinka je uspješno promijenjena!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setPassErr("Trenutna lozinka nije ispravna.");
      } else {
        setPassErr(err.message);
      }
    } finally {
      setSavingPass(false);
    }
  };

  return (
    <ProtectedRoute>
      <div class="min-h-screen bg-base-200">
        {/* Jednostavan navbar za Fazu 2 */}
        <div class="navbar bg-base-100 border-b border-base-200 px-4">
          <div class="navbar-start">
            <A href="/dashboard" class="text-xl font-bold">💰 BudgetBuddy</A>
          </div>
          <div class="navbar-end">
            <A href="/signout" class="btn btn-sm btn-outline btn-error">Odjava</A>
          </div>
        </div>

        <div class="max-w-2xl mx-auto px-4 py-6 space-y-6">
          <h2 class="text-2xl font-bold">Moj profil</h2>

          {/* Osobni podaci i budžet */}
          <div class="card bg-base-100 shadow-sm rounded-2xl">
            <div class="card-body gap-4">
              <h3 class="font-semibold text-lg">Osobni podaci i budžet</h3>

              <Message message={profileMsg()} type="success" />
              <Message message={profileErr()} type="error" />

              <form class="flex flex-col gap-3" onSubmit={handleProfileSubmit}>
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
                    class="input input-bordered w-full"
                    value={authStore.user?.email || ""}
                    disabled
                  />
                  <span>Email adresa</span>
                </label>

                <div class="divider text-xs text-base-content/40 my-1">Budžet</div>

                <label class="floating-label">
                  <input
                    type="number"
                    placeholder="Mjesečni budžet (€)"
                    class="input input-bordered w-full"
                    min="0"
                    step="1"
                    value={monthlyBudget()}
                    onInput={(e) => setMonthlyBudget(e.target.value)}
                  />
                  <span>Mjesečni budžet (€)</span>
                </label>

                <div class="divider text-xs text-base-content/40 my-1">Cilj štednje</div>

                <label class="floating-label">
                  <input
                    type="text"
                    placeholder="Naziv cilja (npr. Novi telefon)"
                    class="input input-bordered w-full"
                    value={savingsGoal()}
                    onInput={(e) => setSavingsGoal(e.target.value)}
                  />
                  <span>Naziv cilja</span>
                </label>

                <label class="floating-label">
                  <input
                    type="number"
                    placeholder="Iznos cilja (€)"
                    class="input input-bordered w-full"
                    min="0"
                    step="1"
                    value={savingsGoalAmount()}
                    onInput={(e) => setSavingsGoalAmount(e.target.value)}
                  />
                  <span>Iznos cilja (€)</span>
                </label>

                <button type="submit" class="btn btn-primary mt-2" disabled={savingProfile()}>
                  <Show when={savingProfile()} fallback="Spremi promjene">
                    <span class="loading loading-spinner loading-sm"></span>
                    Spremanje...
                  </Show>
                </button>
              </form>
            </div>
          </div>

          {/* Promjena lozinke */}
          <div class="card bg-base-100 shadow-sm rounded-2xl">
            <div class="card-body gap-4">
              <h3 class="font-semibold text-lg">Promjena lozinke</h3>

              <Message message={passMsg()} type="success" />
              <Message message={passErr()} type="error" />

              <form class="flex flex-col gap-3" onSubmit={handlePasswordSubmit}>
                <label class="floating-label">
                  <input
                    type="password"
                    placeholder="Trenutna lozinka"
                    class="input input-bordered w-full"
                    value={currentPassword()}
                    onInput={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                  <span>Trenutna lozinka</span>
                </label>

                <label class="floating-label">
                  <input
                    type="password"
                    placeholder="Nova lozinka"
                    class="input input-bordered w-full"
                    value={newPassword()}
                    onInput={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <span>Nova lozinka (min. 6 znakova)</span>
                </label>

                <label class="floating-label">
                  <input
                    type="password"
                    placeholder="Ponovi novu lozinku"
                    class="input input-bordered w-full"
                    value={confirmNewPassword()}
                    onInput={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                  <span>Ponovi novu lozinku</span>
                </label>

                <button type="submit" class="btn btn-warning mt-2" disabled={savingPass()}>
                  <Show when={savingPass()} fallback="Promijeni lozinku">
                    <span class="loading loading-spinner loading-sm"></span>
                    Mijenjanje...
                  </Show>
                </button>
              </form>
            </div>
          </div>

          {/* Info */}
          <div class="card bg-base-100 shadow-sm rounded-2xl">
            <div class="card-body">
              <h3 class="font-semibold text-lg">Informacije o računu</h3>
              <div class="space-y-2 text-sm text-base-content/70">
                <div class="flex justify-between">
                  <span>Email</span>
                  <span class="font-medium text-base-content">{authStore.user?.email}</span>
                </div>
                <div class="flex justify-between">
                  <span>Uloga</span>
                  <span class="badge badge-sm">
                    {authStore.profile?.role === "admin" ? "Administrator" : "Korisnik"}
                  </span>
                </div>
                <div class="flex justify-between">
                  <span>Registracija</span>
                  <span class="font-medium text-base-content">
                    {authStore.profile?.createdAt?.toDate
                      ? authStore.profile.createdAt.toDate().toLocaleDateString("hr-HR")
                      : "—"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
