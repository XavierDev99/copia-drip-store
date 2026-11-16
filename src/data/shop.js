export const initialShop = { cart: [], orders: [], profile: null, signedIn: false };
export const total = items => items.reduce((sum, item) => sum + Math.round(item.price * 100) * item.quantity, 0) / 100;

export function loadShop() {
  try { return JSON.parse(localStorage.getItem('drip-store-shop')) ?? initialShop; }
  catch { return initialShop; }
}

export function shopReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const item = action.item;
      const existing = state.cart.find(line => line.key === item.key);
      const cart = existing
        ? state.cart.map(line => line.key === item.key ? { ...line, quantity: line.quantity + 1 } : line)
        : [...state.cart, { ...item, quantity: 1 }];
      return { ...state, cart };
    }
    case 'clear':
      return { ...state, cart: [], coupon: false };
    case 'coupon':
      return { ...state, coupon: action.applied };
    case 'quantity':
      return { ...state, cart: state.cart.map(line => line.key === action.key
        ? { ...line, quantity: action.quantity } : line).filter(line => line.quantity > 0) };
    case 'payment':
      return { ...state, payment: action.payment };
    case 'order':
      if (!state.cart.length) return state;
      return { ...state, cart: [], coupon: false, orders: [{ ...action.order, items: state.cart, total: payable(state.cart, state.coupon) }, ...state.orders] };
    case 'profile':
      return { ...state, profile: action.profile, signedIn: true };
    case 'sign-in':
      return { ...state, signedIn: true };
    case 'sign-out':
      return { ...state, signedIn: false };
    default:
      return state;
  }
}




export const couponDiscount = (items, applied) => applied ? Math.round(total(items) * 10) / 100 : 0;
export const payable = (items, applied) => (Math.round(total(items) * 100) - Math.round(couponDiscount(items, applied) * 100)) / 100;
