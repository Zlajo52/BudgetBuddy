import { A, useNavigate } from "@solidjs/router";
import { createEffect } from "solid-js";
import { authStore } from "../stores/authStore";

export default function Landing() {
  const navigate = useNavigate();

  // Ako je korisnik već prijavljen, odmah idi na dashboard
  createEffect(() => {
    if (!authStore.loading && authStore.user) {
      navigate("/dashboard", { replace: true });
    }
  });

  return (
    <div class="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Navbar */}
      <nav class="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <span class="text-xl font-bold tracking-tight">💰 BudgetBuddy</span>
        <div class="flex gap-3">
          <A href="/login" class="btn btn-ghost btn-sm text-white/70 hover:text-white">
            Prijavi se
          </A>
          <A href="/signup" class="btn btn-sm bg-emerald-500 hover:bg-emerald-400 text-white border-none">
            Registriraj se
          </A>
        </div>
      </nav>

      {/* Hero */}
      <main class="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 gap-8">

        <div class="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-sm text-white/60">
          <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
          Besplatno za učenike i studente
        </div>

        <h1 class="text-5xl md:text-6xl font-bold tracking-tight max-w-3xl leading-tight">
          Preuzmi kontrolu nad{" "}
          <span class="text-emerald-400">vlastitim novcem</span>
        </h1>

        <p class="text-lg text-white/50 max-w-xl leading-relaxed">
          BudgetBuddy ti pomaže pratiti prihode i troškove, postaviti budžet
          i štediti prema cilju — sve na jednom mjestu.
        </p>

        <div class="flex flex-col sm:flex-row gap-3">
          <A href="/signup" class="btn bg-emerald-500 hover:bg-emerald-400 text-white border-none px-8">
            Počni besplatno
          </A>
          <A href="/login" class="btn btn-outline border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-8">
            Prijavi se
          </A>
        </div>

        {/* Feature kartice */}
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 w-full max-w-3xl">
          {[
            {
              icon: "📊",
              title: "Prati potrošnju",
              desc: "Unesi trošak za nekoliko sekundi i vidi gdje ti odlazi novac.",
            },
            {
              icon: "🎯",
              title: "Postavi cilj",
              desc: "Štediš za novi telefon ili putovanje? Prati napredak u stvarnom vremenu.",
            },
            {
              icon: "⚠️",
              title: "Budžet upozorenje",
              desc: "Odmah ćeš znati ako prekorачiš postavljeni mjesečni limit.",
            },
          ].map((f) => (
            <div class="bg-white/5 border border-white/10 rounded-2xl p-5 text-left hover:bg-white/8 transition-colors">
              <div class="text-2xl mb-3">{f.icon}</div>
              <h3 class="font-semibold mb-1">{f.title}</h3>
              <p class="text-sm text-white/50 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer class="text-center py-6 text-white/30 text-sm border-t border-white/10">
        BudgetBuddy · Školski projekt · {new Date().getFullYear()}
      </footer>
    </div>
  );
}