import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from '@headlessui/react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Cart from "../comp2/Cart.jsx";

function Nav() {
  const cart = useSelector(state => state.cart);

  const [showCart, setShowCart] = useState(false); // State to manage cart overlay visibility
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const { categoryName } = useParams();

  const toggleCart = () => {
    setShowCart(!showCart); // Toggle cart overlay visibility
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: "{ categories { id name } }"
          }),
        });

        console.log('Response status:', response.status);
        console.log('Response status text:', response.statusText);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Response data:', responseData);

        if (responseData.errors) {
          throw new Error(responseData.errors[0].message);
        }
        setData(responseData.data);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error.message);
      }
    };

    fetchData();
  }, [categoryName]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container mx-auto relative">
        <nav className="flex justify-between items-center py-4">
          <div className="hidden md:flex justify-between items-center py-4">
            {data.categories.map((category) => (
              <div key={category.id} className="text-xl font-bold text-gray-800">
                <Link className="uppercase hover:text-orange-500 you-hover" to={`/category/${category.name}`}>{category.name}</Link>&nbsp; &nbsp; &nbsp; &nbsp;
              </div>
            ))}
          </div>
          <button id="mobile-btn" className="md:hidden you-hover"><i className="ri-menu-add-fill text-3xl"></i></button>

          <div className="text-2xl font-bold text-gray-800"><Link to='/'><i className="fa-solid fa-store"></i></Link></div>
          <div className="text-gray-600">
            <span className="relative">
              <div className="container m-3">
                <div className="flex">
                  {/* Cart Icon */}
                  <div className="text-gray-600 cursor-pointer" onClick={toggleCart}>
                    <span className="relative">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" className="cursor-pointer fill-[#333] inline"
                        viewBox="0 0 512 512">
                        <path
                          d="M164.96 300.004h.024c.02 0 .04-.004.059-.004H437a15.003 15.003 0 0 0 14.422-10.879l60-210a15.003 15.003 0 0 0-2.445-13.152A15.006 15.006 0 0 0 497 60H130.367l-10.722-48.254A15.003 15.003 0 0 0 105 0H15C6.715 0 0 6.715 0 15s6.715 15 15 15h77.969c1.898 8.55 51.312 230.918 54.156 243.71C131.184 280.64 120 296.536 120 315c0 24.812 20.188 45 45 45h272c8.285 0 15-6.715 15-15s-6.715-15-15-15H165c-8.27 0-15-6.73-15-15 0-8.258 6.707-14.977 14.96-14.996zM477.114 90l-51.43 180H177.032l-40-180zM150 405c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm167 15c0 24.813 20.188 45 45 45s45-20.188 45-45-20.188-45-45-45-45 20.188-45 45zm45-15c8.27 0 15 6.73 15 15s-6.73 15-15 15-15-6.73-15-15 6.73-15 15-15zm0 0"
                          data-original="#000000"></path>
                      </svg>
                      <span className="absolute left-auto -ml-1 top-0 rounded-full bg-red-500 px-1 py-0 text-xs text-white">{cart.length}</span>
                    </span>
                  </div>
                </div>

                {/* Cart Overlay */}
                <Transition.Root show={showCart} as={Fragment}>
                  <Dialog as="div" className="fixed inset-0 overflow-y-auto" onClose={toggleCart}>
                    <div className="flex items-center justify-center min-h-screen p-4 text-center">
                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <Dialog.Overlay className="fixed inset-0 bg-gray-150 opacity-30" />
                      </Transition.Child>

                      <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                      >
                        <div className="mt-4 space-y-4 bg-white p-6 rounded shadow-lg">
                          {cart.map((product) => (
                            <Cart product={product} key={product.id} />
                          ))}
                        </div>
                      </Transition.Child>
                    </div>
                  </Dialog>
                </Transition.Root>
              </div>
            </span>
          </div>
        </nav>
      </div>
    </>
  )
}

export default Nav;
