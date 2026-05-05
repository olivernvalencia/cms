import express from "express";
import {
    getAllBlotters,
    getBlottersById,
    addBlotter,
    addBlotterHearings,
    updateBlotter,
    deleteBlotter,
    getAllBlotterHearing,
    getBlotterHearingById,
    getAllBlotterHearingStatuses,
    deleteBlotterHearings,
    updateBlotterHearing
} from "../controllers/blotterController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/get-hearing-statuses/", verifyUser, getAllBlotterHearingStatuses);
router.get("/get-all-hearing/:id", verifyUser, getAllBlotterHearing);
router.get("/get-hearing/:id", verifyUser, getBlotterHearingById);
router.get("/get/:id", verifyUser, getBlottersById);
router.get("/:id", verifyUser, getAllBlotters);

router.post("/add/blotter-hearings", verifyUser, addBlotterHearings);
router.post("/add", verifyUser, addBlotter);
router.put("/update/hearing/:id", verifyUser, updateBlotterHearing);
router.put("/update/:id", verifyUser, updateBlotter);
router.delete("/delete-hearing/:id", verifyUser, deleteBlotterHearings);
router.delete("/:id", verifyUser, deleteBlotter);


export default router;
