// src/pages/Transactions.jsx
import { createSignal, createEffect, Show, For } from "solid-js";
import { authStore } from "../stores/authStore";
import { transactionService, CATEGORIES } from "../services/transactions";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Transactions() {
  const [transactions, setTransactions] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [showModal, setShowModal] = createSignal(false);
  const [typeFilter, setTypeFilter] = createSignal("all");
  const [categoryFilter, setCategoryFilter] = createSignal("all");

  const now = new Date();
  const [year] = createSignal(now.getFullYear());
  const [month] = createSignal(now.getMonth());

  const fetchTransactions = async () => {
    const uid = authStore.user?.uid;
    if (!uid) return;
    setLoading(true);
    const data = await transactionService.getByMonth(uid, year(), month());
    setTransactions(data);
    setLoading(false);
  };

  createEffect(() => {
    if (authStore.user) fetchTransactions();
  });

  const handleTypeFilter = (type) => {
    setTypeFilter(type);
    setCategoryFilter("all");
  };

  // Kategorije koje se stvarno pojavljuju u transakcijama
  const availableCategories = () => {
    const type = typeFilter();
    let pool = transactions();
    if (type !== "all") pool = pool.filter((t) => t.type === type);
    const found = new Set(pool.map((t) => t.category));
    const all = [...CATEGORIES.income, ...CATEGORIES.expense];
    return all.filter((c) => found.has(c));
  };

  const filtered = () => {
    let result = transactions();
    if (typeFilter() !== "all") result = result.filter((t) => t.type === typeFilter());
    if (categoryFilter() !== "all") result = result.filter((t) => t.category === categoryFilter());
    return result;
  };

  const totalIncome = () =>
    transactions().filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  const totalExpense = () =>
    transactions().filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const fmt = (n) =>
    new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" }).format(n);

  const fmtDate = (ts) => {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("hr-HR", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Obriši ovu transakciju?")) return;
    await transactionService.delete(authStore.user.uid, id);
    fetchTransactions();
  };

  const isFiltered = () => typeFilter() !== "all" || categoryFilter() !== "all";
  const monthName = now.toLocaleString("hr-HR", { month: "long", year: "numeric" });

  return (
    <ProtectedRoute>
      <div class="min-h-screen bg-base-200">
        <Navbar />

        <div class="max-w-3xl mx-auto px-4 py-6 space-y-4">

          <div class="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 class="text-2xl font-bold">Transakcije</h2>
              <p class="text-sm text-base-content/50 capitalize">{monthName}</p>
            </div>
            <button class="btn btn-primary btn-sm" onClick={() => setShowModal(true)}>+ Dodaj</button>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="bg-base-100 rounded-2xl shadow-sm p-4">
              <p class="text-xs text-base-content/50 mb-1">Ukupni prihodi</p>
              <p class="text-lg font-bold text-success">{fmt(totalIncome())}</p>
            </div>
            <div class="bg-base-100 rounded-2xl shadow-sm p-4">
              <p class="text-xs text-base-content/50 mb-1">Ukupni troškovi</p>
              <p class="text-lg font-bold text-error">{fmt(totalExpense())}</p>
            </div>
          </div>

          {/* Filter po tipu */}
          <div class="flex flex-wrap items-center gap-2">
            <div class="join">
              <button class={`btn btn-sm join-item ${typeFilter() === "all" ? "btn-neutral" : "btn-ghost"}`} onClick={() => handleTypeFilter("all")}>
                Sve ({transactions().length})
              </button>
              <button class={`btn btn-sm join-item ${typeFilter() === "income" ? "btn-success" : "btn-ghost"}`} onClick={() => handleTypeFilter("income")}>
                Prihodi ({transactions().filter((t) => t.type === "income").length})
              </button>
              <button class={`btn btn-sm join-item ${typeFilter() === "expense" ? "btn-error" : "btn-ghost"}`} onClick={() => handleTypeFilter("expense")}>
                Troškovi ({transactions().filter((t) => t.type === "expense").length})
              </button>
            </div>
            <Show when={isFiltered()}>
              <button class="btn btn-ghost btn-sm text-base-content/40" onClick={() => { setTypeFilter("all"); setCategoryFilter("all"); }}>
                ✕ Ukloni filtere
              </button>
            </Show>
          </div>

          {/* Filter po kategoriji */}
          <Show when={availableCategories().length > 0}>
            <div class="flex flex-wrap gap-2">
              <button class={`btn btn-xs rounded-full ${categoryFilter() === "all" ? "btn-neutral" : "btn-outline"}`} onClick={() => setCategoryFilter("all")}>
                Sve kategorije
              </button>
              <For each={availableCategories()}>
                {(cat) => {
                  const count = transactions().filter(
                    (t) => t.category === cat && (typeFilter() === "all" || t.type === typeFilter())
                  ).length;
                  if (count === 0) return null;
                  return (
                    <button
                      class={`btn btn-xs rounded-full ${categoryFilter() === cat ? "btn-primary" : "btn-outline"}`}
                      onClick={() => setCategoryFilter(cat)}
                    >
                      {cat} ({count})
                    </button>
                  );
                }}
              </For>
            </div>
          </Show>

          {/* Lista */}
          <Show when={!loading()} fallback={<div class="flex justify-center py-16"><span class="loading loading-spinner loading-lg"></span></div>}>
            <Show
              when={filtered().length > 0}
              fallback={
                <div class="text-center py-16 bg-base-100 rounded-2xl">
                  <p class="text-4xl mb-3">📭</p>
                  <p class="text-base-content/40">{isFiltered() ? "Nema transakcija za odabrani filter." : "Nema transakcija."}</p>
                  <Show when={isFiltered()}>
                    <button class="btn btn-ghost btn-sm mt-4" onClick={() => { setTypeFilter("all"); setCategoryFilter("all"); }}>Ukloni filtere</button>
                  </Show>
                  <Show when={!isFiltered()}>
                    <button class="btn btn-primary btn-sm mt-4" onClick={() => setShowModal(true)}>Dodaj prvu transakciju</button>
                  </Show>
                </div>
              }
            >
              <div class="bg-base-100 rounded-2xl shadow-sm overflow-hidden">
                <For each={filtered()}>
                  {(t) => (
                    <div class="flex items-center gap-3 px-5 py-3 border-b border-base-200 last:border-0 hover:bg-base-50 transition-colors">
                      <div class={`w-9 h-9 rounded-full flex items-center justify-center font-bold shrink-0 ${t.type === "income" ? "bg-success/15 text-success" : "bg-error/15 text-error"}`}>
                        {t.type === "income" ? "+" : "−"}
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium truncate">{t.description}</p>
                        <p class="text-xs text-base-content/50">{t.category} · {fmtDate(t.createdAt)}</p>
                      </div>
                      <span class={`font-bold text-sm shrink-0 ${t.type === "income" ? "text-success" : "text-error"}`}>
                        {t.type === "income" ? "+" : "−"}{fmt(t.amount)}
                      </span>
                      <button class="btn btn-ghost btn-xs text-error opacity-30 hover:opacity-100 transition-opacity" onClick={() => handleDelete(t.id)}>✕</button>
                    </div>
                  )}
                </For>
              </div>

              <Show when={isFiltered()}>
                <div class="bg-base-100 rounded-2xl shadow-sm p-4 flex justify-between items-center">
                  <span class="text-sm text-base-content/60 flex items-center gap-2">
                    Ukupno ({filtered().length} stavki)
                    <Show when={categoryFilter() !== "all"}>
                      <span class="badge badge-sm badge-primary">{categoryFilter()}</span>
                    </Show>
                  </span>
                  <span class="font-bold">{fmt(filtered().reduce((s, t) => s + t.amount, 0))}</span>
                </div>
              </Show>
            </Show>
          </Show>

        </div>
      </div>

      <Show when={showModal()}>
        <AddTransactionModal onClose={() => setShowModal(false)} onSuccess={() => { setShowModal(false); fetchTransactions(); }} />
      </Show>
    </ProtectedRoute>
  );
}