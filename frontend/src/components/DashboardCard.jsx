import React, { useEffect, useState } from 'react';
import { GrGroup } from 'react-icons/gr';
import { BsHouseDoor } from 'react-icons/bs';
import { IoFingerPrint } from 'react-icons/io5';
import { FaRegBuilding } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import Card from './Card';
import cfg from '../../../server/config/config.js';

const DashboardCard = () => {
    const [registeredVoters, setRegisteredVoters] = useState(0);
    const [residentCount, setResidentCount] = useState(0);
    const [householdCount, setHouseholdCount] = useState(0); // Placeholder value
    const [establishmentCount, setEstablishmentCount] = useState(5682); // Placeholder value

    const [displayedVoters, setDisplayedVoters] = useState(0);
    const [displayedResidents, setDisplayedResidents] = useState(0);
    const [displayedHousehold, setDisplayedHousehold] = useState(0);
    const [displayedEstablishment, setDisplayedEstablishment] = useState(0);

    const [loadingVoters, setLoadingVoters] = useState(true);
    const [loadingResidents, setLoadingResidents] = useState(true);
    const [loadingHousehold, setLoadingHousehold] = useState(true);
    const [loadingEstablishment, setLoadingEstablishment] = useState(true);

    const { barangayId } = useAuth();

    const API_URLS = {
        registeredVoters: `http://${cfg.domainname}:${cfg.serverport}/stats/registered-voters/` + barangayId,
        residentCount: `http://${cfg.domainname}:${cfg.serverport}/stats/count/` + barangayId,
        householdCount: `http://${cfg.domainname}:${cfg.serverport}/stats/household/` + barangayId,
    };


    const fetchData = async () => {
        try {
            const [votersResponse, residentsResponse, householdResponse] = await Promise.all([
                fetch(API_URLS.registeredVoters, { credentials: 'include' }),
                fetch(API_URLS.residentCount, { credentials: 'include' }),
                fetch(API_URLS.householdCount, { credentials: 'include' }),
            ]);

            if (votersResponse.ok) {
                const votersData = await votersResponse.json();
                setRegisteredVoters(votersData.NumberOfRegisteredVoters);
            } else {
                console.error('Error fetching registered voters:', await votersResponse.json());
            }

            if (residentsResponse.ok) {
                const residentsData = await residentsResponse.json();
                console.log('Residents Response:', residentsData);
                setResidentCount(residentsData.NumberOfResidents);
            } else {
                const errorData = await residentsResponse.json();
                console.error('Full error response:', errorData);
            }

            if (householdResponse.ok) {
                const householdData = await householdResponse.json();
                console.log('Household Response:', householdData);
                setHouseholdCount(householdData.NumberOfHousehold || 0);
            } else {
                const errorData = await householdResponse.json();
                console.error('Household API Error:', errorData);
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingVoters(false);
            setLoadingResidents(false);
            setLoadingHousehold(false);
            setLoadingEstablishment(false);
        }
    };

    useEffect(() => {
        if (!loadingVoters) {
            const interval = setInterval(() => {
                setDisplayedVoters((prev) => {
                    if (prev < registeredVoters) {
                        return Math.min(prev + Math.ceil(registeredVoters / 100), registeredVoters);
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 20);
            return () => clearInterval(interval);
        }
    }, [registeredVoters, loadingVoters]);

    useEffect(() => {
        if (!loadingResidents) {
            const interval = setInterval(() => {
                setDisplayedResidents((prev) => {
                    if (prev < residentCount) {
                        return Math.min(prev + Math.ceil(residentCount / 100), residentCount);
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 20);
            return () => clearInterval(interval);
        }
    }, [residentCount, loadingResidents]);

    useEffect(() => {
        if (!loadingHousehold) {
            const interval = setInterval(() => {
                setDisplayedHousehold((prev) => {
                    if (prev < householdCount) {
                        return Math.min(prev + Math.ceil(householdCount / 100), householdCount);
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 20);
            return () => clearInterval(interval);
        }
    }, [householdCount, loadingHousehold]);

    useEffect(() => {
        if (!loadingEstablishment) {
            const interval = setInterval(() => {
                setDisplayedEstablishment((prev) => {
                    if (prev < establishmentCount) {
                        return Math.min(prev + Math.ceil(establishmentCount / 100), establishmentCount);
                    } else {
                        clearInterval(interval);
                        return prev;
                    }
                });
            }, 20);
            return () => clearInterval(interval);
        }
    }, [establishmentCount, loadingEstablishment]);

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-x-6 md:gap-y-0'>
            <Card
                icon={<GrGroup className='text-blue-600 w-5 h-5' />}
                title="Statistics"
                count={displayedResidents}
                loading={loadingResidents}
                borderColor="border-blue-500"
                bgColor="rgba(37, 99, 235, 0.1)"
                txtColor="text-blue-600"
                txtContent="Population"
            />
            <Card
                icon={<BsHouseDoor className='text-yellow-600 w-5 h-5' />}
                title="Household"
                count={displayedHousehold}
                loading={loadingHousehold}
                borderColor="border-yellow-500"
                bgColor="rgba(250, 204, 21, 0.1)"
                txtColor="text-yellow-600"
                txtContent="Household"
            />
            <Card
                icon={<FaRegBuilding className='text-green-600 w-5 h-5' />}
                title="Establishment"
                count={displayedEstablishment}
                loading={loadingEstablishment}
                borderColor="border-green-500"
                bgColor="rgba(34, 197, 94, 0.1)"
                txtColor="text-green-600"
                txtContent="Establishments"
            />
            <Card
                icon={<IoFingerPrint className='text-orange-600 w-5 h-5' />}
                title="Registered"
                count={displayedVoters}
                loading={loadingVoters}
                borderColor="border-orange-500"
                bgColor="rgba(251, 146, 60, 0.1)"
                txtColor="text-orange-600"
                txtContent="Active Voters"
            />
        </div>
    );
};

export default DashboardCard;
