import { Route, Routes } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import useAuthContext from "./context/AuthContext";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Superadmin from "./pages/Superadmin";
import Statistic from "./pages/Statistic";
import Artist from "./pages/Artist";
import NotFound from "./pages/NotFound";
import Playlist from "./pages/Playlist";
import Album from "./pages/Album";

import AuthLayout from "../layouts/AuthLayout";
import GuestLayout from "../layouts/GuestLayout";
import SuperAdlayout from "../layouts/SuperAdLayout";
import ArtistLayout from "../layouts/ArtistLayout";

function App() {
  const gradientBackground = {
    background: "linear-gradient(to bottom, #290101, #0C0101)",
    minHeight: "100vh",
  };

  const [loading, setLoading] = useState(true);
  const [isSuperadmin, setIsSuperadmin] = useState(false);
  const [isArtist, setIsArtist] = useState(false);

  const { getUser } = useAuthContext();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        // Only fetch user if it's not already set
        const fetchedUser = await getUser();
        setUser(fetchedUser);

        if (fetchedUser) {
          setIsSuperadmin(fetchedUser.superadmin);
          setIsArtist(fetchedUser.artist);
        }

        setLoading(false);
      }
    };

    fetchUser();
  }, [getUser, user]); // Add user to the dependency array

  if (loading) {
    // You can return a loading indicator here
    return <div>Loading...</div>;
  }

  return (
    <div style={gradientBackground}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/playlist/:pid" element={<Playlist />} />
          <Route path="/album/:pid" element={<Album />} />
        </Route>

        <Route element={<ArtistLayout />}>
          <Route
            path="/artist"
            element={isArtist ? <Artist /> : <Navigate to="/login" />}
          />
        </Route>

        <Route element={<SuperAdlayout />}>
          <Route
            path="/superadmin"
            element={isSuperadmin ? <Superadmin /> : <Navigate to="/login" />}
          />
          <Route
            path="/statistic"
            element={isSuperadmin ? <Statistic /> : <Navigate to="/login" />}
          />
        </Route>

        <Route element={<GuestLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
