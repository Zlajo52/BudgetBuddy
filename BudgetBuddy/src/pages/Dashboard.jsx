import { createSignal, createEffect, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import { authStore } from "../stores/authStore";
import { transactionService } from "../services/transactions";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import AddTransactionModal from "../components/AddTransactionModal";
import ExpenseChart from "../components/ExpenseChart";

if (!document.getElementById("chartjs-script")) {
  const script = document.createElement("script");
  script.id = "chartjs-script";
  script.src = "https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js";
  document.head.appendChild(script);
}

export default function Dashboard() {
  const [transactions, setTransactions] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [showModal, setShowModal] = createSignal(false);

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

  
  const totalIncome = () =>
    transactions().filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);

  const totalExpense = () =>
    transactions().filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

  const balance = () => totalIncome() - totalExpense();

  const budget = () => authStore.profile?.monthlyBudget || 0;

  const budgetUsed = () =>
    budget() > 0 ? Math.min((totalExpense() / budget()) * 100, 100) : 0;

  const budgetOverrun = () => budget() > 0 && totalExpense() > budget();

  // Potrošnja po kategorijama — sortirano po iznosu
  const expenseByCategory = () => {
    const map = {};
    transactions()
      .filter((t) => t.type === "expense")
      .forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount; });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  };

  // Cilj štednje
  const savingsGoalName = () => authStore.profile?.savingsGoal || null;
  const savingsGoalAmount = () => authStore.profile?.savingsGoalAmount || 0;
  const savingsProgress = () =>
    savingsGoalAmount() > 0
      ? Math.min((Math.max(balance(), 0) / savingsGoalAmount()) * 100, 100)
      : 0;

  const fmt = (n) =>
    new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" }).format(n);

  const fmtDate = (ts) => {
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("hr-HR", { day: "2-digit", month: "2-digit" });
  };

  const monthName = () =>
    now.toLocaleString("hr-HR", { month: "long", year: "numeric" });

  const handleDelete = async (id) => {
    if (!confirm("Obriši ovu transakciju?")) return;
    await transactionService.delete(authStore.user.uid, id);
    fetchTransactions();
  };

  return (
    <ProtectedRoute>
      <div class="min-h-screen bg-base-200">
        <Navbar />

        <div class="max-w-5xl mx-auto px-4 py-6 space-y-5">

          {/* Header */}
          <div class="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h2 class="text-2xl font-bold capitalize">{monthName()}</h2>
              <p class="text-base-content/60 text-sm">
                Dobrodošao, {authStore.user?.displayName}!
              </p>
            </div>
            <button class="btn btn-primary" onClick={() => setShowModal(true)}>
              + Dodaj transakciju
            </button>
          </div>

          {/* Stat kartice */}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div class="bg-base-100 rounded-2xl shadow-sm p-4">
              <p class="text-xs text-base-content/50 mb-1">Prihodi</p>
              <p class="text-xl font-bold text-success">{fmt(totalIncome())}</p>
            </div>
            <div class="bg-base-100 rounded-2xl shadow-sm p-4">
              <p class="text-xs text-base-content/50 mb-1">Troškovi</p>
              <p class="text-xl font-bold text-error">{fmt(totalExpense())}</p>
            </div>
            <div class="bg-base-100 rounded-2xl shadow-sm p-4">
              <p class="text-xs text-base-content/50 mb-1">Ostatak</p>
              <p class={`text-xl font-bold ${balance() >= 0 ? "text-primary" : "text-error"}`}>
                {fmt(balance())}
              </p>
            </div>
            <div class="bg-base-100 rounded-2xl shadow-sm p-4">
              <p class="text-xs text-base-content/50 mb-1">Budžet</p>
              <p class="text-xl font-bold">{budget() > 0 ? fmt(budget()) : "—"}</p>
              <Show when={budget() === 0}>
                <A href="/profile" class="text-xs link link-primary">Postavi →</A>
              </Show>
            </div>
          </div>

          {/* Progress bar budžeta */}
          <Show when={budget() > 0}>
            <div class="bg-base-100 rounded-2xl shadow-sm p-5">
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold text-sm">Iskorištenost budžeta</span>
                <span class={`text-sm font-bold ${budgetOverrun() ? "text-error" : ""}`}>
                  {fmt(totalExpense())} / {fmt(budget())}
                </span>
              </div>
              <progress
                class={`progress w-full h-3 ${budgetOverrun() ? "progress-error" : "progress-primary"}`}
                value={budgetUsed()}
                max="100"
              />
              <Show when={budgetOverrun()}>
                <p class="text-error text-xs mt-2 font-medium">
                  ⚠️ Premašio si budžet za {fmt(totalExpense() - budget())}!
                </p>
              </Show>
            </div>
          </Show>

          {/* Cilj štednje */}
          <Show when={savingsGoalName()}>
            <div class="bg-base-100 rounded-2xl shadow-sm p-5">
              <div class="flex justify-between items-center mb-2">
                <span class="font-semibold text-sm">🎯 {savingsGoalName()}</span>
                <span class="text-sm text-base-content/60">
                  {fmt(Math.max(balance(), 0))} / {fmt(savingsGoalAmount())}
                </span>
              </div>
              <progress
                class="progress progress-success w-full h-3"
                value={savingsProgress()}
                max="100"
              />
              <p class="text-xs text-base-content/50 mt-2">
                {savingsProgress().toFixed(0)}% prema cilju
              </p>
            </div>
          </Show>

          {/* Graf i transakcije */}
          <div class="grid md:grid-cols-2 gap-4">

            {/* Graf potrošnje po kategorijama */}
            <div class="bg-base-100 rounded-2xl shadow-sm p-5">
              <h3 class="font-semibold mb-4">Graf potrošnje po kategorijama</h3>
              <Show
                when={expenseByCategory().length > 0}
                fallback={
                  <div class="flex items-center justify-center h-48 text-base-content/30 text-sm">
                    Nema troškova ovaj mjesec.
                  </div>
                }
              >
                <ExpenseChart data={expenseByCategory} />
              </Show>
            </div>

            {/* Zadnje transakcije */}
            <div class="bg-base-100 rounded-2xl shadow-sm p-5">
              <h3 class="font-semibold mb-4">Zadnje transakcije</h3>
              <Show
                when={!loading()}
                fallback={
                  <div class="flex justify-center py-10">
                    <span class="loading loading-spinner"></span>
                  </div>
                }
              >
                <Show
                  when={transactions().length > 0}
                  fallback={
                    <p class="text-base-content/40 text-sm py-4">
                      Nema transakcija. Dodaj prvu!
                    </p>
                  }
                >
                  <div class="space-y-1 max-h-64 overflow-y-auto pr-1">
                    <For each={transactions().slice(0, 10)}>
                      {(t) => (
                        <div class="flex items-center gap-2 py-2 border-b border-base-200 last:border-0">
                          <div class={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${t.type === "income" ? "bg-success/15 text-success" : "bg-error/15 text-error"}`}>
                            {t.type === "income" ? "+" : "−"}
                          </div>
                          <div class="flex-1 min-w-0">
                            <p class="text-sm font-medium truncate">{t.description}</p>
                            <p class="text-xs text-base-content/40">
                              {t.category} · {fmtDate(t.createdAt)}
                            </p>
                          </div>
                          <span class={`text-sm font-bold shrink-0 ${t.type === "income" ? "text-success" : "text-error"}`}>
                            {fmt(t.amount)}
                          </span>
                          <button
                            class="btn btn-ghost btn-xs text-error opacity-40 hover:opacity-100"
                            onClick={() => handleDelete(t.id)}
                          >
                            ✕
                          </button>
                        </div>
                      )}
                    </For>
                  </div>
                </Show>
              </Show>
            </div>

          </div>
        </div>
      </div>

      <Show when={showModal()}>
        <AddTransactionModal
          onClose={() => setShowModal(false)}
          onSuccess={() => { setShowModal(false); fetchTransactions(); }}
        />
      </Show>
    </ProtectedRoute>
  );
}