import { createSignal, Show, For } from "solid-js";
import { authStore } from "../stores/authStore";
import { transactionService, CATEGORIES } from "../services/transactions";
import Message from "./Message";

export default function AddTransactionModal({ onClose, onSuccess }) {
  const [type, setType] = createSignal("expense");
  const [amount, setAmount] = createSignal("");
  const [description, setDescription] = createSignal("");
  const [category, setCategory] = createSignal("");
  const [error, setError] = createSignal(null);
  const [loading, setLoading] = createSignal(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!amount() || parseFloat(amount()) <= 0) {
      setError("Iznos mora biti veći od 0.");
      return;
    }
    if (!category()) {
      setError("Odaberi kategoriju.");
      return;
    }

    setLoading(true);
    try {
      await transactionService.add(authStore.user.uid, {
        type: type(),
        amount: parseFloat(amount()),
        description: description() || category(),
        category: category(),
      });
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="modal modal-open">
      <div class="modal-box">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={onClose}>✕</button>
        <h3 class="font-bold text-lg mb-4">Nova transakcija</h3>

        <Message message={error()} type="error" />

        <form class="flex flex-col gap-3 mt-3" onSubmit={handleSubmit}>
          <div class="join w-full">
            <button
              type="button"
              class={`btn join-item flex-1 ${type() === "expense" ? "btn-error" : "btn-outline"}`}
              onClick={() => { setType("expense"); setCategory(""); }}
            >
              − Trošak
            </button>
            <button
              type="button"
              class={`btn join-item flex-1 ${type() === "income" ? "btn-success" : "btn-outline"}`}
              onClick={() => { setType("income"); setCategory(""); }}
            >
              + Prihod
            </button>
          </div>

          <label class="floating-label">
            <input
              type="number"
              placeholder="Iznos (€)"
              class="input input-bordered w-full"
              min="0.01"
              step="0.01"
              value={amount()}
              onInput={(e) => setAmount(e.target.value)}
              required
            />
            <span>Iznos (€)</span>
          </label>

          <label class="floating-label">
            <input
              type="text"
              placeholder="Opis (opcionalno)"
              class="input input-bordered w-full"
              value={description()}
              onInput={(e) => setDescription(e.target.value)}
            />
            <span>Opis</span>
          </label>

          <select
            class="select select-bordered w-full"
            value={category()}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="" disabled>Odaberi kategoriju</option>
            <For each={CATEGORIES[type()]}>
              {(cat) => <option value={cat}>{cat}</option>}
            </For>
          </select>

          <button
            type="submit"
            class={`btn mt-1 ${type() === "expense" ? "btn-error" : "btn-success"}`}
            disabled={loading()}
          >
            <Show when={loading()} fallback="Spremi">
              <span class="loading loading-spinner loading-sm"></span>
            </Show>
          </button>
        </form>
      </div>
      <div class="modal-backdrop" onClick={onClose} />
    </div>
  );
}