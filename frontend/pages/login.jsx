import { signIn } from "next-auth/react";

const Login = () => {
    return (
        <div className='w-full h-screen flex flex-col items-center justify-center'>
            <div className="flex flex-col items-center mb-8">
                <img src="https://i.ibb.co/2F1r84n/Harmoni-Fi-Logo-Final.png" alt="HarmoniFi Logo" className="h-32 mb-1" />
                <img src="https://i.ibb.co/vz8tmhr/Harmoni-Fi-Typefront.png" alt="HarmoniFi Typeface" className="h-16 mb-1" />
            </div>
            <button className="text-white px-8 py-2 rounded-full bg-purple-500 font-bold text-lg" onClick={() => signIn('spotify', { callbackUrl: "/" })}>Login with HarmoniFi</button>
        </div>
    );
}

export default Login;
