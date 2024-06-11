import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export const fetchProducts= createAsyncThunk("productsSlice/fetchProducts",async ()=>{
    const response = await fetch(import.meta.env.VITE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
        {
          products {
            id
            name
            inStock
            description
            category
            brand
            prices {
              amount
              currency_label
              currency_symbol
            }
            gallery
            attributes {
              name
              type
              items {
                displayValue
                value
              }
            }
          }
        }
      `
    }),
  });
  const data = await response.json();
  if (data.errors) {
    throw new Error(data.errors[0].message);
  }

  return data.data.products;
});


 const productsSlice=createSlice({
    initialState: [],
    name: 'productsSlice',
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.fulfilled,(state,actions) =>{
            return actions.payload;
        })
    }
});

export const {}=productsSlice.actions;
export default productsSlice.reducer;

