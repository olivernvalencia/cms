import React, { createContext, useState, useContext, useEffect } from 'react';
import { encryptId, decryptId } from '../utils/encryption';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [barangayId, setBarangayId] = useState(null);
    const [cityId, setCityId] = useState(null);
    const [provinceId, setProvinceId] = useState(null);
    const [regionId, setRegionId] = useState(null);
    const [lguId, setLguId] = useState(null);
    const [roleId, setRoleId] = useState(null);

    useEffect(() => {
        const loadEncryptedData = () => {
            const storedBarangayId = localStorage.getItem('barangayId');
            const storedCityId = localStorage.getItem('cityId');
            const storedProvinceId = localStorage.getItem('provinceId');
            const storedRegionId = localStorage.getItem('regionId');
            const storedLguId = localStorage.getItem('lguId');
            const storedRoleId = localStorage.getItem('roleId');

            if (storedBarangayId) {
                try {
                    const decrypted = decryptId(storedBarangayId);
                    if (decrypted) setBarangayId(decrypted);
                } catch (error) {
                    console.error('Error loading barangay ID:', error);
                    alert('Failed to load your session data. Please log in again.');
                }
            }

            if (storedCityId) {
                try {
                    const decrypted = decryptId(storedCityId);
                    if (decrypted) setCityId(decrypted);
                } catch (error) {
                    console.error('Error loading city ID:', error);
                    alert('Failed to load your session data. Please log in again.');
                }
            }

            if (storedProvinceId) {
                try {
                    const decrypted = decryptId(storedProvinceId);
                    if (decrypted) setProvinceId(decrypted);
                } catch (error) {
                    console.error('Error loading province ID:', error);
                    alert('Failed to load your session data. Please log in again.');
                }
            }

            if (storedRegionId) {
                try {
                    const decrypted = decryptId(storedRegionId);
                    if (decrypted) setRegionId(decrypted);
                } catch (error) {
                    console.error('Error loading region ID:', error);
                    alert('Failed to load your session data. Please log in again.');
                }
            }

            if (storedLguId) {
                try {
                    const decrypted = decryptId(storedLguId);
                    if (decrypted) setLguId(decrypted);
                } catch (error) {
                    console.error('Error loading lgu ID:', error);
                    alert('Failed to load your session data. Please log in again.');
                }
            }

            if (storedRoleId) {
                try {
                    const decrypted = decryptId(storedRoleId);
                    if (decrypted) setRoleId(decrypted);
                } catch (error) {
                    console.error('Error loading role ID:', error);
                    alert('Failed to load your session data. Please log in again.');
                }
            }
        };

        loadEncryptedData();
    }, []);

    useEffect(() => {
        const storeEncryptedData = () => {
            if (barangayId) {
                try { localStorage.setItem('barangayId', encryptId(barangayId)); }
                catch (error) { console.error('Error storing barangay ID:', error); }
            } else { localStorage.removeItem('barangayId'); }

            if (cityId) {
                try { localStorage.setItem('cityId', encryptId(cityId)); }
                catch (error) { console.error('Error storing city ID:', error); }
            } else { localStorage.removeItem('cityId'); }

            if (provinceId) {
                try { localStorage.setItem('provinceId', encryptId(provinceId)); }
                catch (error) { console.error('Error storing province ID:', error); }
            } else { localStorage.removeItem('provinceId'); }

            if (regionId) {
                try { localStorage.setItem('regionId', encryptId(regionId)); }
                catch (error) { console.error('Error storing region ID:', error); }
            } else { localStorage.removeItem('regionId'); }

            if (lguId) {
                try { localStorage.setItem('lguId', encryptId(lguId)); }
                catch (error) { console.error('Error storing lgu ID:', error); }
            } else { localStorage.removeItem('lguId'); }

            if (roleId) {
                try { localStorage.setItem('roleId', encryptId(roleId)); }
                catch (error) { console.error('Error storing role ID:', error); }
            } else { localStorage.removeItem('roleId'); }
        };

        storeEncryptedData();
    }, [barangayId, cityId, provinceId, regionId, lguId, roleId]);

    return (
        <AuthContext.Provider value={{ 
            barangayId, setBarangayId, 
            cityId, setCityId, 
            provinceId, setProvinceId,
            regionId, setRegionId,
            lguId, setLguId,
            roleId, setRoleId
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);