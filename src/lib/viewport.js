/**
 * Svelte Action untuk mendeteksi kapan sebuah elemen masuk ke viewport.
 * Saat elemen masuk, ia akan menambahkan class 'visible'.
 * @param {HTMLElement} node Elemen HTML yang menggunakan action ini.
 */
export function viewport(node) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        node.classList.add('visible');
        observer.unobserve(node); // Hentikan observasi setelah animasi berjalan sekali
      }
    });
  });

  observer.observe(node);

  return {
    destroy() {
      observer.unobserve(node);
    }
  };
}