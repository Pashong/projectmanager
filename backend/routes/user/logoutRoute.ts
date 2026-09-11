import {Router} from "express"
import { authenticateToken } from "../../middleware/auth.middleware";

const router = Router();


router.post('/', authenticateToken, (req , res ) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
    })

    return res.status(200).json({message: "Logout successfull"});
});

export default router;