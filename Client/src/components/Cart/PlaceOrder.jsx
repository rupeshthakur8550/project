import React, { useContext, useState } from 'react'
import { Button, Label, TextInput, ToggleSwitch } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';

const PlaceOrder = () => {
    const [formData, setFormData] = useState({});
    const [cartOrders, setCartOrders] = useState({});
    const { getTotalCartAmount, cartItems, emptyCart, food_list, user } = useContext(StoreContext);
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    const handlecheckout = async () => {
        try {
            const orderDetails = food_list
                .filter(item => cartItems[item._id] > 0)
                .map(item => ({
                    _id: item._id,
                    image: item.image,
                    name: item.name,
                    price: item.price,
                    quantity: cartItems[item._id],
                    total: item.price * cartItems[item._id],
                    seller: item.seller,
                    user: user._id
                }));
            setCartOrders(orderDetails);
            if (cartOrders.length > 0) {
                const res = await fetch('api/order/addtocart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(cartOrders),
                });
                if (res.ok) {
                    const data = await res.json();
                    emptyCart();
                    navigate('/dashboard?tab=myorders');
                }
                else {
                    console.error('Failed to add Orders');
                }
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    return (
        <div className='mt-20'>
            <div className='min-h-screen mt-10 flex md:flex-row flex-col items-center justify-center md:mx-8 md:gap-16 gap-5'>
                <div className='md:w-[30%] w-[85%] md:mb-20'>
                    <form className='flex flex-col gap-3'>
                        <span className='px-2 py-1 text-black rounded-lg inline-block font-bold text-3xl md:text-5xl text-center mb-5' style={{ fontVariant: 'petite-caps' }}>Delivery Information</span>
                        <div>
                            <Label value='Your Full Name' />
                            <TextInput
                                type='text'
                                placeholder='Xyz Abc'
                                id='name'
                                onChange={handleChange}
                                className='mt-2'
                            />
                        </div>
                        <div>
                            <Label value='Your Email' />
                            <TextInput
                                type='email'
                                placeholder='name@company.com'
                                id='email'
                                onChange={handleChange}
                                className='mt-2'
                            />
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex flex-col w-[50%] gap-2'>
                                <Label value='Plot No.' />
                                <TextInput
                                    type='number'
                                    placeholder='e.g 0000'
                                    id='plot_no'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='flex flex-col w-[50%] gap-2'>
                                <Label value='Street' />
                                <TextInput
                                    type='text'
                                    placeholder='Street'
                                    id='street'
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div className='flex flex-col w-[50%] gap-2'>
                                <Label value='City' />
                                <TextInput
                                    type='text'
                                    placeholder='City'
                                    id='city'
                                    onChange={handleChange}
                                />
                            </div>
                            <div className='flex flex-col w-[50%] gap-2'>
                                <Label value='State' />
                                <TextInput
                                    type='text'
                                    placeholder='State'
                                    id='state'
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div>
                            <Label value='Pincode' />
                            <TextInput
                                type='number'
                                placeholder='e.g. 425001'
                                id='pincode'
                                onChange={handleChange}
                                className='mt-2'
                            />
                        </div>
                        <div>
                            <Label value='Mobile No.' />
                            <TextInput
                                type='text'
                                placeholder='+91-0000000000'
                                id='phone'
                                onChange={handleChange}
                                className='mt-2'
                            />
                        </div>
                    </form>
                </div>
                <div className='md:w-[30%] w-[80%] mb-10'>
                    <div className="mt-8">
                        <div className="text-center mb-5">
                            <h2 className="text-lg font-bold">Cart Totals</h2>
                        </div>
                        <div className="text-center mb-5">
                            <div className='flex flex-col gap-3'>
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Subtotal</p>
                                    <p className='font-semibold'>₹{getTotalCartAmount()}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-600">Delivery Fee</p>
                                    <p className='font-semibold'>₹{getTotalCartAmount() === 0 ? 0 : 20}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-600 font-bold">Total</p>
                                    <p className='font-semibold'>₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 20}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style={{ textAlign: "-webkit-center" }}>
                        <Link to='/placeorder'>
                            <Button gradientDuoTone="purpleToPink" outline className='mt-6' onClick={handlecheckout}>
                                Proceed to Payment
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder