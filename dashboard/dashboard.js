// dashboard.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-app.js";
import { getFirestore, collection, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";
import { getAuth, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-auth.js";

// === Firebase Config ===
const firebaseConfig = {
  apiKey: "AIzaSyC9nauB7Tj71RDjl5nNY6YwdHbh-jrSFtk",
  authDomain: "yayasanpermataarridha-3b036.firebaseapp.com",
  projectId: "yayasanpermataarridha-3b036",
  storageBucket: "yayasanpermataarridha-3b036.firebasestorage.app",
  messagingSenderId: "1087047736289",
  appId: "1:1087047736289:web:598daad1866c37c63a10a0",
  measurementId: "G-KFSHTDXGPS"
};

// === Inisialisasi Firebase ===
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// === Cek apakah admin login ===
onAuthStateChanged(auth, (user) => {
  if (!user || user.email !== "yayasanpermataarridha@gmail.com") {
    alert("Anda tidak memiliki akses!");
    window.location.href = "../admin.html";
  } else {
    loadPesan();
  }
});

// === Fungsi Logout ===
window.logout = function () {
  signOut(auth)
    .then(() => {
      window.location.href = "../admin.html";
    })
    .catch((error) => {
      console.error("Logout gagal:", error);
    });
};

// === Menampilkan data pesan ===
async function loadPesan() {
  const pesanTable = document.getElementById("pesanTable");
  pesanTable.innerHTML = `
    <tr>
      <th>Nama</th>
      <th>Email</th>
      <th>Pesan</th>
      <th>Waktu</th>
      <th>Aksi</th>
    </tr>
  `;

  const querySnapshot = await getDocs(collection(db, "pesan"));
  querySnapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${data.nama}</td>
      <td>${data.email}</td>
      <td>${data.pesan}</td>
      <td>${new Date(data.waktu).toLocaleString("id-ID")}</td>
      <td><button class="hapus-btn" data-id="${docSnap.id}">Hapus</button></td>
    `;
    pesanTable.appendChild(row);
  });

  // tombol hapus
  document.querySelectorAll(".hapus-btn").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      if (confirm("Yakin ingin menghapus pesan ini?")) {
        await deleteDoc(doc(db, "pesan", id));
        alert("Pesan dihapus!");
        loadPesan(); // refresh tabel
      }
    });
  });
}