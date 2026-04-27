// src/pages/Stats.jsx
import { createSignal, createEffect, Show, For } from "solid-js";
import { authStore } from "../stores/authStore";
import { transactionService } from "../services/transactions";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";

export default function Stats() {
  const [transactions, setTransactions] = createSignal([]);
  const [loading, setLoading] = createSignal(true);

  const now = new Date();

  createEffect(async () => {
    if (!authStore.user) return;
    setLoading(true);
    const data = await transactionService.getByMonth(
      authStore.user.uid,
      now.getFullYear(),
      now.getMonth()
    );
    setTransactions(data);
    setLoading(false);
  });

  const fmt = (n) =>
    new Intl.NumberFormat("hr-HR", { style: "currency", currency: "EUR" }).format(n);

  const expenses = () => transactions().filter((t) => t.type === "expense");

  // Prosječni dnevni trošak
  const avgDaily = () => {
    if (expenses().length === 0) return 0;
    const today = now.getDate();
    const total = expenses().reduce((s, t) => s + t.amount, 0);
    return total / today;
  };

  // Ukupno troškova
  const totalExpense = () => expenses().reduce((s, t) => s + t.amount, 0);

  // Troškovi grupirani po danu
  const byDay = () => {
    const map = {};
    expenses().forEach((t) => {
      const d = t.createdAt?.toDate ? t.createdAt.toDate() : new Date(t.createdAt);
      const key = d.getDate();
      map[key] = (map[key] || 0) + t.amount;
    });
    return map;
  };

  // Najskuplji dan
  const mostExpensiveDay = () => {
    const map = byDay();
    if (Object.keys(map).length === 0) return null;
    const day = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
    return { day: day[0], amount: day[1] };
  };

  // Najskuplja kategorija
  const topCategory = () => {
    const map = {};
    expenses().forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    if (Object.keys(map).length === 0) return null;
    const top = Object.entries(map).sort((a, b) => b[1] - a[1])[0];
    return { name: top[0], amount: top[1] };
  };

  // Kategorije sortirane
  const categoriesSorted = () => {
    const map = {};
    expenses().forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  };

  // Broj transakcija
  const txCount = () => transactions().length;
  const expenseCount = () => expenses().length;
  const incomeCount = () => transactions().filter((t) => t.type === "income").length;

  // Heatmap — troškovi po danu u mjesecu
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

  const heatmapColor = (amount) => {
    if (!amount) return "bg-base-200";
    const max = Math.max(...Object.values(byDay()));
    const pct = amount / max;
    if (pct > 0.75) return "bg-error";
    if (pct > 0.5)  return "bg-warning";
    if (pct > 0.25) return "bg-primary/60";
    return "bg-primary/30";
  };

  const monthName = now.toLocaleString("hr-HR", { month: "long", year: "numeric" });

  return (
    <ProtectedRoute>
      <div class="min-h-screen bg-base-200">
        <Navbar />

        <div class="max-w-4xl mx-auto px-4 py-6 space-y-5">

          {/* Header */}
          <div>
            <h2 class="text-2xl font-bold">Statistike</h2>
            <p class="text-sm text-base-content/50 capitalize">{monthName}</p>
          </div>

          <Show
            when={!loading()}
            fallback={
              <div class="flex justify-center py-16">
                <span class="loading loading-spinner loading-lg"></span>
              </div>
            }
          >
            <Show
              when={expenses().length > 0}
              fallback={
                <div class="text-center py-16 bg-base-100 rounded-2xl">
                  <p class="text-4xl mb-3">📊</p>
                  <p class="text-base-content/40">Nema dovoljno podataka za statistike.</p>
                  <p class="text-sm text-base-content/30 mt-1">Dodaj nekoliko troškova pa se vrati ovdje.</p>
                </div>
              }
            >

              {/* Glavne stat kartice */}
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="bg-base-100 rounded-2xl shadow-sm p-4">
                  <p class="text-xs text-base-content/50 mb-1">Prosj. dnevni trošak</p>
                  <p class="text-xl font-bold text-primary">{fmt(avgDaily())}</p>
                  <p class="text-xs text-base-content/40 mt-1">po danu ovaj mjesec</p>
                </div>
                <div class="bg-base-100 rounded-2xl shadow-sm p-4">
                  <p class="text-xs text-base-content/50 mb-1">Najskuplji dan</p>
                  <Show when={mostExpensiveDay()} fallback={<p class="text-xl font-bold">—</p>}>
                    <p class="text-xl font-bold text-error">{fmt(mostExpensiveDay().amount)}</p>
                    <p class="text-xs text-base-content/40 mt-1">{mostExpensiveDay().day}. u mjesecu</p>
                  </Show>
                </div>
                <div class="bg-base-100 rounded-2xl shadow-sm p-4">
                  <p class="text-xs text-base-content/50 mb-1">Najskuplja kategorija</p>
                  <Show when={topCategory()} fallback={<p class="text-xl font-bold">—</p>}>
                    <p class="text-xl font-bold text-warning truncate">{topCategory().name}</p>
                    <p class="text-xs text-base-content/40 mt-1">{fmt(topCategory().amount)}</p>
                  </Show>
                </div>
                <div class="bg-base-100 rounded-2xl shadow-sm p-4">
                  <p class="text-xs text-base-content/50 mb-1">Transakcije</p>
                  <p class="text-xl font-bold">{txCount()}</p>
                  <p class="text-xs text-base-content/40 mt-1">
                    {incomeCount()} prihoda · {expenseCount()} troškova
                  </p>
                </div>
              </div>

              {/* Heatmap po danu */}
              <div class="bg-base-100 rounded-2xl shadow-sm p-5">
                <h3 class="font-semibold mb-4">Potrošnja po danu</h3>
                <div class="grid grid-cols-7 gap-1.5">
                  <For each={Array.from({ length: daysInMonth }, (_, i) => i + 1)}>
                    {(day) => {
                      const amount = byDay()[day];
                      return (
                        <div
                          class={`relative group aspect-square rounded-lg flex items-center justify-center text-xs font-medium cursor-default transition-all ${heatmapColor(amount)} ${day > now.getDate() ? "opacity-30" : ""}`}
                          title={amount ? `${day}. — ${fmt(amount)}` : `${day}.`}
                        >
                          {day}
                          {/* Tooltip na hover */}
                          <Show when={amount}>
                            <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-neutral text-neutral-content text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                              {fmt(amount)}
                            </div>
                          </Show>
                        </div>
                      );
                    }}
                  </For>
                </div>
                <div class="flex items-center gap-3 mt-4 text-xs text-base-content/50">
                  <span>Manje</span>
                  <div class="flex gap-1">
                    <div class="w-4 h-4 rounded bg-base-200"></div>
                    <div class="w-4 h-4 rounded bg-primary/30"></div>
                    <div class="w-4 h-4 rounded bg-primary/60"></div>
                    <div class="w-4 h-4 rounded bg-warning"></div>
                    <div class="w-4 h-4 rounded bg-error"></div>
                  </div>
                  <span>Više</span>
                </div>
              </div>

              {/* Breakdown po kategorijama */}
              <div class="bg-base-100 rounded-2xl shadow-sm p-5">
                <h3 class="font-semibold mb-4">Raspodjela troškova</h3>
                <div class="space-y-3">
                  <For each={categoriesSorted()}>
                    {([cat, amount]) => {
                      const pct = totalExpense() > 0 ? (amount / totalExpense()) * 100 : 0;
                      const count = expenses().filter((t) => t.category === cat).length;
                      return (
                        <div>
                          <div class="flex justify-between items-center mb-1">
                            <div class="flex items-center gap-2">
                              <span class="text-sm font-medium">{cat}</span>
                              <span class="text-xs text-base-content/40">{count} transakcija</span>
                            </div>
                            <div class="flex items-center gap-2">
                              <span class="text-xs text-base-content/50">{pct.toFixed(1)}%</span>
                              <span class="text-sm font-bold">{fmt(amount)}</span>
                            </div>
                          </div>
                          <div class="w-full bg-base-200 rounded-full h-2">
                            <div
                              class="bg-primary h-2 rounded-full transition-all duration-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    }}
                  </For>
                </div>
              </div>

            </Show>
          </Show>
        </div>
      </div>
    </ProtectedRoute>
  );
}