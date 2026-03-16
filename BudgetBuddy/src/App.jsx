import { createSignal, onCleanup } from "solid-js";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

import LogIn from "./components/LogIn";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";

function App() {

  const [user, setUser] = createSignal(null);
  const [page, setPage] = createSignal("login");

  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  onCleanup(() => unsubscribe());

  return (
    <>
      {user() ? (
        <Dashboard />
      ) : (
        <div class="min-h-screen flex items-center justify-center bg-base-200">

          <div class="card w-96 bg-base-100 shadow-xl">

            <div class="tabs tabs-boxed justify-center mt-4">

              <button
                class={`tab ${page() === "LogIn" ? "tab-active" : ""}`}
                onClick={() => setPage("LogIn")}
              >
                Prijavi se
              </button>

              <button
                class={`tab ${page() === "SignUp" ? "tab-active" : ""}`}
                onClick={() => setPage("SignUp")}
              >
                Registriraj se
              </button>

            </div>

            <div class="card-body">
              {page() === "LogIn" ? <LogIn /> : <SignUp />}
            </div>

          </div>

        </div>
      )}
    </>
  );
}

export default App;