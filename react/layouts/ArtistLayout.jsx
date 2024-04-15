import React, { useState, useEffect, useRef } from "react";
import { Nav, Navbar, Button, Modal, Form, Table } from "react-bootstrap";
import { Navigate, Outlet, Link } from "react-router-dom";
import useAuthContext from "../src/context/AuthContext";
import axios from "../src/api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../src/css/styles.css";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRedo,
  faPlay,
  faPause,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

const AuthLayout = () => {
  const { user, logout } = useAuthContext();
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [musics, setMusics] = useState([]);

  //music player
  const [currentMusicId, setCurrentMusicId] = useState(null);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  const [isLooping, setIsLooping] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [id, setId] = useState(null);
  const navigate = useNavigate();
  const [musicToDelete, setMusicToDelete] = useState(null);
  const [yourMusicSearchTerm, setYourMusicSearchTerm] = useState("");
  const [fileName2, setFileName2] = useState(
    "Drag or Select the Image file here"
  );
  const [file, setFile] = useState(null);
  const [showAlbum, setShowAlbum] = useState(false);
  const [showDeletedAlbums, setShowDeletedAlbums] = useState(false);
  const [showAddToAlbum, setShowAddToAlbum] = useState(false);
  const [newAlbumName, setNewAlbumtName] = useState("");
  const [newAlbumGenre, setNewAlbumGenre] = useState("");
  const [modalSearchTerm, setModalSearchTerm] = useState("");
  const [addingSongIds, setAddingSongIds] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [activeInputIndex, setActiveInputIndex] = useState(0);
  const [genresString, setGenresString] = useState("");
  const [playingIndex, setPlayingIndex] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [genres, setGenres] = useState([]);
  const playerRef = useRef();

  const addMusicInput = () => {
    setFormData([
      ...formData,
      {
        title: "",
        genre: "",
        album: "",
        file: null,
      },
    ]);
  };

  useEffect(() => {
    axios
      .get("/api/genres")
      .then((response) => {
        const genres = response.data.map((genre) => ({
          value: genre.id,
          label: genre.genre_name,
        }));
        setGenres(genres);
      })
      .catch((error) => console.error("Error fetching genres:", error));
  }, []);

  const handleGenreChange = (index, selectedOptions) => {
    // Check if the new selection exceeds the limit
    if (selectedOptions && selectedOptions.length > 5) {
      toast.error("You have reached the max genre"); // Show a toast
      // Remove the last selection
      selectedOptions.pop();
    }

    setFormData((prevState) => {
      const newState = [...prevState];
      newState[index].genre = selectedOptions.map((option) => option.label);
      return newState;
    });
  };

  let filteredYourMusicsData = musics.filter(
    (music) =>
      music.title.toLowerCase().includes(yourMusicSearchTerm.toLowerCase()) ||
      music.genre.toLowerCase().includes(yourMusicSearchTerm.toLowerCase())
  );

  const handleModalSearchChange = (event) => {
    setModalSearchTerm(event.target.value);
  };

  const handleYourMusicSearchChange = (event) => {
    setYourMusicSearchTerm(event.target.value);
  };

  console.log(musics);

  const fetchAlbums = async () => {
    try {
      const response = await axios.get("/api/albums");
      setAlbums(response.data);
    } catch (error) {
      console.error("An error occurred while fetching the albums:", error);
    }
  };

  const filteredMusics = musics.filter(
    (music) =>
      music.title.toLowerCase().includes(modalSearchTerm.toLowerCase()) ||
      music.genre.toLowerCase().includes(modalSearchTerm.toLowerCase())
  );

  const restoreAlbum = async (id) => {
    try {
      const tokenResponse = await axios.get("/api/csrf-token");
      const csrfToken = tokenResponse.data;
      await axios.put(
        `/api/albums/${id}/restore`,
        {},
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        }
      );
      fetchAlbums();
    } catch (error) {
      console.error("An error occurred while restoring the album:", error);
    }
  };

  const permanentlyDeleteAlbum = async (id) => {
    try {
      const tokenResponse = await axios.get("/api/csrf-token");
      const csrfToken = tokenResponse.data;
      await axios.delete(`/api/albums/${id}/force`, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      });
      fetchAlbums(); // Refresh the albums list
    } catch (error) {
      console.error(
        "An error occurred while permanently deleting the album:",
        error
      );
    }
  };

  const fetchMusics = async () => {
    try {
      const response = await axios.get("/api/musics");
      const userMusics = response.data.filter(
        (music) => music.user_id === user.id
      );
      setMusics(userMusics);
    } catch (error) {}
  };

  useEffect(() => {
    fetchMusics();
    fetchAlbums();
  }, []);

  useEffect(() => {
    if (user) {
      setId(user.id);
    }
  }, [user]);

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

  //music player
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
      const currentIndex = musics.findIndex(
        (music) => music.id === currentMusicId
      );
      const nextIndex = (currentIndex + 1) % musics.length;
      const nextMusic = musics[nextIndex];
      if (nextMusic) {
        playMusic(nextMusic, nextIndex);
      }
    }
  };
  const playPrevious = () => {
    if (musics.length > 0) {
      const currentIndex = musics.findIndex(
        (music) => music.id === currentMusicId
      );
      const previousIndex = (currentIndex - 1 + musics.length) % musics.length;
      const previousMusic = musics[previousIndex];
      if (previousMusic) {
        playMusic(previousMusic, previousIndex);
      }
    }
  };

  const toggleLoop = () => {
    setIsLooping(!isLooping);
  };

  const [formData, setFormData] = useState([
    {
      title: "",
      genre: "",
      album: "",
      file: null,
      fileName: "Drag or Select the Mp3 file here",
      musicImage: null, // Add this line
    },
  ]);

  const handleInputChange = (index, event) => {
    const values = [...formData];
    values[index][event.target.name] = event.target.value;
    setFormData(values);
    setActiveInputIndex(index);
  };

  const handleFileChange = (index, files) => {
    const values = [...formData];
    files.forEach((file, i) => {
      if (!values[index + i]) {
        values[index + i] = {};
      }
      // Check if a file already exists in the current form
      if (!values[index + i].file) {
        // If no file exists, add a new form
        values.splice(index + i + 1, 0, {
          title: "",
          genre: "",
          album: "",
          file: null,
          fileName: "Drag or Select the Mp3 file here",
        });
      }
      values[index + i].file = file;
      values[index + i].fileName = file.name;
    });
    setFormData(values);
    setFileUploaded(true);
  };

  const handleRemove = (index) => {
    const newFormData = formData.filter((_, i) => i !== index);
    setFormData(newFormData);
  };

  useEffect(() => {
    if (addingSongIds.length > 0) {
      submitAlbum();
    }
  }, [addingSongIds]);

  const MusicImageDropzone = ({ index }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length > 0) {
          handleImageChange(index, acceptedFiles[0]);
        }
      },
    });

    return (
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        {formData[index].imagePreview ? (
          <img src={formData[index].imagePreview} alt="Music cover" />
        ) : (
          <p>Drag 'n' drop some image here, or click to select image</p>
        )}
      </div>
    );
  };

  const handleImageChange = (index, file) => {
    const values = [...formData];
    values[index].musicImage = file;
    values[index].imagePreview = URL.createObjectURL(file);
    setFormData(values);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUploading(true);
    const validFormData = formData.filter(
      (formItem) => formItem.title && formItem.genre && formItem.file
    );

    if (validFormData.length === 0) {
      toast.error("Add an MP3 file with title and genre", { autoClose: 3000 });
      setIsUploading(false);
      return;
    }

    let album = validFormData[0].album;
    if (!album) {
      album = "No Album";
    }

    const uploadPromises = validFormData.map(async (formItem, i) => {
      const data = new FormData();
      data.append("title", formItem.title);
      data.append("genre", formItem.genre);
      data.append("album", album);
      data.append("file", formItem.file);
      data.append("user_id", user.id);
      data.append("music_image", formItem.musicImage); // Update this line

      try {
        const tokenResponse = await axios.get("/api/csrf-token");
        const csrfToken = tokenResponse.data;

        const response = await axios.post("/api/uploadMusic/", data, {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        });

        if (response.status === 200) {
          return response.data.id;
        } else {
          setIsUploading(false);
          toast.error(`Failed to upload music ${i + 1}`, { autoClose: 3000 });
        }
      } catch (error) {
        setIsUploading(false);
        toast.error(`An error occurred while uploading music ${i + 1}`, {
          autoClose: 3000,
        });
      }
    });

    if (album === "No Album") {
      toast.success("Music Uploaded", { autoClose: 3000 });
      resetInputs();
      fetchMusics();
      setIsUploading(false);
      handleClose();

      setFormData([{ title: "", genre: [], file: null }]);
    } else {
      const uploadedMusicIds = await Promise.all(uploadPromises);
      setAddingSongIds(uploadedMusicIds.filter((id) => id)); // Filter out any undefined values

      const genres = [
        ...new Set(formData.flatMap((formItem) => formItem.genre)),
      ];
      setGenresString(genres.join(", "));

      await fetchMusics();
    }

    // setFileName("Drag or Select the Mp3 file here");
  };

  const deleteMusic = async () => {
    if (musicToDelete) {
      try {
        const tokenResponse = await axios.get("/api/csrf-token");
        const csrfToken = tokenResponse.data;
        await axios.delete(`/api/musics/${musicToDelete}`, {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        });
        toast.success("Music deleted successfully", { autoClose: 3000 });
        fetchMusics();
      } catch (error) {
        toast.error("Error deleting music", { autoClose: 3000 });
      }
    }
    setMusicToDelete(null);
    handleClose();
  };

  const DropzoneInput = ({ index }) => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
        "audio/mpeg": [".mp3"],
      },
      multiple: true,
      onDrop: (acceptedFiles) => {
        if (acceptedFiles.length === 0) {
          toast.error("Upload mp3 file only", { autoClose: 3000 });
        } else {
          handleFileChange(index, acceptedFiles);
        }
      },
    });

    return (
      <div
        {...getRootProps({
          className: "dropzone",
          style: {
            border: "1px dashed gray",
            padding: "10px",
            cursor: "pointer",
          },
        })}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the mp3 file here ...</p>
        ) : (
          <p>
            {formData[index].fileName
              ? formData[index].fileName
              : "Drag or Select the Mp3 file here"}
          </p>
        )}
        <audio
          id={`audio-${index}`}
          onCanPlay={() => {
            if (playingIndex === index) {
              const audioElement = document.getElementById(`audio-${index}`);
              audioElement.play();
            }
          }}
          src={
            formData[index].file instanceof Blob
              ? URL.createObjectURL(formData[index].file)
              : ""
          }
        />
      </div>
    );
  };

  const openAlbum = () => {
    setShowAlbum(true);
  };

  const closeAlbum = () => {
    setShowAlbum(false);
  };

  const openDeletedAlbums = () => {
    setShowAlbum(false);
    setShowDeletedAlbums(true);
  };

  const closeDeletedAlbums = () => {
    setShowDeletedAlbums(false);
  };
  const cancelAddToAlbum = () => {
    setShowAddToAlbum(false);
  };

  const addToAlbum = (songId) => {
    if (addingSongIds.includes(songId)) {
      setAddingSongIds(addingSongIds.filter((id) => id !== songId));
    } else {
      setAddingSongIds([...addingSongIds, songId]);
    }
  };

  const resetInputs = () => {
    setAddingSongIds([]);
    setGenresString("");
    setFileName2("Drag or Select the Image file here");
    setPreviewSrc(null);
    const newFormData = formData.map((item) => ({
      ...item,
      fileName: undefined,
      album: "",
    }));
    setFormData(newFormData);
  };

  const submitAlbum = async () => {
    if (!file) {
      toast.error("Upload an album cover", { autoClose: 3000 });
      setIsUploading(false);
      return;
    }
    setIsUploading(true);
    const album = formData[0].album;
    const data = new FormData();
    data.append("album_title", album);
    data.append("genre", genresString);
    data.append("user_id", user.id);
    addingSongIds.forEach((id, index) => {
      data.append(`music_id[${index}]`, id);
    });
    data.append("image", file);

    // console.log(album, genresString, user.id, addingSongIds, fileName2);

    try {
      const tokenResponse = await axios.get("/api/csrf-token");
      const csrfToken = tokenResponse.data;

      const response = await axios.post("/api/uploadAlbum/", data, {
        headers: {
          "X-CSRF-TOKEN": csrfToken,
        },
      });

      if (response.status === 200) {
        toast.success("Album created successfully", { autoClose: 3000 });
        fetchAlbums();
        setIsUploading(false);
        setShowAddToAlbum(false);
        resetInputs();
        handleClose();
        setFormData([
          {
            title: "",
            genre: [],
            album: "",
            file: null,
            fileName: "Drag or Select the Mp3 file here",
            music_image: null,
          },
        ]);
      } else {
        console.error("An error occurred while creating the album:", response);
        setIsUploading(false);
      }
    } catch (error) {
      console.error("An error occurred while creating the album:", error);
      setIsUploading(false);
    }
  };

  const [previewSrc, setPreviewSrc] = useState(null); // Add this line at the top of your component
  const MyDropzone = () => {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      accept: {
        "image/jpeg": [".jpg", ".jpeg"],
        "image/png": [".png"],
      },
      onDrop: (acceptedFiles, fileRejections) => {
        if (fileRejections.length > 0) {
          toast.error("JPEG and PNG only", { autoClose: 3000 });
        }

        if (acceptedFiles.length > 0) {
          setFileName2(acceptedFiles[0].name);
          setFile(acceptedFiles[0]);
          setPreviewSrc(URL.createObjectURL(acceptedFiles[0])); // Add this line
        }
      },
    });

    return (
      <div
        {...getRootProps()}
        style={{
          padding: "5px",
          border: "2px dashed #888",
          borderRadius: "5px",
          textAlign: "center",
          backgroundColor: isDragActive ? "#eee" : "#fff",
        }}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the Album cover here ...</p>
        ) : (
          <p>{fileName2}</p>
        )}
      </div>
    );
  };
  return (
    <div className="container mx-auto">
      <ToastContainer />
      <Navbar>
        <Navbar.Brand href=""></Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" aria-current="page"></Nav.Link>
          </Nav>
          <Nav>
            <Button variant="light" onClick={logout} className="logout-link">
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Modal
        show={musicToDelete !== null}
        onHide={() => setMusicToDelete(null)}
      >
        <Modal.Header closeButton className="Playlist-Modal-Header">
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this music?</Modal.Body>
        <Modal.Footer>
          <Button
            className="btn-cancel"
            variant="secondary"
            onClick={() => setMusicToDelete(null)}
          >
            Cancel
          </Button>
          <Button
            className="btn-confirm"
            variant="primary"
            onClick={deleteMusic}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="not-verified text-light up">
        <div className="tot"></div>
      </div>

      <div className="not-verified text-light display flex">
        <div className="adminPanelStyle2">
          <h6>Artist Page</h6>
          <Button onClick={() => navigate("/")} className="custom-buttonmusic1">
            Home
          </Button>
          <Button onClick={handleShow} className="custom-buttonmusic2">
            Upload
          </Button>
          <Button onClick={openAlbum} className="custom-buttonmusic3">
            Albums
          </Button>
        </div>

        <div
          className="musicboxcontainer2"
          style={{ overflowY: "auto", maxHeight: "497px" }}
        >
          <div>
            <h4 className="spacingmusic">Your Music</h4>
            <input
              type="text"
              placeholder="Search Music"
              value={yourMusicSearchTerm}
              onChange={handleYourMusicSearchChange}
              className="search-bar"
            />
            <div className="music-container d-flex flex-nowrap overflow-auto">
              {filteredYourMusicsData.map((music, index) => (
                <div className="col-md-3 mb-3 ml-5" key={music.id}>
                  <div className="card h-75% w-75% ">
                    <div className="card-body">
                      <img
                        src={`http://127.0.0.1:8000/uploads/${music.music_image}`}
                        className="music-image"
                      />
                      <p className="card-title">{music.title}</p>
                      <p className="card-text">{music.genre}</p>
                      <p className="card-text">{music.album}</p>
                      {/* <img
                        src={`http://127.0.0.1:8000/uploads/${music.music_image}`}
                      /> */}
                      <p className="card-text">
                        {new Date(music.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "2-digit",
                            day: "2-digit",
                            year: "2-digit",
                          }
                        )}
                      </p>
                      <button
                        className="playmusicbtn mr-2 ml-2"
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
                        <FontAwesomeIcon
                          icon={
                            isPlaying && currentMusicId === music.id
                              ? faPause
                              : faPlay
                          }
                        />
                      </button>
                      <button
                        className="playmusicbtn ml-3"
                        onClick={() => {
                          setMusicToDelete(music.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
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
                    ? musics.find((music) => music.id === currentMusicId).title
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
                color={isLooping ? "#8C0303" : "white"}
              />
            </button>,
          ]}
        />
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="Playlist-Modal-Header" closeButton>
          <Modal.Title>Upload Musics</Modal.Title>
        </Modal.Header>
        <Modal.Body className="Playlist-Modal-Body">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Album Image</Form.Label>
              {previewSrc && <img src={previewSrc} alt="Album cover" />}{" "}
              <MyDropzone />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Album</Form.Label>
              <Form.Control
                className="add-album-searchbar"
                type="text"
                name="album"
                onChange={(event) => handleInputChange(0, event)}
                placeholder="Enter album"
              />
            </Form.Group>

            {formData.map((_, index) => (
              <React.Fragment key={index}>
                <Form.Group className="mb-3">
                  <Form.Label>Music Image</Form.Label>
                  <MusicImageDropzone index={index} />
                  <Form.Label>Music Title</Form.Label>
                  <Form.Control
                    className="add-album-searchbar"
                    type="text"
                    name="title"
                    onChange={(event) => handleInputChange(index, event)}
                    placeholder="Enter Title"
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Music Genre</Form.Label>
                  <Select
                    className="add-album-searchbar"
                    isMulti
                    name="genre"
                    options={genres}
                    onChange={(selectedOptions) =>
                      handleGenreChange(index, selectedOptions)
                    }
                    placeholder="Enter genre"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Upload MP3</Form.Label>
                  <div className="tet">
                    <DropzoneInput index={index} />
                  </div>
                  <div className="containersss">
                    <Button
                      className="btn-confirm"
                      onClick={() => handleRemove(index)}
                      disabled={formData.length === 1}
                    >
                      Remove
                    </Button>
                    <audio
                      id={`audio-${index}`}
                      controls
                      src={
                        formData[index].file instanceof Blob
                          ? URL.createObjectURL(formData[index].file)
                          : ""
                      }
                    >
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </Form.Group>
              </React.Fragment>
            ))}

            <Button
              className="btn-confirm"
              variant="secondary"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              className="btn-confirm"
              type="submit"
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showAlbum} onHide={closeAlbum}>
        <Modal.Header closeButton className="Playlist-Modal-Header">
          <Modal.Title>Your Album</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="bokk">#</th>
                <th className="bokk">Album Title</th>
                <th className="bokk">Genre</th>
                <th className="bokk">Image</th>
              </tr>
            </thead>
            <tbody>
              {albums
                .filter(
                  (album) =>
                    album.user_id === user.id && album.deleted_at === null
                )
                .map((album, index) => (
                  <tr
                    key={album.id}
                    onClick={() => {
                      navigate(`/album/${album.id}`);
                    }}
                  >
                    <td>{index + 1}</td>
                    <td>{album.album_title}</td>
                    <td>{album.genre}</td>
                    <td>
                      <img
                        src={`http://127.0.0.1:8000/uploads/${album.image}`}
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer className="Playlist-Modal-Header1">
          <Button onClick={openDeletedAlbums}>Deleted Albums</Button>
          <Button
            className="btn-cancel"
            variant="secondary"
            onClick={closeAlbum}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDeletedAlbums} onHide={closeDeletedAlbums}>
        <Modal.Header closeButton className="Playlist-Modal-Header">
          <Modal.Title>Deleted Albums</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th className="bokk">#</th>
                <th className="bokk">Album Title</th>
                <th className="bokk">Genre</th>
                <th className="bokk">Image</th>
                <th className="bokk">Actions</th>
              </tr>
            </thead>
            <tbody>
              {albums
                .filter(
                  (album) =>
                    album.user_id === user.id && album.deleted_at !== null
                )
                .map((album, index) => (
                  <tr key={album.id}>
                    <td>{index + 1}</td>
                    <td>{album.album_title}</td>
                    <td>{album.genre}</td>
                    <td>
                      <img
                        src={`http://127.0.0.1:8000/uploads/${album.image}`}
                      />
                    </td>
                    <td>
                      <Button onClick={() => restoreAlbum(album.id)}>
                        Restore
                      </Button>
                      <Button onClick={() => permanentlyDeleteAlbum(album.id)}>
                        Permanent Delete
                      </Button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>

      <Modal show={showAddToAlbum} onHide={cancelAddToAlbum}>
        <Modal.Header closeButton className="Playlist-Modal-Header">
          <Modal.Title>Add New Album</Modal.Title>
        </Modal.Header>
        <Modal.Body className="Playlist-Modal-Body">
          <Form>
            <Form.Group controlId="formPlaylistName">
              <Form.Label>Album Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter album name"
                value={newAlbumName}
                onChange={(e) => setNewAlbumtName(e.target.value)}
              />
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter genre"
                value={newAlbumGenre}
                onChange={(e) => setNewAlbumGenre(e.target.value)}
              />
              <Form.Label>Search Music</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search Music"
                value={modalSearchTerm}
                onChange={handleModalSearchChange}
              />
              <Form.Label>Album Cover</Form.Label>
              <MyDropzone />
            </Form.Group>
          </Form>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Music Title</th>
                <th>Genre</th>
                <th>Add</th>
              </tr>
            </thead>
            <tbody>
              {filteredMusics.map((music, index) => (
                <tr key={music.id}>
                  <td>{music.title}</td>
                  <td>{music.genre}</td>
                  <td>
                    <Button
                      className="btn-confirm"
                      onClick={() => addToAlbum(music.id)}
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
            onClick={cancelAddToAlbum}
          >
            Cancel
          </Button>
          <Button
            className="btn-confirm"
            variant="primary"
            onClick={submitAlbum}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Outlet />
    </div>
  );
};

export default AuthLayout;
