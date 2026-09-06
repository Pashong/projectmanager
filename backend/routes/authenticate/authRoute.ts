import {Router} from "express";
import { authenticateToken } from "../../middleware/auth.middleware";


const router = Router();

router.get("/me", authenticateToken, (req , res) => {
    res.json({
        user: req.user
    })
});




export default router;