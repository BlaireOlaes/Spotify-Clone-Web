import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import axios from "../api/axios";
import useAuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import "../css/styles.css";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const Playlist = () => {
  const [musics, setMusics] = useState([]);
  const { user } = useAuthContext();
  const [accountsall, setAccountsall] = useState([]);
  const [currentMusicId, setCurrentMusicId] = useState(null);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [addingSongIds, setAddingSongIds] = useState([]);
  const [playlist, setPlaylists] = useState([]);
  const [id, setId] = useState(null);
  const { pid } = useParams();
  const [filteredMusics, setFilteredMusics] = useState([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const playerRef = useRef();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/accountsall");
        setAccountsall(response.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const response = await axios.get("/api/musics");
        setMusics(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMusics();
  }, []);

  useEffect(() => {
    if (user) {
      setId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const fetchPlaylistMusics = async () => {
      try {
        const playlistResponse = await axios.get(`/api/playlists/${pid}`);
        const playlist = playlistResponse.data;
        const musicIds = playlist.music_id;
        const filtered = musics.filter((music) => musicIds.includes(music.id));
        setFilteredMusics(filtered);
      } catch (error) {
        console.error(error);
      }
    };

    if (pid) {
      fetchPlaylistMusics();
    }
  }, [pid, musics]);

  const [audioUrl, setAudioUrl] = useState("");
  useEffect(() => {
    const fetchMusic = async () => {
      if (currentMusicId) {
        const musicFileUrl = musics.find(
          (music) => music.id === currentMusicId
        ).file;
        const musicFileName = new URL(musicFileUrl).pathname.split("/").pop();
        try {
          const response = await axios.get(`/api/music/${musicFileName}`, {
            responseType: "blob",
          });
          const url = URL.createObjectURL(response.data);
          setAudioUrl(url);
        } catch (err) {
          console.error(err);
        }
      }
    };

    fetchMusic();
  }, [currentMusicId]);

  const playMusic = (music = filteredMusics[0], index = 0) => {
    setCurrentMusicId(music.id);
    setCurrentMusicIndex(index); // Update the current music index
    setIsPlaying(true);

    // Manually start the audio after a short delay to ensure the src has updated
    setTimeout(() => {
      playerRef.current.audio.current.play();
    }, 100);
  };

  const pauseMusic = (index) => {
    setIsPlaying(false);
    setCurrentMusicIndex(index);
    playerRef.current.audio.current.pause(); // Add this line
  };

  const playNext = () => {
    if (filteredMusics.length > 0) {
      const currentIndex = filteredMusics.findIndex(
        (music) => music.id === currentMusicId
      );
      const nextIndex = (currentIndex + 1) % filteredMusics.length;
      const nextMusic = filteredMusics[nextIndex];
      if (nextMusic) {
        playMusic(nextMusic, nextIndex);
      }
    }
  };

  const playPrevious = () => {
    if (filteredMusics.length > 0) {
      const currentIndex = filteredMusics.findIndex(
        (music) => music.id === currentMusicId
      );
      const previousIndex =
        (currentIndex - 1 + filteredMusics.length) % filteredMusics.length;
      const previousMusic = filteredMusics[previousIndex];
      if (previousMusic) {
        playMusic(previousMusic, previousIndex);
      }
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const addToPlaylist = (songId) => {
    if (addingSongIds.includes(songId)) {
      setAddingSongIds(addingSongIds.filter((id) => id !== songId));
    } else {
      setAddingSongIds([...addingSongIds, songId]);
    }
  };

  const cancelAddToPlaylist = () => {
    setShowAddToPlaylist(false);
  };

  const openAddToPlaylist = () => {
    setShowAddToPlaylist(true);
  };

  const submitPlaylist = async (pid) => {
    try {
      const tokenResponse = await axios.get("/api/csrf-token");
      const csrfToken = tokenResponse.data;
      const music_id = Array.isArray(playlist.music_id)
        ? playlist.music_id
        : [];
      const response = await axios.put(
        `/api/playlistsupdate/${pid}`,
        {
          music_id: [...music_id, ...addingSongIds],
        },
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to update playlist");
      }
      fetchPlaylists();
      toast.success("Playlist Successfully Updated", { autoClose: 3000 });
      setShowAddToPlaylist(false);
      fetchPlaylistMusics();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update playlist", { autoClose: 3000 });
    }
  };

  const fetchPlaylistMusics = async () => {
    try {
      const playlistResponse = await axios.get(`/api/playlists/${pid}`);
      const playlist = playlistResponse.data;
      const musicIds = playlist.music_id;
      const filtered = musics.filter((music) => musicIds.includes(music.id));
      setFilteredMusics(filtered);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (pid) {
      fetchPlaylistMusics();
    }
  }, [pid, musics]);

  const fetchPlaylists = async () => {
    try {
      const response = await axios.get("/api/playlistsall");
      if (response.status === 200) {
        setPlaylists(response.data);
      } else {
        throw new Error("Failed to fetch playlists");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deletePlaylist = async () => {
    try {
      const tokenResponse = await axios.get("/api/csrf-token");
      const csrfToken = tokenResponse.data;

      const response = await axios.delete(`/api/playlists/${pid}`, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to delete playlist");
      }

      toast.success("Playlist Successfully Deleted", { autoClose: 3000 });
      setShowDeleteConfirmation(false);
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete playlist", { autoClose: 3000 });
    }
  };
  return (
    <div className="container mx-auto">
      <ToastContainer />
      <Modal show={showAddToPlaylist} onHide={cancelAddToPlaylist}>
        <Modal.Header closeButton className="Playlist-Modal-Header">
          <Modal.Title>Edit this Playlist</Modal.Title>
        </Modal.Header>
        <Modal.Body className="Playlist-Modal-Body">
          <Form>
            <Form.Group controlId="formPlaylistName">
              <Form.Label>Playlist Name</Form.Label>
            </Form.Group>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Music Title</th>
                <th>Artist</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {musics.map((music, index) => (
                <tr key={music.id}>
                  <td>{music.title}</td>
                  <td>
                    {accountsall.find((account) => account.id === music.user_id)
                      ?.name || "Unknown Artist"}
                  </td>
                  <td>
                    <Button
                      className="btn-confirm"
                      onClick={() => addToPlaylist(music.id)}
                    >
                      {addingSongIds.includes(music.id) ? "Cancel" : "Add"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-cancel"
            variant="secondary"
            onClick={cancelAddToPlaylist}
          >
            Cancel
          </Button>
          <Button
            className="btn-confirm"
            variant="primary"
            onClick={() => submitPlaylist(pid)}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
      >
        <Modal.Header closeButton className="Playlist-Modal-Header">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="Playlist-Modal-Body">
          Are you sure you want to delete this playlist?
        </Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-cancel"
            variant="secondary"
            onClick={() => setShowDeleteConfirmation(false)}
          >
            No
          </Button>
          <Button
            className="btn-confirm"
            variant="danger"
            onClick={deletePlaylist}
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>

      <div className="not-verified text-light">
        <Button
          variant="success"
          className="requestbtn"
          onClick={() => navigate("/")}
        >
          Go to Home
        </Button>
        <div className="containerss">
          <h2>Your Music</h2>
          <div className="buttonss">
            <Button className="btn2" onClick={openAddToPlaylist}>
              Add Music
            </Button>
            <Button
              className="btn2"
              onClick={() => setShowDeleteConfirmation(true)}
            >
              Delete this Playlist
            </Button>
          </div>
        </div>

        <Table striped bordered hover>
          <thead>
            <tr></tr>
            <tr>
              <th className="bok">Music Title</th>
              <th className="bok">Artist</th>
              <th className="bok">Genre</th>
              <th className="bok">Time Uploaded</th>
              <th className="bok">Play</th>
            </tr>
          </thead>
          <tbody>
            {filteredMusics.map((music, index) => (
              <tr key={music.id}>
                <td className="bok">{music.title}</td>
                <td className="bok">
                  {accountsall.find((account) => account.id === music.user_id)
                    ?.name || "Unknown Artist"}
                </td>
                <td className="bok">{music.genre}</td>
                <td className="bok">
                  {new Date(music.created_at).toLocaleDateString() +
                    " " +
                    new Date(music.created_at).toLocaleTimeString()}
                </td>

                <td className="bok">
                  {isPlaying && currentMusicId === music.id ? (
                    <Button className="btn-cancel" onClick={pauseMusic}>
                      Pause
                    </Button>
                  ) : (
                    <Button
                      className="btn-cancel"
                      onClick={() => playMusic(music, index)}
                    >
                      Play
                    </Button>
                  )}

                  <Button className="btn-cancel">Remove</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <div className="controler">
          <AudioPlayer
            ref={playerRef}
            autoPlay
            src={audioUrl}
            onPlay={(e) => {
              if (!currentMusicId && musics.length > 0) {
                playMusic(musics[0], 0);
              } else if (!currentMusicId) {
                setIsPlaying(false);
              } else {
                setIsPlaying(true);
              }
            }}
            onPause={(e) => setIsPlaying(false)}
            showSkipControls={true}
            showJumpControls={false}
            header={
              isPlaying
                ? `Now Playing: ${
                    currentMusicId
                      ? musics.find((music) => music.id === currentMusicId)
                          .title
                      : ""
                  }`
                : "Select a Music"
            }
            onClickPrevious={playPrevious}
            onClickNext={playNext}
            onEnded={() => {
              if (isLooping) {
                playMusic(musics[currentMusicIndex], currentMusicIndex);
              } else {
                playNext();
              }
            }}
            key={currentMusicId} // Add this line
            customAdditionalControls={[
              <button onClick={toggleLoop}>
                <FontAwesomeIcon
                  icon={faRedo}
                  color={isLooping ? "green" : "black"}
                />
              </button>,
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default Playlist;
