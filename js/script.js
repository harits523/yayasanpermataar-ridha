// Efek animasi lembut saat scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }
  });
}, {
  threshold: 0.2
});

document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));
document.querySelectorAll('.program-card').forEach(el => observer.observe(el));