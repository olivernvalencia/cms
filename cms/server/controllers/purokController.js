import db from '../config/database.js';


export const getPhPuroks = (req, res) => {
    const { id } = req.params;
    const sql = "CALL GetPhPuroks(?)";

    db.query(sql,[id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ Error: 'Failed to retrieve purok data' });
        }
        res.json(results);
    });

}

// Controller to execute the stored procedure for inserting puroks
export const insertPuroks = (req, res) => {
    const { p_puroks, p_barangay_id } = req.body;

    console.log("Puroks", req.body);

    // Validate required fields
    if (!p_puroks || !Array.isArray(p_puroks) || p_puroks.length === 0) {
        return res.status(400).json({ Error: 'p_puroks should be a non-empty array' });
    }

    if (!p_barangay_id) {
        return res.status(400).json({ Error: 'p_barangay_id is required' });
    }

    const sql = "CALL AddPhPuroks(?, ?)";

    db.query(sql, [ p_barangay_id, JSON.stringify(p_puroks)], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ Error: 'Failed to insert purok data' });
        }
        res.status(201).json({ Message: 'Purok data inserted successfully', Data: results });
    });
};


export const deletePurok = (req, res) => {
    const {id} = req.params;
    const query = 'CALL DeletePhPurok(?)';

    db.query(query, id, (error, results) => {
        if (error) {
            console.error("Error deleting resident:", error);
            return res.status(500).json({ message: 'Error deleting Purok' });
        }

        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Purok not found' });
        }

        res.status(200).json({ message: 'Purok deleted successfully' });
    });
};
