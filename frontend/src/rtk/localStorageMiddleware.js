const localStorageMiddleware = (store) => (next) => (action) => {
    const result = next(action);
    const { cart } = store.getState();
    localStorage.setItem('cart', JSON.stringify(cart));
    return result;
  };
  
  export default localStorageMiddleware;
  