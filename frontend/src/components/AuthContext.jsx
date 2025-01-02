import React, { createContext, useState, useContext, useEffect } from 'react';

const encryptData = async (data) => {
    try {
        const encoder = new TextEncoder();
        const key = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encrypted = await crypto.subtle.encrypt(
            { name: 'AES-GCM', iv: iv },
            key,
            encoder.encode(String(data))  // Ensure data is string
        );

        const exportedKey = await crypto.subtle.exportKey('raw', key);
        return {
            encrypted: btoa(String.fromCharCode.apply(null, new Uint8Array(encrypted))),
            iv: btoa(String.fromCharCode.apply(null, iv)),
            key: btoa(String.fromCharCode.apply(null, new Uint8Array(exportedKey)))
        };
    } catch (error) {
        console.error('Encryption error:', error);
        return null;
    }
};

const decryptData = async (encryptedObj) => {
    if (!encryptedObj) return null;

    try {
        const { encrypted, iv, key } = encryptedObj;

        const encryptedBuffer = new Uint8Array(atob(encrypted).split('').map(char => char.charCodeAt(0)));
        const ivBuffer = new Uint8Array(atob(iv).split('').map(char => char.charCodeAt(0)));
        const keyBuffer = new Uint8Array(atob(key).split('').map(char => char.charCodeAt(0)));

        const importedKey = await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            { name: 'AES-GCM', length: 256 },
            true,
            ['decrypt']
        );

        const decrypted = await crypto.subtle.decrypt(
            { name: 'AES-GCM', iv: ivBuffer },
            importedKey,
            encryptedBuffer
        );

        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (error) {
        console.error('Decryption error:', error);
        return null;
    }
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [barangayId, setBarangayId] = useState(() => {
        // Try to get initial value from localStorage
        const stored = localStorage.getItem('barangayId');
        if (stored) {
            try {
                return JSON.parse(stored)._id || null;
            } catch (e) {
                return null;
            }
        }
        return null;
    });

    // Load encrypted data on mount
    useEffect(() => {
        const loadEncryptedData = async () => {
            const storedData = localStorage.getItem('barangayId');
            if (storedData) {
                try {
                    const parsedData = JSON.parse(storedData);
                    if (parsedData._id) {
                        setBarangayId(parsedData._id);
                    }
                } catch (error) {
                    console.error('Error loading barangay ID:', error);
                }
            }
        };

        loadEncryptedData();
    }, []);

    // Store data whenever barangayId changes
    useEffect(() => {
        const saveData = async () => {
            if (barangayId) {
                try {
                    // Store both encrypted and raw versions
                    const encryptedData = await encryptData(barangayId);
                    const dataToStore = {
                        ...encryptedData,
                        _id: barangayId  // Keep raw ID for immediate access
                    };
                    localStorage.setItem('barangayId', JSON.stringify(dataToStore));
                } catch (error) {
                    console.error('Error saving barangay ID:', error);
                }
            }
        };

        if (barangayId) {
            saveData();
        }
    }, [barangayId]);

    const handleSetBarangayId = (id) => {
        if (id) {
            setBarangayId(id);
            // Also store immediately in localStorage as raw value
            const currentData = localStorage.getItem('barangayId');
            let dataToUpdate = { _id: id };
            if (currentData) {
                try {
                    dataToUpdate = { ...JSON.parse(currentData), _id: id };
                } catch (e) {
                    // If parse fails, just use the new data
                }
            }
            localStorage.setItem('barangayId', JSON.stringify(dataToUpdate));
        }
    };

    const clearBarangayId = () => {
        setBarangayId(null);
        localStorage.removeItem('barangayId');
    };

    return (
        <AuthContext.Provider value={{
            barangayId,
            setBarangayId: handleSetBarangayId,
            clearBarangayId
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};