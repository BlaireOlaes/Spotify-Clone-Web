import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import Chart from "chart.js/auto";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "react-bootstrap/Breadcrumb";

const Superadmin = () => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Sample chart data
    const lineChartData = {
      labels: ["Jan", "Feb", "March", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Download Count Per Month",
          data: [25, 11, 69, 105, 200, 150],
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          fill: false,
        },
      ],
    };

    // Sample bar chart data
    const barChartData = {
      labels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6"],
      datasets: [
        {
          label: "Daily User Count",
          data: [10, 4, 18, 5, 20, 15],
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };

    // Sample doughnut chart data
    const doughnutChartData = {
      labels: ["Listeners", "Artists"],
      datasets: [
        {
          data: [30, 25],
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
          ],
          hoverOffset: 4,
        },
      ],
    };

    // Get chart contexts
    const lineChartCtx = lineChartRef.current.getContext("2d");
    const barChartCtx = barChartRef.current.getContext("2d");
    const doughnutChartCtx = doughnutChartRef.current.getContext("2d");

    // Create charts
    const lineChart = new Chart(lineChartCtx, {
      type: "line",
      data: lineChartData,
    });

    const barChart = new Chart(barChartCtx, {
      type: "bar",
      data: barChartData,
    });

    const doughnutChart = new Chart(doughnutChartCtx, {
      type: "doughnut",
      data: doughnutChartData,
    });

    // Cleanup functions when the component unmounts
    return () => {
      lineChart.destroy();
      barChart.destroy();
      doughnutChart.destroy();
    };
  }, []); // Empty dependency array to run only once on mount

  const [buttonHovered, setButtonHovered] = useState(null);

  const handleButtonHover = (button) => {
    setButtonHovered(button);
  };

  const getButtonStyle = (button) => {
    return {
      backgroundColor: "transparent",
      color: buttonHovered === button ? "black" : "white",
      border: "none",
      fontSize: "20px",
    };
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

  const mainContentStyle = {
    background: "#260606",
    borderRadius: "25px",
    marginBottom: "20px",
    padding: "20px",
    boxSizing: "border-box",
    color: "white",
    marginLeft: "20px",
  };

  const mainContentStyle2 = {
    background: "#260606",
    borderRadius: "25px",
    marginBottom: "20px",
    padding: "20px",
    boxSizing: "border-box",
    color: "white",
    width: "450px",
    height: "550px",
    marginLeft: "10px",
    textAlign: "center",
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={adminPanelStyle}>
        <Breadcrumb>
          <Breadcrumb.Item href="/statistic" active>
            <span className="bread"></span>
          </Breadcrumb.Item>
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

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px" }}>
        {/* Main Content 1 */}
        <div style={mainContentStyle}>
          <canvas ref={lineChartRef}></canvas>
          {/* Your content for Main Content 1 goes here */}
        </div>

        {/* Main Content 2 */}
        <div style={mainContentStyle}>
          <canvas ref={barChartRef}></canvas>
          {/* Your content for Main Content 2 goes here */}
        </div>
      </div>

      <div style={{ flex: 1, padding: "10px" }}>
        {/* Main Content 3 */}
        <div style={mainContentStyle2}>
          <h2>Currently Active Accounts</h2>
          <canvas ref={doughnutChartRef}></canvas>
          {/* Your content for Main Content 3 goes here */}
        </div>
      </div>
    </div>
  );
};

export default Superadmin;
