import jwt, { decode } from 'jsonwebtoken';

export const verifyUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ Error: "Not authorized" });
    }
    jwt.verify(token, "jwt-secret-key", (err, decoded) => {
        if (err) {
            return res.json({ Error: "Token is not okay" });
        } else {
            req.user = { user: decoded.user, user_id: decoded.user_id, role: decoded.role, barangay_id: decoded.barangay_id, profile_image: decoded.profile_image,
                brgy_logo: decoded.brgy_logo, brgy_name: decoded.brgy_name, city_name: decoded.city_name, province_name: decoded.province_name
             };
            next();
        }
    });
};