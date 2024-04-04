import React, { useState } from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../context/AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/styles.css";
import { Modal, Button, Form } from "react-bootstrap";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // State to manage button disabled state
  const { register, errors } = useAuthContext();

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!acceptedTerms) {
      setShowTermsModal(true);
      return; // Stop registration process
    }
    setIsButtonDisabled(true); // Disable the button when clicked

    const registerResult = await register({
      name,
      email,
      password,
      password_confirmation,
    });
    if (registerResult.success) {
      toast.success("Registration successful!", { autoClose: 3000 });
    } else {
      if (errors && errors.password) {
        toast.error("Invalid password. Please enter a valid password.", {
          autoClose: 3000,
        });
      } else if (errors && errors.email) {
        toast.error("Email already exists. Please choose a different email.", {
          autoClose: 3000,
        });
      } else {
        toast.error("Please fill all the forms", { autoClose: 3000 });
      }
      setIsButtonDisabled(false); // Re-enable the button on registration failure
    }
  };

  const handleAcceptTerms = () => {
    setAcceptedTerms(true);
    setShowTermsModal(false);
  };

  const handleRejectTerms = () => {
    setShowTermsModal(false);
    setAcceptedTerms(false); // Uncheck the checkbox if terms are rejected
  };

  const handleCheckboxChange = (event) => {
    setAcceptedTerms(event.target.checked);
  };

  return (
    <section
      style={{
        background: "linear-gradient(to top, rgba(0, 0, 0, 20), #290101)",
      }}
    >
      <div className="container mx-auto">
        <ToastContainer />
        <div className="navbar  bg-[#2F0000] p-4 md:p-[10px] mb-[35px] ml-[-115px] w-200px md:w-[95rem]">
          <header className="flex items-center justify-between">
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
                {/* Add any other header content here */}
              </div>
            </div>
          </header>
        </div>

        <div className="-mx-4 flex flex-wrap">
          <div className="w-full px-4">
            <form onSubmit={handleRegister} className="mx-auto max-w-[70%]">
              <div className="mb-4">
                <label
                  className="text-white text-[20px] mb-3 ml-10 block"
                  htmlFor="email"
                >
                  Username
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter Username"
                  className="
                    border-[#4B4B4B]
                    w-full
                    rounded-full
                    border
                    bg-[#2F0000]
                    py-3
                    px-10
                    text-[20px] // Updated font size to 20px
                    placeholder-[#Gray]
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
                  htmlFor="email"
                >
                  Gmail Account
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter Gmail Account"
                  className="
                    border-[#4B4B4B]
                    w-full
                    rounded-full
                    border
                    bg-[#2F0000]
                    py-3
                    px-5
                    text-[20px] // Updated font size to 20px
                    placeholder-[Gray]
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
                  htmlFor="email"
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Password"
                  className="
                    border-[#4B4B4B]
                    w-full
                    rounded-full
                    border
                    bg-[#2F0000]
                    py-3
                    px-5
                    text-[20px] // Updated font size to 20px
                    placeholder-[Gray]
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
                  htmlFor="email"
                >
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={password_confirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Password Confirmation"
                  className="
                    border-[#4B4B4B]
                    w-full
                    rounded-full
                    border
                    bg-[#2F0000]
                    py-3
                    px-5
                    text-[20px] // Updated font size to 20px
                    placeholder-[Gray]
                    outline-none
                    focus:border-primary
                    focus-visible:shadow-none
                    text-white
                    h-[60px]
                  "
                />
              </div>

              <div className="flex justify-center">
                <div className="px-[20px]">
                  <button
                    type="submit"
                    className="
                      sm:w-auto
                      px-40
                      py-3
                      bg-[#8C0303]
                      hover:bg-[Black]
                      rounded-[20px]
                      text-white
                      border-[#FFFFFF] // Updated to have white border
                      text-[15px]
                      font-regular
                    "
                    disabled={isButtonDisabled} // Set disabled state based on isButtonDisabled state
                  >
                    {isButtonDisabled ? 'Signing Up...' : 'Sign Up'} {/* Update button text based on disabled state */}
                  </button>
                </div>
              </div>
            </form>

            <p className="col text-center text-base text-[#adadad]">
              Already have an Account?
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
            <div className="col text-center text-base text-[#adadad]">
              <div className="d-flex align-items-center">
                <Form.Check
                  type="checkbox"
                  id="termsCheckbox"
                  checked={acceptedTerms}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <p
                  onClick={() => setShowTermsModal(true)}
                  className="underline cursor-pointer mb-0"
                >
                  Terms and Conditions
                </p>
              </div>
            </div>

            <div className="w-[100] border-t border-[#313131] my-4"></div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center mt-10">
        <button className="mb-4 flex justify-center items-center bg-[#2F0000] border-[#4B4B4B] border p-2.5 rounded-full text-white mb-2 text-center w-[37%] font-semibold hover:bg-[#7B0404]">
          <img
            src="/src/images/google.png"
            alt="Google"
            className="w-8 h-8 mr-2"
          />
          <span className="ml-1">Continue with Google</span>
        </button>
        <button className="mb-4 flex justify-center items-center bg-[#2F0000] border-[#4B4B4B] border p-2.5 rounded-full text-white mb-2 text-center w-[37%] font-semibold hover:bg-[#7B0404]">
          <img
            src="/src/images/facebook.png"
            alt="Facebook"
            className="w-8 h-8 mr-2"
          />
          <span className="ml-1">Continue with Facebook</span>
        </button>
        <button className="mb-5 flex justify-center items-center bg-[#2F0000] border-[#4B4B4B] border p-2.5 rounded-full text-white text-center w-[37%] font-semibold hover:bg-[#7B0404]">
          <img src="/src/images/apple.png" alt="Apple" className="w-12 h-8" />
          <span className="ml-1">Continue with Apple</span>
        </button>
      </div>

      <Modal show={showTermsModal} onHide={handleRejectTerms} className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>Terms and Conditions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bayot ka? Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleRejectTerms}  className="custom-button2">
            Reject
          </Button>
          <Button variant="secondary" onClick={handleAcceptTerms}  className="custom-button">
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Register;
