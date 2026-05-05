import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import "chart.js/auto";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import DashboardCard from "../components/DashboardCard";
import BlotterList from "../components/BlotterList";
import { useAuth } from '../components/AuthContext';
import cfg from '../../../server/config/domain.js';

ChartJS.register(ArcElement, Tooltip);

const Home = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [hoverData, setHoverData] = useState(null);
    const [chartData, setChartData] = useState({
        labels: ['Male', 'Female', 'Senior Citizens', 'Youth'],
        datasets: [
            {
                data: [/* data */],
                backgroundColor: ["#0F3D3E", "#8E0553", "#F86151", "#FFBA42"],
                borderWidth: 0,
                hoverOffset: 4,
                hoverBorderWidth: 2,
                hoverBorderColor: "#ffffff",
            },
        ],
    });
    const [totalPopulation, setTotalPopulation] = useState(0);
    const [loading, setLoading] = useState(true);
    const [blotterData, setBlotterData] = useState([]);

    const navigate = useNavigate();
    const { barangayId } = useAuth();
    const chartOptions = {
        maintainAspectRatio: false, // Allow responsive resizing
        cutout: "70%",
        plugins: {
            tooltip: {
                enabled: true,
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        const percentage = ((value / totalPopulation) * 100).toFixed(1);
                        return `${context.label}: ${value.toLocaleString()} (${percentage}%)`;
                    },
                },
            },
            legend: {
                display: false,
            },
        },
        onHover: (event, elements) => {
            if (elements && elements.length > 0) {
                const chartElement = elements[0];
                const dataIndex = chartElement.index;
                const value = chartData.datasets[0].data[dataIndex];
                const label = chartData.labels[dataIndex];
                const percentage = ((value / totalPopulation) * 100).toFixed(1);
                setHoverData({ label, value, percentage });
                event.native.target.style.cursor = "pointer";
            } else {
                setHoverData(null);
                event.native.target.style.cursor = "default";
            }
        },
        hover: {
            mode: "nearest",
            intersect: true,
        },
    };

    useEffect(() => {
        axios
            .get(`http://${cfg.domainname}:${cfg.serverport}/blotter/${barangayId}`, { withCredentials: true })
            .then((response) => setBlotterData(response.data))
            .catch((error) => {
                console.error("Error fetching blotter data:", error);
            });
    }, [barangayId]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://${cfg.domainname}:${cfg.serverport}/home`, {
                    withCredentials: true,
                });
                if (response.data.Status === "Success") {
                    setUser(response.data.user);
                } else {
                    setError(response.data.Error || "Not authorized");
                    navigate("/login");
                }
            } catch (err) {
                setError("An error occurred");
            }
        };

        fetchUser();
    }, [navigate]);

    useEffect(() => {
        const fetchPopulationData = async () => {
            try {
                const response = await axios.get(
                    `http://${cfg.domainname}:${cfg.serverport}/stats/population/${barangayId}`,
                    { withCredentials: true }
                );
                const { male, female, seniorCitizens, youth, totalPopulation } =
                    response.data;

                setChartData((prevChartData) => ({
                    ...prevChartData,
                    datasets: [
                        {
                            ...prevChartData.datasets[0],
                            data: [male, female, seniorCitizens, youth],
                        },
                    ],
                }));

                setTotalPopulation(totalPopulation);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching population data:", err);
                setLoading(false);
            }
        };

        fetchPopulationData();
    }, [barangayId]);

    if (error) return <div>{error}</div>;

    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex flex-row flex-grow">
                <Sidebar />
                <main className="flex-grow p-4 bg-gray-100">
                    <div className="flex-grow p-6 bg-gray-100">
                        <Breadcrumbs />
                        <div className="">
                            <DashboardCard />
                        </div>
                        {loading ? (
                            <p>Loading chart data...</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                                <div className="p-4 bg-white rounded-md">
                                    <h3 className="text-gray-500 text-xl font-bold mb-4">
                                        Population Statistics
                                    </h3>
                                    <div
                                        className="relative flex items-center justify-center"
                                        style={{ height: "484px" }}
                                    >
                                        <Doughnut
                                            data={chartData}
                                            options={chartOptions}
                                        />
                                        {/* Overlay with pointer-events: none */}
                                        <div
                                            className="absolute inset-0 flex items-center justify-center"
                                            style={{ pointerEvents: "none" }}
                                        >
                                            {hoverData ? (
                                                <div className="text-center transition-all duration-200">
                                                    <p className="text-2xl font-bold text-gray-700">
                                                        {hoverData.value.toLocaleString()}
                                                    </p>
                                                    <p className="text-lg text-gray-600 font-medium">
                                                        {hoverData.label}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {hoverData.percentage}% of total
                                                    </p>
                                                </div>
                                            ) : (
                                                <div className="text-center">
                                                    <p className="text-2xl font-bold text-gray-700">
                                                        {totalPopulation?.toLocaleString() || "N/A"}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap justify-center mt-4 gap-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="block w-4 h-4 bg-[#0F3D3E]"></span>
                                            <span className="text-sm sm:text-base">Male</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="block w-4 h-4 bg-[#8E0553]"></span>
                                            <span className="text-sm sm:text-base">Female</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="block w-4 h-4 bg-[#F86151]"></span>
                                            <span className="text-sm sm:text-base">Sr. Citizen</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className="block w-4 h-4 bg-[#FFBA42]"></span>
                                            <span className="text-sm sm:text-base">Youth</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Second column with BlotterList */}
                                <BlotterList blotterData={blotterData} />
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Home;