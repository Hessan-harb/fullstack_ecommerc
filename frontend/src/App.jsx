
// import ProductDetailsPage from './components/ProductDetailsPage';
// import ProductListingPage from './components/ProductListingPage';
// import CartOverlay from './components/CartOverlay';
// import Nav from './components/Nav';
import {Routes,Route } from 'react-router-dom'
import Nav from './comp2/Nav';
import Products from './comp2/Products';
import Cart from './comp2/Cart';
import ProductOnly from './comp2/ProductOnly';
import Man from './components/Man';
import CatProducts from './comp2/CatProducts';

function App() {
  
  return (
    <>

      <Nav />
      <Routes>
        <Route path='/' element={<Products />} />
        <Route path="/category/:categoryName" element={<CatProducts />} />

        <Route path='/cart' element={<Cart />} />
        <Route path='/product/:id' element={<ProductOnly />} />
        <Route path='/man' element={<Man />} /> 
        
      </Routes>
    
      {/* <Nav />
      <Routes>
        <Route path='/product' element={<ProductDetailsPage />} />
        <Route path='/women' element={<ProductListingPage />} />
        <Route path='/cart' element={<CartOverlay />} />

      </Routes>
      {/* <ProductDetailsPage /> */}
       {/* <ProductListingPage />
      <CartOverlay />  */} 
    </>
  );
}

export default App;
