import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
// import { XMarkIcon } from '@heroicons/react/24/outline'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { increaseQuantity,decreaseQuantity, deleteFromCart, clearCart } from '../slices/CartSlices.js';

export default function Cart({product}) {

  const products = useSelector(state => state.products); 
 
  const cart=useSelector(state=>state.cart) || [];

  const totalQuantity = cart.reduce((total, item) => total + item.quantity, 0);

  const dispatch=useDispatch();

  const totalPrice = cart.reduce((acc, product) => {
    acc += product.prices[0].amount * product.quantity; // Adjust based on your price structure
    return acc;
  }, 0).toFixed(2);

  const [open, setOpen] = useState(true);
  
  const placeOrder = () => {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    const productIds = cart.map(product => `"${product.id}"`).join(', ');

    const raw = JSON.stringify({
      "query": `mutation { createOrder(products: [${productIds}]) { id, products { id, name, price }, totalAmount } }`
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };

    fetch(import.meta.env.VITE_API_URL, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        dispatch(clearCart()); // Clear the cart after placing the order
        setOpen(false); // Close the cart dialog after placing the order
      })
      .catch((error) => console.error(error));
  };

  
  return (

    <>
      <div className='container m-3 bg-gray-300'>
        <Transition.Root show={open} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setOpen}>
            

              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 top-9 right-8 flex max-w-full pl-10">
                    
                      <div className="pointer-events-auto w-screen max-w-md">
                        <div className="flex  h-5/6 flex-col  bg-white shadow-xl">
                          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                            <div className="flex items-start justify-between">
                              <div className="text-lg font-medium text-gray-900">My Bag: {totalQuantity} </div>
                              
                              <div className="ml-3 flex h-7 items-center">
                                <button
                                  type="button"
                                  className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                  onClick={() => setOpen(false)}
                                >
                                  <span className="absolute -inset-0.5" />
                                  <span className="sr-only">Close panel</span>
                                  <i className="fa fa-window-close" aria-hidden="true"></i>
                                  {/* <XMarkIcon className="h-6 w-6" aria-hidden="true" /> */}
                                </button>
                              </div>
                            </div>

                            <div className="mt-8">
                              <div className="flow-root">
                              {cart.map((product) => (
                                  <div key={product.id} className="mb-6 flex items-start">
                                    <div className="m-[0_0_32px_0] flex flex-col items-center w-[fit-content] box-sizing-border">
                                    
                                    <div className="flex flex-row w-[fit-content] box-sizing-border">
                                      <div className="m-[0_8px_0_0] flex flex-row box-sizing-border">
                                        <div className="m-[0_72px_0_0] flex flex-col items-start box-sizing-border">
                                          <div className="m-[0_1.6px_8px_0] flex flex-col items-start w-[fit-content] box-sizing-border">
                                            
                                            <div className="m-[0_0_4px_0] inline-block break-words font-['Raleway'] font-light text-[16px] leading-[1.6] text-[#1D1F22]">
                                              {product.name}
                                            </div>
                                            <div className="m-[0_16.4px_0_0.1px] items-start break-words font-['Raleway'] font-medium text-[16px] leading-[1.6] text-[#1D1F22]">
                                            {product.prices?.map((price, index) => (
                                              <p key={index}>
                                                {price.amount} {price.currency_symbol} 
                                              </p>
                                            ))}
                                            </div>
                                          </div>
                                          {/* size */}
                                          


                                          {product.selectedAttributes && Object.keys(product.selectedAttributes).length > 0 && (
                                              Object.entries(product.selectedAttributes)
                                                  .filter(([attributeName, attributeValue]) => attributeValue && attributeValue.length > 0) // Filter out empty attributes
                                                  .map(([attributeName, attributeValue]) => (
                                                      <div key={attributeName} className="m-[0_12px_8px_0] flex flex-col w-[fit-content] box-sizing-border">
                                                          <div className="m-[0_0_8px_0] inline-block self-start break-words font-['Raleway'] font-normal text-[14px] leading-[1.143] text-[#1D1F22]">
                                                              {attributeName}:
                                                          </div>
                                                          <div className="flex flex-row justfiy-content space-between w-[fit-content] box-sizing-border">
                                                              <button
                                                                  className={`border-[1px_solid_#1D1F22] relative m-[0_8px_0_0] flex flex-row justify-center p-[1px_8.4px_1px_8.4px] box-sizing-border ${
                                                                      product.selectedAttributes[attributeName] === attributeValue ? 'bg-gray-400 text-[#FFFFFF]' : 'bg-[rgba(255,255,255,0.2)] text-[#1D1F22]'
                                                                  }`}
                                                                  style={attributeName.toLowerCase() === 'color' ? { backgroundColor: attributeValue, color: 'transparent', borderRadius: '50%', width: '20px', height: '20px', border: 'none', padding: '0' } : {}}
                                                              >
                                                                  {/* Display the color circle */}
                                                                  <span className="break-words font-['Source_Sans_Pro','Roboto_Condensed'] font-normal text-[14px] leading-[1.6]">
                                                                      {attributeValue}
                                                                  </span>
                                                              </button>
                                                          </div>
                                                      </div>
                                                  ))
                                          )}

                                          <div onClick={()=>dispatch(deleteFromCart(product.id))}><i className="fa fa-trash" aria-hidden="true"></i></div>

                                        </div>
                                        <div className="flex flex-col items-center box-sizing-border">
                                          <button onClick={()=>dispatch(increaseQuantity(product.id))}  className="border border-gray-500 m-[0_0_45px_0] w-[24px] h-[24px]">
                                            +
                                          </button>
                                          <div className="m-[0_7.5px_45px_7.9px] inline-block break-words font-['Raleway'] font-medium text-[16px] leading-[1.6] text-[#1D1F22]">
                                            {product.quantity}
                                          </div>
                                          <button onClick={()=>dispatch(decreaseQuantity(product.id))}  className="border border-gray-500 m-[0_0_45px_0] w-[24px] h-[24px]">
                                            -
                                          </button>
                                        </div>
                                      </div>
                                      <div className=" w-[121px] h-[164px]">
                                      {product.gallery.length > 0 && (
                                          <img src={product.gallery[0]} alt={product.name} />
                                      )}
                                      </div>
                                      
                                    </div>
                                    
                                  </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="px-4 py-6 sm:px-6">
                            {/* Total price */}
                            <div className="flex justify-between border-t pt-4 mt-4">
                              <div className="text-lg font-semibold">Total</div>
                              <div className="text-lg font-semibold">${totalPrice}</div>
                            </div>

                            <button onClick={()=>dispatch(clearCart(product.id))}>ClearCart</button>

                            {/* Place order button */}
                            <button onClick={placeOrder} className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded w-full">
                              PLACE ORDER
                            </button>
                            <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                              <p>
                                or{' '}
                                <Link
                                  // type="button"
                                  to='/'
                                  className="font-medium text-indigo-600 hover:text-indigo-500"
                                  onClick={() => setOpen(false)}
                                >
                                  Continue Shopping
                                  <span aria-hidden="true"> &rarr;</span>
                                </Link>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            </Dialog>
        </Transition.Root>
      </div>
     

         
    </>
    
  )
}

