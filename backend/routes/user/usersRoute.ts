import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { pool } from '../../database/database'

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const result = await pool.query(
      `select * from users
            where exists (select 1 from users where id = $1)`,
      [userId],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'You are not a valid user' });
    }

    return res.status(200).json({message: "Users found", users: result.rows});

  } catch (error) {
    console.error('Getting Users failed', error);
  }
});

export default router;
