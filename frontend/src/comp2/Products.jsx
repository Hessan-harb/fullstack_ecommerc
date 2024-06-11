
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchProducts } from "../slices/products-slice";

function Products() {
    
    const products = useSelector((state) => state.products);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchProducts());
        
    }, []);

    const handleOutOfStockClick = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    return (
        <>
            <div className="bg-white">
                <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">

                    <div className="mt-6 grid grid-cols-2 rounded gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {products.map((product) => (
                            
                            <div key={product.id} className="group my-10 flex w-full max-w-xs flex-col overflow-hidden hover:bg-gray-50 items-center p-2">
                              
                            <a className="relative flex h-80 w-72 overflow-hidden ">
                              {product.gallery.map((image, index) => (
                                <p key={index}>
                                  <img className="absolute top-0 right-0 h-full w-full object-cover" src={image} alt={product.name} />
                                </p>
                              ))}

                              { !product.inStock && (
                                <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 flex justify-center items-center">
                                  <p className="text-white">Out of Stock</p>
                                </div>
                              )}
                              
                              <div className="absolute -right-16 bottom-0 mr-2 mb-4 space-y-2 transition-all duration-300 group-hover:right-0">
                                
                                {product.inStock ? (
                                  <Link  to={`/product/${product.id}`} className="flex h-10 w-10 items-center justify-center bg-orange-500 text-white transition hover:bg-orange-400 rounded-full items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                  </Link>
                                ) :(
                                  <div onClick={handleOutOfStockClick}  className="flex h-10 w-10 items-center justify-center bg-orange-700 text-white transition hover:bg-orange-400 rounded-full items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                  </div>
                                )}
                                
                              </div>
                            </a>
                            <div className="flex justify-content-between mt-4 pb-5">
                                <h5 className="tracking-tight text-gray-500">

                                {product.inStock ? (
                                  <Link to={`/product/${product.id}`}>
                                    {product.name}
                                  </Link>
                                ): (
                                  <p >
                                    {product.name}
                                  </p>
                                )}
                                
                                </h5> &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; &nbsp; &nbsp;
                                <div className="tracking-tight text-gray-900">
                                {product.prices.map((price, index) => (
                                  <p key={index}>
                                    {price.amount} {price.currency_symbol} 
                                  </p>
                                ))}
                                </div>
                        
                            
                              <div className="mb-5 ">
                                <p>
                                  {/* <span className=" text-sm text-gray-400 line-through">$499</span> */}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default Products;



