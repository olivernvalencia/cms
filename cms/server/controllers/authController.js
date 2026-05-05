import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';

const salt = 10;

export const register = (req, res) => {
    const { user, password } = req.body;
    const sql = "INSERT INTO cbs_users (`user`, `password`) VALUES (?, ?)";

    bcrypt.hash(password, salt, (err, hash) => {
        if (err) return res.json({ Error: "Error hashing password" });

        const values = [user, hash];
        db.query(sql, values, (err, result) => {
            if (err) return res.json({ Error: "Inserting Data error" });
            return res.json({ Status: "Success" });
        });
    });
};

export const login = (req, res) => {
    const { users, password } = req.body;
    const sql = "CALL getCBSUser(?)";

    db.query(sql, [users], (err, data) => {
        if (err) return res.status(500).json({ Error: "Database error" });

        if (data[0].length > 0) {
            console.log("DB user data:", data[0][0]); // CHECK region_id in terminal
            bcrypt.compare(password.toString(), data[0][0].password, (err, result) => {
                if (err) return res.status(500).json({ Error: "Password Compare Error" });
                if (result) {
                    const token = jwt.sign(
                        { user_data: data[0][0] },
                        "jwt-secret-key",
                        { expiresIn: '1d' }
                    );

                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: false,
                        sameSite: 'Lax',
                        path: '/',
                    });

                    return res.json({
                        Status: "Success",
                        BarangayId: data[0][0].barangay_id,
                        CityId: data[0][0].city_id,
                        ProvinceId: data[0][0].province_id,
                        LguId: data[0][0].lgu_type_id,
                        RoleId: data[0][0].role_id,
                        RegionId: data[0][0].region_id  // ADDED
                    });
                }
                return res.json({ Error: "Invalid password" });
            });
        } else {
            return res.json({ Error: "User not found" });
        }
    });
};

export const logout = (req, res) => {
    res.clearCookie('token', { path: '/' });
    return res.json({ Status: "Success" });
};

export const getHome = (req, res) => {
    console.log("user", req.user_data);
    return res.json({
        Status: 'Success',
        user: req.user_data.user,
        user_id: req.user_data.user_id,
        role: req.user_data.role,
        profile_image: req.user_data.profile_image,
        barangay_id: req.user_data.barangay_id,
        barangay_name: req.user_data.brgy_name,
        barangay_logo: req.user_data.brgy_logo,
        city_id: req.user_data.city_id,
        city_name: req.user_data.city_name,
        city_logo: req.user_data.city_logo,
        province_id: req.user_data.province_id,
        province_name: req.user_data.province_name,
        province_logo: req.user_data.province_logo,
        lgu_type_id: req.user_data.lgu_type_id,
    });
};

export const setCookie = (req, res) => {
    res.cookie('testCookie', 'testValue', {
        httpOnly: true,
        secure: false,
        sameSite: 'Lax',
        path: '/',
    });
    res.send('Cookie has been set');
};

export const getCookie = (req, res) => {
    const testCookie = req.cookies.testCookie;
    res.json({ testCookie });
};