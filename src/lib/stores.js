// src/lib/stores.js
import { writable } from 'svelte/store';

function createCart() {
  const { subscribe, set, update } = writable([]);

  return {
    subscribe,
    addItem: (product) => {
      update((items) => {
        const existingItem = items.find((item) => item.id === product.id);

        if (existingItem) {
          // Jika item sudah ada, tambah quantity
          return items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        // Jika item baru, tambahkan ke keranjang
        return [...items, { ...product, quantity: 1 }];
      });
    },
    removeItem: (productId) => {
      update((items) => {
        return items
          .map((item) =>
            item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
          )
          .filter((item) => item.quantity > 0); // Hapus jika quantity 0
      });
    },
    reset: () => set([]), // Kosongkan keranjang
  };
}

export const cart = createCart();