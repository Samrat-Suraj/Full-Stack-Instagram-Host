import { setUser } from '@/redux/authSlice'
import { USER_API_ENDPOINT } from '@/utils/constant'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from "sonner"


const LoginSignUpPage = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [curr, setCurr] = useState("Login")
    const [loading, setLoading] = useState(false)

    const [input, setInput] = useState({
        username: "",
        email: "",
        password: ""
    })

    const onChangeHander = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true)
            if (curr === "Login") {
                const res = await axios.post(`${USER_API_ENDPOINT}/login`, input, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                });
                if (res?.data?.success) {
                    setInput({
                        email: "",
                        password: ""
                    })
                    navigate("/")
                    dispatch(setUser(res.data.user))
                    toast?.success(res?.data?.message);
                }
            } else {
                const res = await axios.post(`${USER_API_ENDPOINT}/register`, input, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                });

                if (res?.data?.success) {
                    setInput({
                        username: "",
                        email: "",
                        password: ""
                    })
                    navigate("/")
                    dispatch(setUser(res.data.user))
                    toast?.success(res?.data?.message);
                }
            }
        } catch (error) {
            const errorMessage = error?.response?.data?.message || 'An error occurred. Please try again.';
            toast?.error(errorMessage);
        }finally{
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col h-screen w-screen justify-center items-center m-auto overflow-hidden'>
            <div>
                <div className='w-[25%] min-w-[320px] m-auto border p-4'>
                    <h1 className="text-3xl font-bold text-center text-[#0095F6]">InstaLolu</h1>
                    <p className='text-center font-semibold text-gray-500'>Sign up to see photos and videos <br />  from your friends.</p>
                    <form onSubmit={onSubmitHandler} className='flex flex-col gap-3 mt-5'>

                        {
                            curr === "SignUp" ? <input value={input.username} onChange={onChangeHander} type="text" placeholder='Username' name='username' className='border outline-none p-2 text-[15px]' /> : <></>
                        }

                        <input onChange={onChangeHander} value={input.email} type="text" placeholder='Email' name='email' className='border outline-none p-2 text-[15px]' />
                        <input onChange={onChangeHander} value={input.password} type="password" placeholder='Password' name='password' className='border text-[15px] outline-none p-2' />

                        <p className='text-center text-[13px] text-gray-500'>People who use our service may have uploaded <br /> your contact information to Instagram. Learn More</p>
                        <p className='text-center text-[13px] text-gray-500'>By signing up, you agree to our Terms , Privacy Policy and Cookies Policy .</p>
                        <button type='submit' className='p-1 bg-[#0095F6] text-center rounded text-white flex justify-center items-center'>
                            {
                                loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <></>
                            }
                            <span className='ml-2'>{curr}</span>
                        </button>
                    </form>
                </div>
                {
                    curr == "Login"
                        ? <p className='text-center m-auto mt-3 w-[25%] min-w-[320px] p-4 border'>Don't have an account? <span onClick={() => setCurr("SignUp")} className='text-[#0095F6] cursor-pointer'>SingUp</span></p>
                        : <p className='text-center m-auto mt-3 w-[25%] min-w-[320px] p-4 border'>Have an account? <span onClick={() => setCurr("Login")} className='text-[#0095F6] cursor-pointer'>Login</span></p>
                }
            </div>
        </div>
    )
}

export default LoginSignUpPage