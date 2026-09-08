import { Router } from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { pool } from '../../database/database';

const router = Router();

router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `select id, first_name, last_name, email from users where id = $1`,
      [req.user?.id],
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Not a valid user' });
    }

    res.json({
      user: result.rows[0],
    });
  } catch (error) {
    console.error('Failed getting the current user');
  }
});

export default router;
