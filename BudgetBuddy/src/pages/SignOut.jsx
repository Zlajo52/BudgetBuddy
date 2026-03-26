import { onMount } from "solid-js";
import { authService } from "../services/auth";
import { useNavigate } from "@solidjs/router";

export default function SignOut() {
  const navigate = useNavigate();

  onMount(async () => {
    try {
      await authService.signOut();
    } catch (error) {
      console.error("Greška pri odjavi:", error);
    } finally {
      navigate("/login");
    }
  });
}
