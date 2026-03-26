// src/services/auth.js
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export const authService = {
  // Registracija — kreira Auth korisnika i Firestore dokument
  async register(name, email, password) {
    const credential = await createUserWithEmailAndPassword(auth, email, password);
    const user = credential.user;

    await updateProfile(user, { displayName: name });

    await setDoc(doc(db, "users", user.uid), {
      name,
      email,
      role: "user",
      monthlyBudget: 0,
      savingsGoal: null,
      savingsGoalAmount: 0,
      createdAt: new Date(),
    });

    return user;
  },

  // Prijava
  async login(email, password) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return credential.user;
  },

  // Odjava
  async signOut() {
    await signOut(auth);
  },

  // Reset lozinke putem emaila
  async passwordReset(email) {
    await sendPasswordResetEmail(auth, email);
  },

  // Dohvati profil iz Firestorea
  async getUserProfile(uid) {
    const snap = await getDoc(doc(db, "users", uid));
    return snap.exists() ? snap.data() : null;
  },

  // Ažuriraj profil (ime, budžet, cilj)
  async updateProfile(uid, data) {
    await updateDoc(doc(db, "users", uid), data);
    if (data.name) {
      await updateProfile(auth.currentUser, { displayName: data.name });
    }
  },

  // Promjena lozinke — zahtijeva re-autentifikaciju
  async changePassword(currentPassword, newPassword) {
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  },
};
