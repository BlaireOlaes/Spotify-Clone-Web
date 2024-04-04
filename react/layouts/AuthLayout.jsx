import React from "react";
import { Nav, Navbar, Button } from "react-bootstrap";
import { useNavigate, Navigate, Outlet, Link } from "react-router-dom";
import useAuthContext from "../src/context/AuthContext";
import axios from "../src/api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthLayout = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthContext();

  const sendVerificationEmail = async () => {
    try {
      const response = await axios.get(
        `/api/sendVerificationEmail/${user?.id}`
      );
      if (response.status !== 204) {
        throw new Error("Failed to send verification email");
      }
      toast.info("Verification email sent!", {
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send verification email", {
        autoClose: 3000,
      });
    }
  };

  const requestArtist = async () => {
    try {
      // Fetch CSRF token
      const tokenResponse = await axios.get("/api/csrf-token");
      const csrfToken = tokenResponse.data;

      // Make POST request with CSRF token in the headers
      const response = await axios.post(
        `/api/requestArtist/${user?.id}`,
        {},
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to send artist request");
      }

      toast.success("Artist request sent!", {
        autoClose: 3000,
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to send artist request", {
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="container mx-auto">
      <ToastContainer />
      <Navbar
        bg="#260606"
        variant="danger"
        className="rounded px-2 py-2.5 sm:px-4"
        style={{ color: "white" }}
      >
        <Navbar.Brand href=""></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" aria-current="page"></Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <Button
                variant="light"
                onClick={logout}
                className="logout-link"
                >
                Logout
              </Button>
            ) : (
              <>

                <Nav.Link as={Link} to="/register" className="register-link">
                  Register
                </Nav.Link>
                <Nav.Link as={Link} to="/login" className="login-link">
                  Login
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {user &&
        (user?.email_verified_at ? (
          <div className="verified">
            <div className="artistreq text-light">
              {user.artist ? (
                <Button
                  variant="success"
                  className="requestbtn"
                  onClick={() => navigate("/artist")}
                >
                  Go to Artist Page
                </Button>
              ) : (
                <Button
                  variant="success"
                  className="requestbtn"
                  onClick={requestArtist}
                >
                  Request to be Artist
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="not-verified text-light">
            <Button
              variant="dark"
              className="requestbtn"
              onClick={sendVerificationEmail}
            >
              Request Verify Account
            </Button>
          </div>
        ))}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
