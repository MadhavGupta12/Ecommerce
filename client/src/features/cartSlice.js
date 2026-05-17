import { createSlice } from '@reduxjs/toolkit';

const storedCart = JSON.parse(localStorage.getItem('cart') || '{"items":[]}');

const save = (state) => {
  localStorage.setItem('cart', JSON.stringify(state));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: storedCart,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existing = state.items.find((cartItem) => cartItem.product === item.product);
      if (existing) {
        existing.quantity = item.quantity;
      } else {
        state.items.push(item);
      }
      save(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.product !== action.payload);
      save(state);
    },
    clearCart: (state) => {
      state.items = [];
      save(state);
    }
  }
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export const selectCartTotals = (state) => {
  const itemsPrice = state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 12;
  const taxPrice = Number((itemsPrice * 0.08).toFixed(2));
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  return { itemsPrice, shippingPrice, taxPrice, totalPrice };
};
export default cartSlice.reducer;
