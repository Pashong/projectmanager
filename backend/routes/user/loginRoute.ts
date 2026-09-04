import express from 'express';
import { pool } from '../../database/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailResult = await pool.query(
      `select id,email, password from users where email = $1`,
      [email],
    );
    if (emailResult.rows.length === 0) {
      res.status(400).json({ message: 'No account with this email' });
    }

    const user = emailResult.rows[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      res.status(400).json({ message: 'Email or password is wrong.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: '1D',
      },
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });

    res.json({message: 'Login successful'});
  } catch (error) {}
});

export default router;
