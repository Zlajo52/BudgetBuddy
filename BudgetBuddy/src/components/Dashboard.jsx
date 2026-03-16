import { auth } from "../firebase";
import { signOut } from "firebase/auth";

function Dashboard() {

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div class="flex h-screen flex-col items-center justify-center gap-4">
      <h1 class="text-2xl font-bold">Dobrodošao u BudgetBuddy</h1>

      <button class="btn btn-error" onClick={logout}>
        Odjava
      </button>
    </div>
  );
}

export default Dashboard;