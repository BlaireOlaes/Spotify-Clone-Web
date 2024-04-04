import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import axios from "../api/axios";
import useAuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import "../css/styles.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faRandom } from "@fortawesome/free-solid-svg-icons";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const Home = () => {
  const [musics, setMusics] = useState([]);
  const { user } = useAuthContext();
  const [accountsall, setAccountsall] = useState([]);
  const [currentMusicId, setCurrentMusicId] = useState(null);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false); // Added state for shuffle
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [showAddToPlaylist, setShowAddToPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [addingSongIds, setAddingSongIds] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [id, setId] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [modalSearchTerm, setModalSearchTerm] = useState("");

  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10); // Change the number of rows per page as needed
  const [totalRecords, setTotalRecords] = useState(0);

  const playerRef = useRef();

  const handleModalSearchChange = (event) => {
    setModalSearchTerm(event.target.value);
  };

  const searchMusicInModal = (musics, searchTerm) => {
    return musics.filter((music) => {
      const artist =
        accountsall.find((account) => account.id === music.user_id)?.name ||
        "Unknown Artist";
      return (
        music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  let filteredMusics = musics.filter((music) => {
    const artist =
      accountsall.find((account) => account.id === music.user_id)?.name ||
      "Unknown Artist";
    return (
      music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      artist.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
  useEffect(() => {
    const fetchMusics = async () => {
      try {
        const response = await axios.get("/api/musics", {
          params: {
            first,
            rows,
          },
        });
        setMusics(response.data);
        setTotalRecords(response.data.length); // Update total records
      } catch (error) {
        console.error(error);
      }
    };

    fetchMusics();
  }, [first, rows]);

  const fetchPlaylist = async () => {
    try {
      const response = await axios.get("/api/playlistsall");
      setPlaylist(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  useEffect(() => {
    if (user) {
      setId(user.id);
    }
  }, [user]);

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

  const playMusic = (music = musics[0], index = 0) => {
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
    if (musics.length > 0) {
      let nextIndex;
      if (isShuffling) {
        nextIndex = Math.floor(Math.random() * musics.length);
      } else {
        nextIndex = (currentMusicIndex + 1) % musics.length;
      }
      const nextMusic = musics[nextIndex];
      if (nextMusic) {
        playMusic(nextMusic, nextIndex);
      }
    }
  };
  const playPrevious = () => {
    if (musics.length > 0) {
      const previousIndex =
        (currentMusicIndex - 1 + musics.length) % musics.length;
      const previousMusic = musics[previousIndex];
      if (previousMusic) {
        playMusic(previousMusic, previousIndex);
      }
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const toggleShuffle = () => {
    setIsShuffling(!isShuffling);
  };

  const openPlaylist = () => {
    setShowPlaylist(true);
  };

  const closePlaylist = () => {
    setShowPlaylist(false);
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

  const submitPlaylist = async () => {
    try {
      const tokenResponse = await axios.get("/api/csrf-token");
      const csrfToken = tokenResponse.data;
      const response = await axios.post(
        "/api/playlists",
        {
          playlist_title: newPlaylistName,
          user_id: user.id,
          music_id: addingSongIds,
        },
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        }
      );
      if (response.status !== 200) {
        throw new Error("Failed to create playlist");
      }
      setPlaylist((prevPlaylist) => [...prevPlaylist, response.data]);
      setNewPlaylistName("");
      setAddingSongIds([]);
      toast.success("Playlist Successfully Created", { autoClose: 3000 });
      setShowAddToPlaylist(false);
      setShowPlaylist(true);

      setTotalRecords((prevTotalRecords) => prevTotalRecords + 1);

      fetchPlaylist();
    } catch (error) {
      toast.error("Failed to create playlist", { autoClose: 3000 });
    }
  };

  return (
    <div className="display flex">
      <input
        type="text"
        placeholder="Search Music"
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-bar"
      />
      <div className="adminPanelStyle">
        <Button onClick={() => navigate("/")} className="custom-buttonmusic1">
          Home
        </Button>
        <Button onClick={openPlaylist} className="custom-buttonmusic2">
          Playlist
        </Button>
        <Button className="custom-buttonmusic3">Podcast</Button>
        <Button className="custom-buttonmusic4">Videocast</Button>
      </div>

      <div className="container mx-auto">
        <ToastContainer />
        <Modal show={showAddToPlaylist} onHide={cancelAddToPlaylist}>
          <Modal.Header closeButton className="Playlist-Modal-Header">
            <Modal.Title>Add to Playlist</Modal.Title>
          </Modal.Header>
          <Modal.Body className="Playlist-Modal-Body">
            <Form>
              <Form.Group controlId="formPlaylistName">
                <Form.Label>Playlist Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter playlist name"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
                <Form.Label>Search Music</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search Music"
                  value={modalSearchTerm}
                  onChange={handleModalSearchChange}
                />
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
                {searchMusicInModal(musics, modalSearchTerm).map(
                  (music, index) => (
                    <tr key={music.id}>
                      <td>{music.title}</td>
                      <td>
                        {accountsall.find(
                          (account) => account.id === music.user_id
                        )?.name || "Unknown Artist"}
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
                  )
                )}
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
              onClick={submitPlaylist}
            >
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={showPlaylist} onHide={closePlaylist}>
          <Modal.Header closeButton className="Playlist-Modal-Header">
            <Modal.Title>Your Playlist</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th className="bokk">#</th>
                  <th className="bokk">Playlist Title</th>
                </tr>
              </thead>
              <tbody>
                {user && user.id
                  ? playlist
                      .filter(
                        (playlistItem) => playlistItem.user_id === user.id
                      )
                      .map((playlistItem, index) => (
                        <tr
                          key={playlistItem.id}
                          onClick={() => {
                            navigate(`/playlist/${playlistItem.id}`);
                          }}
                        >
                          <td>{index + 1}</td>
                          <td>{playlistItem.playlist_title}</td>
                        </tr>
                      ))
                  : null}
              </tbody>
            </Table>
          </Modal.Body>
          <Modal.Footer className="Playlist-Modal-Header1">
            <Button className="btn-confirm" onClick={openAddToPlaylist}>
              Add to Playlist
            </Button>
            <Button
              className="btn-cancel"
              variant="secondary"
              onClick={closePlaylist}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <div className="not-verified text-light"></div>
        <div className="not-verified text-light">
          <div className="not-verified text-light">
            <div className="search-bar-container">
            </div>

            <div
              className="musicboxcontainer"
              style={{ overflowY: "auto", maxHeight: "455px" }}
            >
              <div>
                <h4 className="spacingmusic">All Music</h4>
                <div className="music-container d-flex flex-nowrap overflow-auto">
                  {filteredMusics.map((music, index) => (
                    <div className="col-md-3 mb-3 ml-5" key={music.id}>
                      <div className="card h-75% w-75%">
                        <div className="card-body">
                          <p className="card-title">{music.title}</p>
                          <p className="card-text">
                            {" "}
                            {accountsall.find(
                              (account) => account.id === music.user_id
                            )?.name || "Unknown Artist"}
                          </p>
                          <Button
                            className="playmusicbtn"
                            onClick={() => {
                              if (music) {
                                if (isPlaying && currentMusicId === music.id) {
                                  pauseMusic(index);
                                } else {
                                  playMusic(music, index);
                                  setIsPlaying(true);
                                }
                              }
                            }}
                          >
                            {isPlaying && currentMusicId === music.id
                              ? "Pause"
                              : "Play"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="spacingmusic">Popular Music</h4>
                <div className="music-container d-flex flex-nowrap overflow-auto">
                  {filteredMusics.map((music, index) => (
                    <div className="col-md-3 mb-3 ml-5" key={music.id}>
                      <div className="card h-75% w-75%">
                        <div className="card-body">
                          <p className="card-title">{music.title}</p>
                          <p className="card-text">
                            {" "}
                            {accountsall.find(
                              (account) => account.id === music.user_id
                            )?.name || "Unknown Artist"}
                          </p>
                          <Button
                            className="playmusicbtn"
                            onClick={() => {
                              if (music) {
                                if (isPlaying && currentMusicId === music.id) {
                                  pauseMusic(index);
                                } else {
                                  playMusic(music, index);
                                  setIsPlaying(true);
                                }
                              }
                            }}
                          >
                            {isPlaying && currentMusicId === music.id
                              ? "Pause"
                              : "Play"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {user && <div className="col-md-3"></div>}

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
                    : "Select Music"
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
                      color={isLooping ? "#8C0303" : "white"}
                    />
                  </button>,
                  <button className="ml-5" onClick={toggleShuffle}>
                    <FontAwesomeIcon
                      icon={faRandom}
                      color={isShuffling ? "#8C0303" : "white"}
                    />
                  </button>,
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
