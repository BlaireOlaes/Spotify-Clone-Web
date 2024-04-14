import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, Form, Table } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import axios from "../api/axios";
import useAuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import "../css/styles.css";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faPlus, faTrash, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const Album = () => {
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
  const [pic, setpic] = useState();
  const [altitle, setalbumtitle] = useState();
  const navigate = useNavigate();
  const playerRef = useRef();

const [searchTerm, setSearchTerm] = useState('');

const handleSearchChange = (event) => {
  setSearchTerm(event.target.value);
};

const filteredMusics2 = musics.filter(
  (music) =>
    music.user_id === user.id &&
    (music.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (accountsall.find((account) => account.id === music.user_id)?.name || "Unknown Artist").toLowerCase().includes(searchTerm.toLowerCase()))
);

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
        const playlistResponse = await axios.get(`/api/albums/${pid}`);
        const album = playlistResponse.data;
        setalbumtitle(album.album_title);
        setpic(album.image);
        const musicIds = album.music_id;
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
        `/api/albumsupdate/${pid}`,
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
        throw new Error("Failed to update Album");
      }
      fetchPlaylists();
      toast.success("Playlist Successfully Updated", { autoClose: 3000 });
      setShowAddToPlaylist(false);
      fetchPlaylistMusics();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update Album", { autoClose: 3000 });
    }
  };

  const fetchPlaylistMusics = async () => {
    try {
      const playlistResponse = await axios.get(`/api/albums/${pid}`);
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
      const response = await axios.get("/api/albums");
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

      const response = await axios.delete(`/api/albums/${pid}`, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      if (response.status !== 200) {
        throw new Error("Failed to delete Album");
      }

      toast.success("Album Successfully Deleted", { autoClose: 3000 });
      setShowDeleteConfirmation(false);
      navigate("/artist");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete playlAlbumist", { autoClose: 3000 });
    }
  };
  return (
    <div className="display flex">
      <div className="adminPanelStyle">
        <Button onClick={() => navigate("/")} className="custom-buttonmusic1">
          Home
        </Button>
        <Button className="custom-buttonmusic2">Playlist</Button>
        <Button className="custom-buttonmusic3">Podcast</Button>
        <Button className="custom-buttonmusic4">Videocast</Button>
      </div>

      <div className="container mx-auto">
        <ToastContainer />
        <Modal show={showAddToPlaylist} onHide={cancelAddToPlaylist}>
          <Modal.Header closeButton className="Playlist-Modal-Header">
            <Modal.Title>Add to Album</Modal.Title>
          </Modal.Header>
          <Modal.Body className="Playlist-Modal-Body">
            <Form>
              <Form.Group controlId="formPlaylistName">
                <Form.Label>{altitle}</Form.Label>
                <Form.Control type="text" placeholder="Search" value={searchTerm} onChange={handleSearchChange} />
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
                {filteredMusics2.map((music, index) => (
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
            Are you sure you want to delete this Album?
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
          <div className="containerss">
            <img
              src={`http://127.0.0.1:8000/uploads/${pic}`}
              className="img-albm"
            />
            <div className="albumname">
              <h2>{altitle}</h2>
            </div>

            <div className="buttonss">
              <button className="playmusicbtn2" onClick={openAddToPlaylist}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button
                className="playmusicbtn2 ml-3"
                onClick={() => setShowDeleteConfirmation(true)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>

          <div
  className="musicboxcontainer3"
  style={{ overflowY: "auto", maxHeight: "382px" }}
  >
  <Table borderless hover>
    <thead>
      <tr>
        <th className="bok">Music Title</th>
        <th className="bok">Artist</th>
        <th className="bok">Genre</th>
        <th className="bok">Date Uploaded</th>
        <th className="bok">Play</th>
      </tr>
    </thead>
    <tbody>
      {filteredMusics.map((music, index) => (
        <tr key={music.id}>
          <td className="bok">{music.title}</td>
          <td className="bok">
            {accountsall.find((account) => account.id === music.user_id)?.name || "Unknown Artist"}
          </td>
          <td className="bok">{music.genre}</td>
          <td className="bok">
            {new Date(music.created_at).toLocaleDateString("en-US", {
              month: "2-digit",
              day: "2-digit",
              year: "2-digit",
            })}
          </td>
          <td className="bok">
            <Button
              className="playmusicbtn2"
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
              <FontAwesomeIcon icon={isPlaying && currentMusicId === music.id ? "faPause" : "faPlay"} />
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
</div>

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
                    color={isLooping ? "green" : "black"}
                  />
                </button>,
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Album;
