import { createSignal, createEffect, Show, For } from "solid-js";
import { collection, getDocs, orderBy, query, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { authStore } from "../stores/authStore";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import { useNavigate } from "@solidjs/router";

export default function Admin() {
  const navigate = useNavigate();
  const [users, setUsers] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [search, setSearch] = createSignal("");
  const [updating, setUpdating] = createSignal(null); // uid korisnika koji se ažurira

  const fetchUsers = async () => {
    const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    setUsers(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setLoading(false);
  };

  createEffect(async () => {
    // Čekaj da se profil učita
    if (authStore.loading) return;

    // Ako nije admin — vrati na dashboard
    if (!authStore.user) {
      navigate("/login");
      return;
    }
    if (authStore.profile && authStore.profile.role !== "admin") {
      navigate("/dashboard");
      return;
    }

    if (authStore.profile?.role === "admin") {
      await fetchUsers();
    }
  });

  // Promjena uloge korisnika
  const toggleRole = async (uid, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if (!confirm(`Promijeni ulogu korisnika u "${newRole}"?`)) return;

    setUpdating(uid);
    try {
      await updateDoc(doc(db, "users", uid), { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u.id === uid ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert("Greška: " + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const fmt = (n) =>
    n
      ? new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" }).format(n)
      : "—";

  const fmtDate = (ts) => {
    if (!ts?.toDate) return "—";
    return ts.toDate().toLocaleDateString("hr-HR");
  };

  // Filtrirani korisnici prema pretrazi
  const filtered = () => {
    const s = search().toLowerCase();
    if (!s) return users();
    return users().filter(
      (u) =>
        u.name?.toLowerCase().includes(s) ||
        u.email?.toLowerCase().includes(s)
    );
  };

  return (
    <ProtectedRoute>
      <div class="min-h-screen bg-base-200">
        <Navbar />

        <div class="max-w-5xl mx-auto px-4 py-6 space-y-5">

          {/* Header */}
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 class="text-2xl font-bold">Admin panel</h2>
              <p class="text-sm text-base-content/50">Pregled i upravljanje korisnicima</p>
            </div>
            <div class="badge badge-warning badge-lg gap-1">
              🔑 Administrator
            </div>
          </div>

          {/* Stat kartice */}
          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div class="bg-base-100 rounded-2xl shadow-sm p-4">
              <p class="text-xs text-base-content/50 mb-1">Ukupno korisnika</p>
              <p class="text-2xl font-bold">{users().length}</p>
            </div>
            <div class="bg-base-100 rounded-2xl shadow-sm p-4">
              <p class="text-xs text-base-content/50 mb-1">Admini</p>
              <p class="text-2xl font-bold text-warning">
                {users().filter((u) => u.role === "admin").length}
              </p>
            </div>
            <div class="bg-base-100 rounded-2xl shadow-sm p-4">
              <p class="text-xs text-base-content/50 mb-1">Obični korisnici</p>
              <p class="text-2xl font-bold text-primary">
                {users().filter((u) => u.role === "user").length}
              </p>
            </div>
          </div>

          {/* Pretraga */}
          <div class="relative">
            <input
              type="text"
              placeholder="Pretraži po imenu ili emailu..."
              class="input input-bordered w-full pl-10"
              value={search()}
              onInput={(e) => setSearch(e.target.value)}
            />
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40">
              🔍
            </span>
          </div>

          {/* Tablica */}
          <Show
            when={!loading()}
            fallback={
              <div class="flex justify-center py-16">
                <span class="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            <Show
              when={filtered().length > 0}
              fallback={
                <div class="text-center py-16 bg-base-100 rounded-2xl">
                  <p class="text-4xl mb-3">🔍</p>
                  <p class="text-base-content/40">Nema rezultata za "{search()}"</p>
                </div>
              }
            >
              <div class="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
                <div class="overflow-x-auto">
                  <table class="table table-sm">
                    <thead class="bg-base-200">
                      <tr>
                        <th>Korisnik</th>
                        <th>Email</th>
                        <th>Uloga</th>
                        <th>Budžet</th>
                        <th>Registracija</th>
                        <th>Akcija</th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={filtered()}>
                        {(u) => (
                          <tr class="hover">
                            <td>
                              <div class="flex items-center gap-2">
                                <div class="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                                  {u.name?.charAt(0).toUpperCase() || "?"}
                                </div>
                                <span class="font-medium text-sm">
                                  {u.name}
                                  {/* Označi trenutnog korisnika */}
                                  <Show when={u.id === authStore.user?.uid}>
                                    <span class="ml-1 text-xs text-base-content/40">(ti)</span>
                                  </Show>
                                </span>
                              </div>
                            </td>
                            <td class="text-sm text-base-content/70">{u.email}</td>
                            <td>
                              <span
                                class={`badge badge-sm ${
                                  u.role === "admin" ? "badge-warning" : "badge-ghost"
                                }`}
                              >
                                {u.role === "admin" ? "👑 admin" : "korisnik"}
                              </span>
                            </td>
                            <td class="text-sm">{fmt(u.monthlyBudget)}</td>
                            <td class="text-sm text-base-content/60">{fmtDate(u.createdAt)}</td>
                            <td>
                              {/* Ne možeš maknuti admin ulogu sebi */}
                              <Show when={u.id !== authStore.user?.uid}>
                                <button
                                  class={`btn btn-xs ${
                                    u.role === "admin" ? "btn-outline btn-error" : "btn-outline btn-warning"
                                  }`}
                                  disabled={updating() === u.id}
                                  onClick={() => toggleRole(u.id, u.role)}
                                >
                                  <Show when={updating() === u.id} fallback={
                                    u.role === "admin" ? "Ukloni admina" : "Postavi admina"
                                  }>
                                    <span class="loading loading-spinner loading-xs"></span>
                                  </Show>
                                </button>
                              </Show>
                            </td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>

                {/* Footer tablice */}
                <div class="px-4 py-3 border-t border-base-200 text-xs text-base-content/40 flex justify-between">
                  <span>Prikazano: {filtered().length} / {users().length} korisnika</span>
                  <span>Zadnje osvježeno: {new Date().toLocaleTimeString("hr-HR")}</span>
                </div>
              </div>
            </Show>
          </Show>
        </div>
      </div>
    </ProtectedRoute>
  );
}