import express from "express";
import {
    openAttendence,
    handlePresent,
    provideClasses,
    closeAttendence,
    viewAttendence,
    ongoingAttendence,
} from "../controllers/attendence";
import {
    verifyAccessTokenForStudent,
    verifyAccessTokenForTeacher,
} from "../helpers/jwt_helper";
const router = express.Router();

router
    .route("/openAttendence")
    .patch(verifyAccessTokenForTeacher, openAttendence);
router.route("/present").patch(verifyAccessTokenForStudent, handlePresent);
router.route("/classes").get(verifyAccessTokenForTeacher, provideClasses);
router
    .route("/closeAttendence")
    .patch(verifyAccessTokenForTeacher, closeAttendence);
router
    .route("/ongoingAttendence")
    .get(verifyAccessTokenForStudent, ongoingAttendence);
router
    .route("/viewAttendence")
    .get(verifyAccessTokenForTeacher, viewAttendence);
export default router;
