// main.js — Firestore-powered frontend logic (ES module)
import { db, app } from "./firebase-config.js";
import { collection, addDoc, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getStorage, ref as sref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

const storage = getStorage(app);

// Helper: show toast-like message
function showMessage(msg, type = 'success'){
  let el = document.createElement('div');
  el.textContent = msg;
  el.style.position = 'fixed';
  el.style.right = '20px';
  el.style.bottom = '20px';
  el.style.padding = '10px 14px';
  el.style.borderRadius = '10px';
  el.style.boxShadow = '0 8px 24px rgba(2,6,23,0.12)';
  el.style.zIndex = 2000;
  el.style.background = type === 'error' ? '#fee2e2' : '#ecfdf5';
  el.style.color = type === 'error' ? '#991b1b' : '#064e3b';
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), 4000);
}

// Render skeletons while loading
function renderNewsSkeleton(container, count = 3){
  container.innerHTML = '';
  for(let i=0;i<count;i++){
    const div = document.createElement('div');
    div.className = 'news-item skeleton';
    div.style.height = '120px';
    container.appendChild(div);
  }
}

// Load berita from Firestore
export async function loadNews(){
  const container = document.getElementById('news-list') || document.getElementById('news-grid') || document.querySelector('.news-grid');
  if(!container) return;
  renderNewsSkeleton(container);
  try{
    const q = query(collection(db, 'berita'), orderBy('waktu','desc'), limit(9));
    const snap = await getDocs(q);
    container.innerHTML = '';
    if(snap.empty){
      container.innerHTML = '<div class="small muted">Belum ada berita.</div>';
      return;
    }
    snap.forEach(doc => {
      const data = doc.data();
      const card = document.createElement('article');
      card.className = 'news-item card';
      card.innerHTML = `
        <h3 style="margin:0 0 8px">${escapeHtml(data.judul || 'Tanpa Judul')}</h3>
        <p class="small muted">${(new Date(data.waktu?.toDate?.()?.toISOString?.() || data.waktu || Date.now())).toLocaleDateString()}</p>
        <p class="small">${truncate(escapeHtml(data.isi || ''), 180)}</p>
      `;
      container.appendChild(card);
    });
  }catch(err){
    console.error('loadNews error', err);
    container.innerHTML = '<div class="small muted">Gagal memuat berita.</div>';
  }
}

// Escape HTML to avoid XSS
function escapeHtml(s){
  return String(s)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('\"','&quot;')
    .replaceAll("'" , '&#039;');
}
function truncate(s, n){
  return s.length>n? s.slice(0,n).trim() + '...': s;
}

// Contact form handling
export async function handleContactForm(e){
  e && e.preventDefault && e.preventDefault();
  const form = document.getElementById('contact-form');
  if(!form) return;
  const nama = form.nama.value.trim();
  const email = form.email.value.trim();
  const pesan = form.pesan.value.trim();
  if(!nama || !email || !pesan){ showMessage('Mohon lengkapi semua bidang', 'error'); return; }
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true;
  btn.textContent = 'Mengirim...';
  try{
    await addDoc(collection(db,'pesan'),{ nama, email, pesan, waktu: new Date() });
    showMessage('Pesan berhasil dikirim');
    form.reset();
  }catch(err){
    console.error(err);
    showMessage('Gagal mengirim pesan — coba lagi', 'error');
  }finally{
    btn.disabled = false;
    btn.textContent = 'Kirim Pesan';
  }
}

// Donation upload handler — uploads proof to Storage and writes a record to 'donasi_proof'
export async function handleDonationForm(e){
  e && e.preventDefault && e.preventDefault();
  const form = document.getElementById('donation-form');
  if(!form) return;
  const nama = form.nama.value.trim();
  const nominal = form.nominal.value.trim();
  const file = form.bukti.files[0];
  if(!nama || !nominal){ showMessage('Nama dan nominal wajib diisi', 'error'); return; }
  const btn = form.querySelector('button[type=submit]');
  btn.disabled = true; btn.textContent = 'Mengunggah...';
  try{
    let fileUrl = '';
    if(file){
      const path = `donasi_bukti/${Date.now()}_${file.name.replaceAll(' ','_')}`;
      const srefObj = sref(storage, path);
      await uploadBytes(srefObj, file);
      fileUrl = await getDownloadURL(srefObj);
    }
    await addDoc(collection(db,'donasi_proof'),{ nama, nominal, bukti: fileUrl, waktu: new Date() });
    showMessage('Terima kasih — bukti donasi tersimpan');
    form.reset();
  }catch(err){
    console.error('donation error', err);
    showMessage('Gagal mengunggah bukti donasi', 'error');
  }finally{
    btn.disabled = false; btn.textContent = 'Kirim Bukti Donasi';
  }
}

// Clipboard helper
export function copyText(value){
  navigator.clipboard?.writeText(value).then(()=> showMessage('Nomor rekening disalin'))
    .catch(()=> showMessage('Tidak dapat menyalin', 'error'));
}

// Auto init on page load
document.addEventListener('DOMContentLoaded', ()=>{
  // wire contact form
  const contactForm = document.getElementById('contact-form');
  if(contactForm) contactForm.addEventListener('submit', handleContactForm);
  const donationForm = document.getElementById('donation-form');
  if(donationForm) donationForm.addEventListener('submit', handleDonationForm);
  // load news
  loadNews();
  // mobile menu
  const menuBtn = document.getElementById('menuBtn');
  const nav = document.querySelector('nav.site-nav');
  menuBtn && menuBtn.addEventListener('click', ()=>{
    const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', String(!expanded));
    if(nav.style.display === 'block') nav.style.display = '';
    else nav.style.display = 'block';
  });
});