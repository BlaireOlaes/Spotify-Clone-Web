import React from "react";
import { Nav, Navbar, Button } from "react-bootstrap";
import { Navigate, Outlet, Link } from "react-router-dom";
import useAuthContext from "../src/context/AuthContext";
import axios from "../src/api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthLayout = () => {
  const { user, logout } = useAuthContext();

  return (
    <div className="container mx-auto">
      <ToastContainer />

      <Navbar className="navbar  bg-[#2F0000] p-4 md:p-[10px] mb-[35px] ml-[-115px] w-200px md:w-[95rem]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/src/images/spoti.png"
              alt="Logo"
              className="h-16 w-16 md:h-20 md:w-20 ml-20 md:ml-20"
            />
          </div>
        </div>
        <Navbar.Brand
          href=""
          className="text-white"
          style={{ fontSize: "35px" }}
        >
          SpotiTube
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/statistic" aria-current="page"></Nav.Link>
          </Nav>
          <Nav>
            <div className="flex items-center">
              <img
                src="/src/images/profile.png"
                alt="Logo"
                className="rounded-10 bg-white rounded-circle mr-2"
                style={{
                  color: "white",
                  cursor: "Pointer",
                  width: "35px",
                  height: "35px",
                }}
              />

              <img
                src="/src/images/logout.png"
                alt="Logo"
                className="rounded-10 bg-white rounded-circle p-1"
                onClick={logout}
                style={{
                  color: "white",
                  cursor: "Pointer",
                  width: "35px",
                  height: "35px",
                }}
              />
            </div>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Outlet />
    </div>
  );
};

export default AuthLayout;
