import React, { useState } from 'react';
import { TiTick } from "react-icons/ti";
import { FaRegEyeSlash } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { Link } from 'react-router-dom';
import logo from '../../assets/images/Logo-FUNDAPROTAN.png'
import useSignup from '../../Hooks/useSignup';

const Register = () => {
    const { signup } = useSignup();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [eye, setEye] = useState(false);

    const togglePassword = () => {
        setEye(!eye);
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = e.target;
        await signup(formData);
        form.reset();

    }

    return (
        <div className='max-w-sm px-6 md:max-w-3xl md:px-8 lg:max-w-7xl mx-auto lg:mt-12'>
            <div className="">
                <div className="grid md:grid-cols-2 gap-7">
                <div className="lg:py-0 py-4 ">
                        <div className='flex justify-center lg:justify-start my-6'>
                            <img className='lg:w-[40%] w-1/2' src={logo} alt="" />
                        </div>
                        <div >
                            <h1 className='font-bold text-xl md:text-3xl lg:text-4xl text-center lg:text-left'>Create your Fundaportan account</h1>
                            <p className='flex items-center gap-1 my-4 lg:text-xl'><span className='text-2xl text-[#68D2E8]'><TiTick /></span>Create a campaign in minutes</p>
                            <p className='flex items-center gap-1 my-4 lg:text-xl'><span className='text-2xl text-[#68D2E8]'><TiTick /></span>Seamlessly integrate with your website</p>
                            <p className='flex items-center gap-1 my-4 lg:text-xl'><span className='text-2xl text-[#68D2E8]'><TiTick /></span>Accept nearly every payment method</p>
                        </div>
                    </div>
                    <div className="card w-full  shadow-2xl bg-base-100">
                        <h1 className="text-center text-5xl font-bold py-4">Register</h1>
                        <form className="card-body lg:grid md:grid-cols-2" onSubmit={handleSubmit}>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">First Name</span>
                                </label>
                                <input name="firstName" type="text" placeholder="first name" className="input input-bordered" required onChange={handleChange} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Last Name</span>
                                </label>
                                <input name="lastName" type="text" placeholder="last name" className="input input-bordered" onChange={handleChange} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Username</span>
                                </label>
                                <input name="username" type="text" placeholder="username" className="input input-bordered" required onChange={handleChange} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input name="email" type="email" placeholder="email" className="input input-bordered" required onChange={handleChange} />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <label className="input input-bordered flex items-center gap-2 label">
                                    <input name="password" type={eye ? "text" : "password"} className="grow" placeholder="password" onChange={handleChange} />
                                    <span onClick={togglePassword} className="text-xl -ml-10 md:-ml-0">{eye ? <MdOutlineRemoveRedEye /> : <FaRegEyeSlash />}</span>
                                </label>
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Confirm Password</span>
                                </label>
                                <label className="input input-bordered flex items-center gap-2 label">
                                    <input name="confirmPassword" type={eye ? "text" : "password"} className="grow" placeholder="confirm password" onChange={handleChange} />
                                    <span onClick={togglePassword} className="text-xl -ml-10 md:-ml-0">{eye ? <MdOutlineRemoveRedEye /> : <FaRegEyeSlash />}</span>
                                </label>
                            </div>                          

                            <div className="form-control col-span-2">
                                <label className="label">
                                    <p className="pt-2 text-sm">Already have an account? <span className="text-blue-400"><Link to='/login'>Login</Link></span></p>
                                </label>
                                <label className="label justify-start gap-3 cursor-pointer">
                                    <input type="checkbox" className="checkbox" />
                                    <span className="label-text">I have read and agree to the <span><a className='text-blue-400'>terms & conditions and privacy policy</a></span></span>
                                </label>
                            </div>
                            <div className="form-control mt-6 col-span-2">
                                <button type="submit" className="btn bg-[#FDDE55">Register</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
