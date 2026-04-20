import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../firebase";

export const CATEGORIES = {
  income: ["Džeparac", "Stipendija", "Studentski posao", "Poklon", "Ostalo"],
  expense: ["Hrana", "Prijevoz", "Odjeća", "Zabava", "Obrazovanje", "Zdravlje", "Elektronika", "Ostalo"],
};

export const transactionService = {
  async add(uid, { type, amount, description, category }) {
    const docRef = await addDoc(collection(db, "users", uid, "transactions"), {
      type,
      amount: parseFloat(amount),
      description,
      category,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  },

  async getByMonth(uid, year, month) {
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59);
    const q = query(
      collection(db, "users", uid, "transactions"),
      where("createdAt", ">=", Timestamp.fromDate(start)),
      where("createdAt", "<=", Timestamp.fromDate(end)),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  },

  async delete(uid, transactionId) {
    await deleteDoc(doc(db, "users", uid, "transactions", transactionId));
  },
};