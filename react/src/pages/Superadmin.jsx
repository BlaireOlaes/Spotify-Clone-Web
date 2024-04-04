import React, { useEffect, useState } from "react";
import axios from "../api/axios";
import { Button, Tab, Tabs, Dropdown, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Breadcrumb from "react-bootstrap/Breadcrumb";

import {
  faCheck,
  faTimes,
  faCog,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";

function Superadmin() {
  const [accounts, setAccounts] = useState([]);
  const [accountsall, setAccountsall] = useState([]);
  const [error, setError] = useState(null);
  const [buttonHovered, setButtonHovered] = useState(null);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  // Ban account modal
  const [showBanModal, setShowBanModal] = useState(false);
  const [showUnbanModal, setShowUnbanModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // Handle ban button click
  const handleBanClick = (row) => {
    setSelectedRow(row);
    setShowBanModal(true);
  };

  // Handle unban button click
  const handleUnbanClick = (row) => {
    setSelectedRow(row);
    setShowUnbanModal(true);
  };

  // Handle ban account request
  const handleBan = async (id) => {
    try {
      const tokenResponse = await axios.get("/api/csrf-token");
      const csrfToken = tokenResponse.data;

      const response = await axios.post(
        `/api/accountBanned/${id}`,
        {},
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to ban account");
      }

      fetchUsers();
      toast.warning("Account Banned Successfully", { autoClose: 3000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to ban account", { autoClose: 3000 });
    }
    setShowBanModal(false);
  };

  const handleUnban = async (id) => {
    try {
      const tokenResponse = await axios.get("/api/csrf-token");
      const csrfToken = tokenResponse.data;

      const response = await axios.post(
        `/api/accountUnban/${id}`,
        {},
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to unban account");
      }

      fetchUsers();
      toast.success("Account Unbanned Successfully", { autoClose: 3000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to unban account", { autoClose: 3000 });
    }
    setShowUnbanModal(false);
  };

  // Render different modals based on account's banned status
  const renderModal = () => {
    if (!selectedRow) return null;

    if (selectedRow.banned) {
      // If account is banned, show unban modal
      return (
        <Modal show={showUnbanModal} onHide={() => setShowUnbanModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Account Unban</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to unban this account?</Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowUnbanModal(false)}
            >
              No
            </Button>
            <Button
              variant="primary"
              onClick={() => handleUnban(selectedRow.id)}
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      );
    } else {
      // If account is not banned, show ban modal
      return (
        <Modal show={showBanModal} onHide={() => setShowBanModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Account Ban</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to ban this account?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowBanModal(false)}>
              No
            </Button>
            <Button variant="primary" onClick={() => handleBan(selectedRow.id)}>
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
      );
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/accounts");
      setAccounts(response.data);
    } catch (err) {
      setError(err.message);
    }

    try {
      const response = await axios.get("/api/accountsall");
      setAccountsall(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAccept = async (id) => {
    try {
      const tokenResponse = await axios.get("/api/csrf-token");
      const csrfToken = tokenResponse.data;

      const response = await axios.post(
        `/api/acceptArtist/${id}`,
        {},
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to accept artist request");
      }

      fetchUsers();
      toast.success("Artist request accepted!", { autoClose: 3000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to accept artist request", { autoClose: 3000 });
    }
  };

  const handleDecline = async (id) => {
    try {
      const tokenResponse = await axios.get("/api/csrf-token");
      const csrfToken = tokenResponse.data;

      const response = await axios.post(
        `/api/declineArtist/${id}`,
        {},
        {
          headers: {
            "X-CSRF-TOKEN": csrfToken,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error("Failed to decline artist request");
      }

      fetchUsers();
      toast.warning("Artist request declined!", { autoClose: 3000 });
    } catch (error) {
      console.error(error);
      toast.error("Failed to decline artist request", { autoClose: 3000 });
    }
  };

  const getButtonStyle = (button) => {
    return {
      backgroundColor: "transparent",
      color: buttonHovered === button ? "black" : "white",
      border: "none",
      fontSize: "20px",
    };
  };

  const handleButtonHover = (button) => {
    setButtonHovered(button);
  };

  const adminPanelStyle = {
    marginLeft: "-100px",
    background: "#260606",
    width: "400px",
    height: "560px",
    borderRadius: "25px",
    padding: "30px",
    boxSizing: "border-box",
  };

  const columnsRegisteredAccounts = [
    {
      style: {
        color:'White',
        backgroundColor: '#2F0000',
      },
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="backback text-light text-left">{row.name}</div>
      ),
    },
    {
      style: {
        color:'White',
        backgroundColor: '#2F0000',
      },
      name: "Role / Position",
      selector: (row) => row.role,
      sortable: true,
      cell: (row) => (
        <div className="backback text-light text-center">
          {row.superadmin ? "SuperAdmin" : row.artist ? "Artist" : "Listener"}
        </div>
      ),
    },
    {
      style: {
        color:'White',
        backgroundColor: '#2F0000',
      },
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => <div className="backback text-light text-right"></div>,
    },
  ];

  const columnsArtistVerification = [
    {
      style: {
        color:'White',
        backgroundColor: '#2F0000',
      },
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="backback text-light text-left">{row.name}</div>
      ),
    },
    {
      style: {
        color:'White',
        backgroundColor: '#2F0000',
        textAlign: 'center',
      },
      name: "Account Email",
      selector: (row) => row.email,
      sortable: true,
      cell: (row) => <div className="backback text-light">{row.email}</div>,
    },
    {
      style: {
        color:'White',
        backgroundColor: '#2F0000',
      },
      name: "Actions",
      cell: (row) => (
        <div className="backback text-light text-right">
          <Button
            variant="success"
            onClick={() => handleAccept(row.id)}
            style={{ borderRadius: "50%" }}
          >
            <FontAwesomeIcon icon={faCheck} />
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDecline(row.id)}
            style={{ borderRadius: "50%" }}
          >
            <FontAwesomeIcon icon={faTimes} />
          </Button>
        </div>
      ),
    },
  ];

  

  // Filter accounts where artistreq is true
  const filteredArtistAccounts = accountsall.filter(
    (account) => account.artistreq
  );

  // Define columns for User Modification table
  const columnsUserModification = [
    {
      style: {
        color:'White',
        backgroundColor: '#2F0000',
      },
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      cell: (row) => (
        <div className="backback text-light text-left">{row.name}</div>
      ),
    },
    {
      style: {
        color:'White',
        backgroundColor: '#2F0000',
      },
      name: "Status",
      cell: (row) => (
        <div className="backback text-light">
          {row.banned ? "Account Banned" : "Account Normal"}
        </div>
      ),
    },
    {
      style: {
        color:'White',
        backgroundColor: '#2F0000',
      },
      name: "Modification",
      cell: (row) => (
        <Dropdown>
          <Dropdown.Toggle variant="light">
            <FontAwesomeIcon icon={faCog} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {row.banned ? (
              <Dropdown.Item onClick={() => handleUnbanClick(row)}>
                Unban Account
              </Dropdown.Item>
            ) : (
              <Dropdown.Item onClick={() => handleBanClick(row)}>
                Ban Account
              </Dropdown.Item>
            )}
            <Dropdown.Item>N/A</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      ),
    },
  ];

  return (
    <div style={{ display: "flex" }}>
      <ToastContainer />
      <div style={adminPanelStyle}>
        {renderModal()}
        <Breadcrumb>
          <Breadcrumb.Item  href="/statistic"><span style={{ color: 'grey'}} > Dashboard</span></Breadcrumb.Item>
          <Breadcrumb.Item active><span className="bread" >User Management</span></Breadcrumb.Item>
        </Breadcrumb>
        <h2
          style={{ color: "white", marginBottom: "30px", marginLeft: "10px" }}
        >
          Admin Panel
        </h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li style={{ margin: "20px 0" }}>
            <Button
              style={getButtonStyle("Dashboard")}
              onMouseEnter={() => handleButtonHover("Dashboard")}
              onMouseLeave={() => handleButtonHover(null)}
              onClick={() => navigate("/statistic")}
            >
              Dashboard
            </Button>
          </li>
          <li style={{ margin: "20px 0" }}>
            <Button
              style={getButtonStyle("User Management")}
              onMouseEnter={() => handleButtonHover("User Management")}
              onMouseLeave={() => handleButtonHover(null)}
              onClick={() => navigate("/superadmin")}
            >
              User Management
            </Button>
          </li>
          <li style={{ margin: "20px 0" }}>
            <Button
              style={getButtonStyle("Subscription Management")}
              onMouseEnter={() => handleButtonHover("Subscription Management")}
              onMouseLeave={() => handleButtonHover(null)}
            >
              Subscription Management
            </Button>
          </li>
          <li style={{ margin: "20px 0" }}>
            <Button
              style={getButtonStyle("Content Management")}
              onMouseEnter={() => handleButtonHover("Content Management")}
              onMouseLeave={() => handleButtonHover(null)}
            >
              Content Management
            </Button>
          </li>
          <li style={{ margin: "20px 0" }}>
            <Button
              style={getButtonStyle("Security Compliance")}
              onMouseEnter={() => handleButtonHover("Security Compliance")}
              onMouseLeave={() => handleButtonHover(null)}
            >
              Security Compliance
            </Button>
          </li>
        </ul>
      </div>

      <div className="row m-lg-5">
        <Tabs
          defaultActiveKey="1"
          id="custom-tabs"
          className="custom-tabs mb-3"
          style={{ color: "white" }}
          justify
          fill
        >
          <Tab eventKey="1" tabClassName=".cutom-tab" title="Registered Account">
          <input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ backgroundColor: "#1E1E1E", border: "1px solid #ffffff", color: "white", marginBottom: "5px",borderRadius:"5px 5px",fontSize:"15px"}}          
          />            
          <DataTable
              columns={columnsRegisteredAccounts}
              data={accountsall.filter(
                (account) =>
                  account.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  account.email.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              pagination
              highlightOnHover
              striped
              noHeader
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: "#5F0000",
                    color: "white",
                  },
                },
              }}
            />
          </Tab>

          <Tab eventKey="2" title="Artist Verification">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ backgroundColor: "#1E1E1E", border: "1px solid #ffffff", color: "white", marginBottom: "5px",borderRadius:"5px 5px",fontSize:"15px"}}
            />
            <DataTable
              columns={columnsArtistVerification}
              data={filteredArtistAccounts.filter(
                (account) =>
                  account.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  account.email.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              pagination
              highlightOnHover
              striped
              noHeader
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: "#5F0000",
                    color: "white",
                  },
                },
              }}
            />
          </Tab>

          <Tab eventKey="3" title="User Modification">
            <input
              type="text"
              placeholder="Search..."
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ backgroundColor: "#1E1E1E", border: "1px solid #ffffff", color: "white", marginBottom: "5px",borderRadius:"5px 5px",fontSize:"15px"}}
            />
            <DataTable
              columns={columnsUserModification}
              data={accountsall.filter(
                (account) =>
                  account.name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                  account.email.toLowerCase().includes(searchTerm.toLowerCase())
              )}
              pagination
              highlightOnHover
              striped
              noHeader
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: "#5F0000",
                    color: "white",
                  },
                },
              }}
            />
          </Tab>
        </Tabs>
      </div>
    </div>
  );
}

export default Superadmin;
