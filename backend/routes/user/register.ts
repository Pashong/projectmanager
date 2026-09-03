import express from 'express';
import { pool } from '../../database/database';
import bcrypt from 'bcrypt';
import { first } from 'rxjs';

const router = express.Router();
const saltRounds = 10;

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, email, password, password_repeated } = req.body;

    if (!firstName || !lastName || !email || !password){
        res.status(400).json({message: "All fields are required"});
    }

    if(password !== password_repeated){
        res.status(400).json({message: "Password do not match!"});
    }

    const emailResult = await pool.query(`select email from users where email = $1`, [email]);
    if(emailResult.rows.length > 1){
        res.status(400).json({message: "Email is already registered"});
    }


    const hashed_password = bcrypt.hash(password, saltRounds);

    const response = await pool.query(
      `insert into users(first_name, last_name, email, password) values ($1,$2,$3,$4)`,
      [firstName, lastName, email, hashed_password],
    );

    res.json({message: "Account successfully registered"});
  } catch (error) {
    console.log("Register error", error);
    res.status(500).json({message: "Something went wrong while registering", details: error});
  }
});

export default router;
