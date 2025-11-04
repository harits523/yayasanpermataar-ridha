import { db } from "./firebase-config.js";
import { collection, addDoc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Menampilkan berita di halaman berita.html
async function tampilBerita() {
  const list = document.getElementById("news-list");
  if (!list) return;

  const snapshot = await getDocs(collection(db, "berita"));
  list.innerHTML = "";
  snapshot.forEach((doc) => {
    const data = doc.data();
    list.innerHTML += `
      <div class="news-item">
        <h3>${data.judul}</h3>
        <p>${data.isi}</p>
      </div>
    `;
  });
}

// Kirim pesan dari form kontak
async function kirimPesan(e) {
  e.preventDefault();
  const nama = document.getElementById("nama").value;
  const email = document.getElementById("email").value;
  const pesan = document.getElementById("pesan").value;

  try {
    await addDoc(collection(db, "pesan"), { nama, email, pesan, waktu: new Date() });
    alert("Pesan berhasil dikirim!");
    document.getElementById("contact-form").reset();
  } catch (err) {
    alert("Gagal mengirim pesan.");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  tampilBerita();
  const form = document.getElementById("contact-form");
  if (form) form.addEventListener("submit", kirimPesan);
});