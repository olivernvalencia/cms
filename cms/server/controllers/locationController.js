import db from '../config/database.js';

export const getAllRegion = (req, res) => {
    const sql = "SELECT * FROM ph_regions";

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ Error: 'Failed to retrieve region data' });
        }
        res.json(results);
    });
};

export const getAllProvinces = (req, res) => {
    const region_id = req.params.id.replace('${', '').replace('}', '');

    const parsedRegionId = parseInt(region_id, 10);

    if (!parsedRegionId) {
        return res.status(400).json({ error: 'Invalid Region ID' });
    }

    const sql = `
        SELECT iid, iname, icode, region_id, province_logo 
        FROM ph_provinces 
        WHERE region_id = ?
    `;

    db.query(sql, [region_id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to retrieve provinces' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No provinces found for this region' });
        }

        res.json(results);
    });
};

export const getAllCities = (req, res) => {
    const province_id = req.params.id.replace('${', '').replace('}', '');

    const parsedProvinceId = parseInt(province_id, 10);

    if (!parsedProvinceId) {
        return res.status(400).json({ error: 'Invalid Region ID' });
    }

    const sql = `
        SELECT iid, iname, icode, province_id, city_logo 
        FROM ph_cities
        WHERE province_id = ?
    `;

    db.query(sql, [province_id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to retrieve provinces' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No City found for this province' });
        }

        res.json(results);
    });
};

export const getAllBarangay = (req, res) => {
    const city_id = req.params.id.replace('${', '').replace('}', '');

    const parsedCityId = parseInt(city_id, 10);

    if (!parsedCityId) {
        return res.status(400).json({ error: 'Invalid Region ID' });
    }

    const sql = `SELECT iid, iname, icode, city_id, brgy_logo FROM ph_barangays WHERE city_id = ?`;

    db.query(sql, [city_id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to retrieve provinces' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No Barangay found for this city' });
        }

        res.json(results);
    });
}

export const getAllPurok = (req, res) => {
    const barangay_id = req.params.id.replace('${', '').replace('}', '');
    const parsedBarangayId = parseInt(barangay_id, 10);

    if (!parsedBarangayId) {
        return res.status(400).json({ error: 'Invalid Barangay ID' });
    }

    const sql = `SELECT iid, iname, barangay_id FROM ph_puroks WHERE barangay_id = ?`;

    db.query(sql, [barangay_id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Failed to retrieve provinces' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No Purok found for this Barangay' });
        }

        res.json(results);
    });
}