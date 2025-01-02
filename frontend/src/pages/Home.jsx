import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";
import Breadcrumbs from "../components/Breadcrumbs";
import DashboardCard from "../components/DashboardCard";
import BlotterList from "../components/BlotterList";
import { useAuth } from '../components/AuthContext';
import cfg from '../../../server/config/config.js';

const Home = () => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [chartData, setChartData] = useState({
        datasets: [
            {
                data: [],
                backgroundColor: ["#0F3D3E", "#8E0553", "#F86151", "#FFBA42"],
                borderWidth: 0,
            },
        ],
    });
    const [totalPopulation, setTotalPopulation] = useState(0);
    const [loading, setLoading] = useState(true);
    const [blotterData, setBlotterData] = useState([]);

    const navigate = useNavigate();
    const { barangayId } = useAuth();
    useEffect(() => {
        axios
            .get("http://" + cfg.domainname + ":8080/blotter/" + barangayId, { withCredentials: true })
            .then((response) => setBlotterData(response.data))
            .catch((error) => {
                console.error("Error fetching blotter data:", error);
                if (error.response) {
                    console.error("Error data:", error.response.data);
                    console.error("Status:", error.response.status);
                    console.error("Headers:", error.response.headers);
                } else {
                    console.error("Error Message:", error.message);
                }
            });
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`http://${cfg.domainname}:8080/home`, {
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
                    `http://${cfg.domainname}:8080/stats/population/` + barangayId,
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
    }, []);

    if (error) return <div>{error}</div>;
    console.log(barangayId);

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
                                        <Doughnut data={chartData} options={{ cutout: "70%" }} />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <p className="text-2xl font-bold text-gray-700">
                                                {totalPopulation || "N/A"}
                                            </p>
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
