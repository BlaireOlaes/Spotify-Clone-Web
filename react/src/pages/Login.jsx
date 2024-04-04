import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/styles.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to manage button disabled state
  const { login, errors } = useAuthContext();

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsButtonDisabled(true); // Disable the button when clicked
    const loginResult = await login({ email, password });
    if (loginResult.success) {
      toast.success("Login successful!", { autoClose: 3000 });
    } else {
      toast.error("Login Failed: Input Correct Email and Password", {
        autoClose: 3000,
      });
      setIsButtonDisabled(false); // Re-enable the button on login failure
    }
  };

  const styleGap = {
    gap: "50px",
  };

  return (
    <section
      style={{
        background: "linear-gradient(to top, rgba(0, 0, 0, 20), #290101)",
      }}
    >
      <div className="container mx-auto">
        <ToastContainer />
        <nav className="navbar  bg-[#2F0000] p-4 md:p-[10px] mb-[35px] ml-[-115px] w-200px md:w-[95rem]">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                src="/src/images/spoti.png"
                alt="Logo"
                className="h-16 w-16 md:h-20 md:w-20 ml-20 md:ml-20"
              />
              <div className="ml-4">
                <h1 className="text-2xl md:text-3xl font-regular text-white">
                  SpotiTube
                </h1>
              </div>
            </div>
          </div>
        </nav>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <form onSubmit={handleLogin} className="mx-auto max-w-[70%]">
              <div className="mb-4">
                <label
                  className="text-white text-[20px] mb-3 ml-10 block"
                  htmlFor="email"
                >
                  Email or Username
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder=""
                  className="
        border-[#4B4B4B]
        w-full
        rounded-full
        border
        bg-[#2F0000]
        py-3
        px-10
        text-[20px] // Updated font size to 20px
        placeholder-[#White]
        outline-none
        focus:border-primary
        focus-visible:shadow-none
        text-white
        h-[60px]
    "
                />
              </div>
              <div className="mb-4">
                <label
                  className="text-white text-[20px] mb-3 ml-10 block"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder=""
                  required
                  className="
        border-[#4B4B4B]
        w-full
        rounded-full
        border
        bg-[#2F0000]
        py-3
        px-5
        text-[20px] // Updated font size to 20px
        placeholder-[White]
        outline-none
        focus:border-primary
        focus-visible:shadow-none
        text-white
        h-[60px]
    "
                />
              </div>
              <div
                className="mt-10 mb-10 flex justify-content-sm-between px-[30px]"
                style={styleGap}
              >
                <button
                  type="submit"
                  className="
                                        sm:w-[30%]            
                                        px-4
                                        bg-[#8C0303]
                                        hover:bg-[Black]
                                        rounded-[20px]
                                        text-white
                                        border-[#FFFFFF] // Updated to have white border
                                        text-[15px]
                                        font-regular
                                    "
                  disabled={isButtonDisabled} // Set disabled attribute based on state
                >
                  {isButtonDisabled ? "Logging In..." : "Login"}
                </button>
                <Link to="/register" className="w-[30%]">
                  {" "}
                  {/* Updated from button to Link */}
                  <button
                    type="button"
                    className="
                                            sm:w-full
                                            px-4
                                            py-3
                                            bg-[#8C0303]
                                            hover:bg-[Black]
                                            rounded-[20px]
                                            text-white
                                            border-[#FFFFFF] // Updated to have white border
                                            text-[15px]
                                            font-regular
                                        "
                  >
                    Register
                  </button>
                </Link>
              </div>
              <div className="flex items-center mb-7">
                <div className="flex items-center">
                  <input type="checkbox" id="rememberMe" className="mr-2" />
                  <label
                    htmlFor="rememberMe"
                    className="text-white text-1xl font-bold"
                  >
                    Remember me
                  </label>
                </div>
                <Link
                  to="/forgot-password"
                  className="font-bold text-1xl ml-[28%] mt-2 text-[white] hover:text-primary hover:underline mb-2"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="w-[100] border-t border-[#313131] my-4"></div>
              <div className="flex flex-col items-center mt-10">
                <button className="mb-4 flex justify-center items-center bg-[#2F0000] border-[#4B4B4B] border p-2.5 rounded-full text-white mb-2 text-center w-[60%] font-semibold hover:bg-[#7B0404]">
                  <img
                    src="/src/images/google.png"
                    alt="Google"
                    className="w-8 h-8 mr-2"
                  />
                  <span className="ml-1">Continue with Google</span>
                </button>
                <button className="mb-4 flex justify-center items-center bg-[#2F0000] border-[#4B4B4B] border p-2.5 rounded-full text-white mb-2 text-center w-[60%] font-semibold hover:bg-[#7B0404]">
                  <img
                    src="/src/images/facebook.png"
                    alt="Facebook"
                    className="w-8 h-8 mr-2"
                  />
                  <span className="ml-1">Continue with Facebook</span>
                </button>
                <button className="mb-5 flex justify-center items-center bg-[#2F0000] border-[#4B4B4B] border p-2.5 rounded-full text-white text-center w-[60%] font-semibold hover:bg-[#7B0404]">
                  <img
                    src="/src/images/apple.png"
                    alt="Apple"
                    className="w-12 h-8 "
                  />
                  <span className="ml-1">Continue with Apple</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
