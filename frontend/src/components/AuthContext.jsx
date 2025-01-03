import React, { createContext, useState, useContext, useEffect } from 'react';

// Simple fallback encryption (FOR DEVELOPMENT ONLY)
const fallbackEncrypt = (data) => {
    // Basic Base64 encoding - NOT secure, only for development
    return {
        encrypted: btoa(String(data)),
        iv: 'dummy-iv',
        key: 'dummy-key',
        isFallback: true
    };
};

// Simple fallback decryption (FOR DEVELOPMENT ONLY)
const fallbackDecrypt = (encryptedObj) => {
    if (!encryptedObj) return null;
    if (encryptedObj.isFallback) {
        return atob(encryptedObj.encrypted);
    }
    return null;
};

const encryptData = async (data) => {
    if (!crypto?.subtle) {
        console.warn('Web Crypto API not available - using fallback encryption (Development Only!)');
        return fallbackEncrypt(data);
    }

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
            encoder.encode(String(data))
        );

        const exportedKey = await crypto.subtle.exportKey('raw', key);
        return {
            encrypted: btoa(String.fromCharCode(...new Uint8Array(encrypted))),
            iv: btoa(String.fromCharCode(...iv)),
            key: btoa(String.fromCharCode(...new Uint8Array(exportedKey))),
            isFallback: false
        };
    } catch (error) {
        console.error('Encryption error:', error);
        console.warn('Falling back to basic encryption (Development Only!)');
        return fallbackEncrypt(data);
    }
};

const decryptData = async (encryptedObj) => {
    if (!crypto?.subtle) {
        console.warn('Web Crypto API not available - using fallback decryption (Development Only!)');
        return fallbackDecrypt(encryptedObj);
    }

    if (!encryptedObj) return null;

    // Check if this was encrypted with fallback
    if (encryptedObj.isFallback) {
        return fallbackDecrypt(encryptedObj);
    }

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
        return fallbackDecrypt(encryptedObj);
    }
};


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [barangayId, setBarangayId] = useState(null);

    useEffect(() => {
        const loadEncryptedData = async () => {
            const storedData = localStorage.getItem('barangayId');
            if (storedData) {
                try {
                    const decryptedId = await decryptData(JSON.parse(storedData));
                    if (decryptedId) {
                        setBarangayId(decryptedId);
                    }
                } catch (error) {
                    console.error('Error loading barangay ID:', error);
                }
            }
        };

        loadEncryptedData();
    }, []);

    // Encrypt and store data when barangayId changes
    useEffect(() => {
        const storeEncryptedData = async () => {
            if (barangayId) {
                try {
                    const encryptedData = await encryptData(barangayId);
                    if (encryptedData) {
                        localStorage.setItem('barangayId', JSON.stringify(encryptedData));
                    }
                } catch (error) {
                    console.error('Error storing barangay ID:', error);
                }
            } else {
                localStorage.removeItem('barangayId');
            }
        };

        storeEncryptedData();
    }, [barangayId]);

    return (
        <AuthContext.Provider value={{ barangayId, setBarangayId }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);