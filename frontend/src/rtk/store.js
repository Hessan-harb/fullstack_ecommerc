import { configureStore, combineReducers  } from "@reduxjs/toolkit";
import productsSlice from "../slices/products-slice";
import CartSlices from "../slices/CartSlices";
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web



// Configure persistor
const persistConfig = {
    key: 'root',
    storage,
  };

// Combine your reducers
const rootReducer = combineReducers({
    cart: CartSlices,
    products: productsSlice,
    // Other reducers here
  });

const persistedReducer = persistReducer(persistConfig, rootReducer);



export const store=configureStore({
    reducer: persistedReducer,
})

export const persistor = persistStore(store);
