import { Show } from "solid-js";

export default function Message({ message, type = "success" }) {
  return (
    <Show when={message}>
      <div class={`alert ${type === "error" ? "alert-error" : "alert-success"} text-sm py-2`}>
        {message}
      </div>
    </Show>
  );
}
