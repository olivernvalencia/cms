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
            //req.user = { user: decoded.user, user_id: decoded.user_id, role: decoded.role, barangay_id: decoded.barangay_id };
            req.user_data = {
                user: decoded.user_data.user, user_id: decoded.user_data.id, role: decoded.user_data.role, profile_image: decoded.user_data.profile_image,
                barangay_id: decoded.user_data.barangay_id, brgy_name: decoded.user_data.brgy_name, brgy_logo: decoded.user_data.brgy_logo,
                city_id: decoded.user_data.city_id, city_name: decoded.user_data.city_name, city_logo: decoded.user_data.city_logo,
                province_id: decoded.user_data.province_id, province_name: decoded.user_data.province_name, province_logo: decoded.user_data.province_logo,
                lgu_type_id: decoded.user_data.lgu_type_id,
            };
            next();
        }
    });
};