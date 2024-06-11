import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carousel } from "@material-tailwind/react";
import { useDispatch } from "react-redux";
import { fetchProducts } from "../slices/products-slice";
import { addToCart } from "../slices/CartSlices";
import '../index.css';

function ProductOnly() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedAttributes, setSelectedAttributes] = useState({
        color: '',
        size: '',
        capacity: '',
        withUSB3Ports: [],
        touchIDInKeyboard: []
    });
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    const fetchProductDetails = async (id) => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            query: `{ product(id: "${id}") { id name description category brand prices { amount currency_label currency_symbol } gallery attributes { name type items { displayValue value } } } }`
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        try {
            const response = await fetch(import.meta.env.VITE_API_URL, requestOptions);
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            const result = await response.json();
            setProduct(result.data.product);
        } catch (error) {
            console.error('Error fetching product details:', error);
        }
    };

    useEffect(() => {
        fetchProductDetails(id);
    }, [id]);

    const handleAttributeChange = (attributeName, value) => {
        setSelectedAttributes(prevAttributes => {
            if (Array.isArray(prevAttributes[attributeName])) {
                const values = prevAttributes[attributeName].includes(value)
                    ? prevAttributes[attributeName].filter(val => val !== value)
                    : [...prevAttributes[attributeName], value];
                return { ...prevAttributes, [attributeName]: values };
            }
            return { ...prevAttributes, [attributeName]: value };
        });
    };

    const handleAddToCart = (event) => {
        event.preventDefault();
        console.log('Selected attributes:', selectedAttributes);
        const productToCart = {
            ...product,
            selectedAttributes
        };
        dispatch(addToCart(productToCart));
    };

    if (!product) {
        return <div>Loading...</div>;
    }

    const colorAttribute = product.attributes.find(attr => attr.name === 'Color');
    const sizeAttribute = product.attributes.find(attr => attr.name === 'Size');
    const capacityAttribute = product.attributes.find(attr => attr.name === 'Capacity');
    const withUSB3Ports = product.attributes.find(attr => attr.name === 'With USB 3 ports');
    const touchIDInKeyboard = product.attributes.find(attr => attr.name === 'Touch ID in keyboard');

    return (
        <>
            <div className="bg-white">
                <div className="pt-6">
                    <div className="mx-auto max-w-2xl px-4 pb-16 pt-10 sm:px-6 lg:max-w-7xl lg:grid lg:grid-cols-3 lg:grid-rows-[auto,auto,1fr] lg:gap-x-8 lg:px-8 lg:pb-24 lg:pt-16">
                        <div className="lg:col-span-2 lg:border-r lg:border-gray-200 lg:pr-8">
                        </div>
                        <div className="mt-4 lg:row-span-3 lg:mt-0">
                            <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">{product.name}</h1><br />
                            <p className="text-3xl tracking-tight text-gray-900">
                                {product.prices.map((price, index) => (
                                    <span key={index}>
                                        {price.amount} {price.currency_symbol}
                                    </span>
                                ))}
                            </p>
                            <form className="mt-10">
                                {/* Colors */}
                                {colorAttribute && (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900">Color</h3>
                                        <fieldset className="mt-4">
                                            <legend className="sr-only">Choose a color</legend>
                                            <div className="flex items-center space-x-3">
                                                {colorAttribute.items.map((item, index) => (
                                                    <label key={index} className="relative -m-0.5 flex cursor-pointer items-center justify-center rounded-full p-0.5 focus:outline-none ring-gray-400">
                                                        <input type="radio" name="color-choice" value={item.value} className="sr-only" onChange={() => handleAttributeChange('color', item.value)} />
                                                        <span className={`sr-only ${activeImageIndex === index ? 'border-2 border-indigo-500' : ''}`} onClick={() => setActiveImageIndex(index)}>{item.value}</span>
                                                        <span aria-hidden="true" className={`h-8 w-8 bg-[${item.value.toLowerCase()}] rounded-full border border-black border-opacity-10`}></span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </div>
                                )}

                                {/* Sizes */}
                                {sizeAttribute && (
                                    <div className="mt-10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">Size:</h3>
                                        </div>
                                        <fieldset className="mt-4">
                                            <legend className="sr-only">Choose a size</legend>
                                            <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                                                {sizeAttribute.items.map((item, index) => (
                                                    <label key={index} className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-400 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm">
                                                        <input type="radio" name="size-choice" value={item.value} className="sr-only" onChange={() => handleAttributeChange('size', item.value)} />
                                                        <span>{item.value}</span>
                                                        <span className="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true"></span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </div>
                                )}

                                {/* Capacity */}
                                {capacityAttribute && (
                                    <div className="mt-10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">Capacity:</h3>
                                        </div>
                                        <fieldset className="mt-4">
                                            <legend className="sr-only">Choose a Capacity</legend>
                                            <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                                                {capacityAttribute.items.map((item, index) => (
                                                    <label key={index} className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-400 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm">
                                                        <input type="radio" name="capacity-choice" value={item.value} className="sr-only" onChange={() => handleAttributeChange('capacity', item.value)} />
                                                        <span>{item.value}</span>
                                                        <span className="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true"></span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </div>
                                )}

                                {/* withUSB3Ports */}
                                {withUSB3Ports && (
                                    <div className="mt-10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">With USB 3 Ports:</h3>
                                        </div>
                                        <fieldset className="mt-4">
                                            <legend className="sr-only">Choose With USB 3 Ports</legend>
                                            <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                                                {withUSB3Ports.items.map((item, index) => (
                                                    <label key={index} className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-400 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm">
                                                        <input type="checkbox" name="usb3-choice" value={item.value} className="sr-only" onChange={() => handleAttributeChange('withUSB3Ports', item.value)} />
                                                        <span>{item.value}</span>
                                                        <span className="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true"></span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </div>
                                )}

                                {/* touchIDInKeyboard */}
                                {touchIDInKeyboard && (
                                    <div className="mt-10">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium text-gray-900">Touch ID In Keyboard:</h3>
                                        </div>
                                        <fieldset className="mt-4">
                                            <legend className="sr-only">Choose Touch ID In Keyboard</legend>
                                            <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-4">
                                                {touchIDInKeyboard.items.map((item, index) => (
                                                    <label key={index} className="group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-400 focus:outline-none sm:flex-1 sm:py-6 cursor-pointer bg-white text-gray-900 shadow-sm">
                                                        <input type="checkbox" name="touchID-choice" value={item.value} className="sr-only" onChange={() => handleAttributeChange('touchIDInKeyboard', item.value)} />
                                                        <span>{item.value}</span>
                                                        <span className="pointer-events-none absolute -inset-px rounded-md" aria-hidden="true"></span>
                                                    </label>
                                                ))}
                                            </div>
                                        </fieldset>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-gray-600 py-3 px-8 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                                    onClick={handleAddToCart}
                                >
                                    Add to cart
                                </button>
                            </form>
                        </div>
                        <div className="py-10 lg:col-span-2 lg:col-start-1 lg:border-r lg:border-gray-200 lg:pb-16 lg:pr-8 lg:pt-6">
                            <div className="flex">
                                <div className="w-1/4 pr-4">
                                    {product.gallery.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image}
                                            alt={`image ${index + 1}`}
                                            className={`w-1/2 h-30 object-cover rounded-lg border border-gray-300 cursor-pointer ${activeImageIndex === index ? 'border-2 border-indigo-500' : ''}`}
                                            onClick={() => setActiveImageIndex(index)}

                                        />
                                    ))}
                                </div>
                                <div className="w-3/4">
                                    <Carousel
                                        className="rounded-xl"
                                        navigation={({ setActiveIndex, activeIndex, length }) => (
                                            <div className="absolute bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2">
                                                {new Array(length).fill("").map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`block h-1 cursor-pointer bg-gray-300 rounded-2xl transition-all content-[''] ${
                                                            activeIndex === i ? "w-8 bg-gray-300" : "w-4 bg-gray-200"
                                                        }`}
                                                        onClick={() => setActiveIndex(i)}
                                                    />
                                                ))}
                                            </div>
                                        )}
                                    >
                                        {product.gallery.map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                alt={`image ${index + 1}`}
                                                className="image-col object-cover bottom-1 h-full w-full"
                                            />
                                        ))}
                                    </Carousel>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProductOnly;
