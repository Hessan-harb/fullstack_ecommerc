import { createSlice } from "@reduxjs/toolkit";

const initialState =[]

export const cartSlice=createSlice({
    initialState,
    name: "cartSlice",
    reducers: {

        addToCart(state, action) {
            const findProduct=state.find((product)=>product.id === action.payload.id);
            if(findProduct){
                findProduct.quantity +=1;  //if the product is already in the cart
            }else{
                const productClone= {...action.payload,quantity: 1}
                state.push(productClone); // Mutating state directly, handled by Immer
            }
        },
        
        clearCart() {
            return [];
        },
        increaseQuantity(state, action) {
            const product = state.find((item) => item.id === action.payload);
            if (product) {
                product.quantity += 1;
            }
        },
        decreaseQuantity(state, action) {
            const product = state.find((item) => item.id === action.payload);
            if (product && product.quantity > 1) {
                product.quantity -= 1;
            }
        },
        deleteFromCart(state, action) {
            return state.filter((product) => product.id !== action.payload);
        },
        persistCart(state) {
            // This action triggers the middleware to save the cart state
            return state;
        },
    }
})

export const {addToCart,deleteFromCart,clearCart,decreaseQuantity,increaseQuantity,persistCart}=cartSlice.actions;
export default cartSlice.reducer;