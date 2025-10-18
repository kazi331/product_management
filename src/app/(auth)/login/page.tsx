"use client";
import { useLoginMutation } from "@/services/api";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import SocialLogin from "./SocialLogin";

const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
export default function Page() {
  const [email, setEmail] = useState("kazisharif.dev@gmail.com");
  const router = useRouter();
  const [login, { isLoading, isError, isSuccess }] = useLoginMutation();
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValidEmail(email)) return;
    login({ email });
  };
  useEffect(() => {
    if (isSuccess) {
      router.push("/");
    }
  }, [isSuccess]);

  return (
    <div className="bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-screen grid place-items-center">
          <form
            onSubmit={handleLogin}
            className="bg-white flex flex-col w-full md:w-1/2 px-8 py-8 -lg shadow-lg"
          >
            <h2 className="text-gray-900 mb-10 font-bold text-3xl title-font text-center ">
              Login
            </h2>
            <p className="leading-relaxed mb-5 text-gray-600 text-sm ">
              Please enter your email and password to login.
            </p>
            <div className="relative mb-2">
              <label
                htmlFor="email"
                className="leading-7 text-sm text-gray-600"
              >
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-white  border  ${
                  isError ? "border-red-500" : "border-gray-300"
                } focus:border-primary focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out`}
              />
            </div>

            <button
              disabled={isLoading}
              className="text-white bg-primary/90 disabled:bg-primary/80 disabled:cursor-wait border-0 py-2 px-6 focus:outline-none hover:bg-primary  text-lg cursor-pointer mt-4"
            >
              {isLoading ? "Processing..." : "Login"}
            </button>
            <SocialLogin />
            <p className="text-xs text-gray-500 mt-3">
              By logging in, you agree to our Terms of Service and Privacy
              Policy.
            </p>
            <p className="text-xs text-gray-500 mt-3">
              Don't have an account?{" "}
              <a href="/register" className="text-primary hover:underline">
                Register here
              </a>
              .
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
