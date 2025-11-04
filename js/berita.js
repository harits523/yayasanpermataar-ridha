import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp, query, orderBy } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// === Form Upload Berita ===
const form = document.getElementById("formBerita");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const judul = document.getElementById("judul").value;
    const isi = document.getElementById("isi").value;

    try {
      await addDoc(collection(db, "berita"), {
        judul,
        isi,
        tanggal: serverTimestamp(),
      });
      alert("✅ Berita berhasil diupload!");
      form.reset();
    } catch (err) {
      console.error("Gagal upload berita:", err);
      alert("Gagal upload berita, cek konsol untuk detail.");
    }
  });
}

// === Tampilkan Berita di Halaman Publik ===
const list = document.getElementById("listBerita");
if (list) {
  async function tampilBerita() {
    const q = query(collection(db, "berita"), orderBy("tanggal", "desc"));
    const querySnapshot = await getDocs(q);
    list.innerHTML = "";
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const tgl = data.tanggal?.toDate().toLocaleString("id-ID") || "";
      list.innerHTML += `
        <div class="berita-item">
          <h3>${data.judul}</h3>
          <p>${data.isi}</p>
          <small>${tgl}</small>
        </div>
      `;
    });
  }
  tampilBerita();
}