import { app, db, auth } from "./firebase-config.js";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

import {
  collection, addDoc, getDocs, deleteDoc, doc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Login admin
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
      window.location.href = "dashboard/index.html";
    } catch (err) {
      alert("Login gagal: " + err.message);
    }
  });
}

// Logout
const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) logoutBtn.addEventListener("click", () => signOut(auth));

// Halaman Dashboard
async function tampilBeritaAdmin() {
  const container = document.getElementById("news-list");
  if (!container) return;
  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "berita"));
  snapshot.forEach((docu) => {
    const data = docu.data();
    container.innerHTML += `
      <div class="news-item">
        <h3>${data.judul}</h3>
        <p>${data.isi}</p>
        <button onclick="hapusBerita('${docu.id}')">Hapus</button>
      </div>
    `;
  });
}

async function tampilPesan() {
  const container = document.getElementById("pesan-list");
  if (!container) return;
  container.innerHTML = "";
  const snapshot = await getDocs(collection(db, "pesan"));
  snapshot.forEach((docu) => {
    const data = docu.data();
    container.innerHTML += `
      <div class="news-item">
        <p><strong>${data.nama}</strong> (${data.email})</p>
        <p>${data.pesan}</p>
        <hr>
      </div>
    `;
  });
}

async function tambahBerita(e) {
  e.preventDefault();
  const judul = document.getElementById("judul").value;
  const isi = document.getElementById("isi").value;
  await addDoc(collection(db, "berita"), { judul, isi, waktu: new Date() });
  alert("Berita berhasil disimpan!");
  document.getElementById("news-form").reset();
  tampilBeritaAdmin();
}

window.hapusBerita = async (id) => {
  await deleteDoc(doc(db, "berita", id));
  alert("Berita dihapus!");
  tampilBeritaAdmin();
};

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("news-form")) {
    document.getElementById("news-form").addEventListener("submit", tambahBerita);
    tampilBeritaAdmin();
    tampilPesan();
  }
});