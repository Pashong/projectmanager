import express from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { pool } from '../../database/database';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(`select * from tasks where user_id = $1`, [
      userId,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    // muss noch call in frontend machen und service für tasks und ein task model erstellen
    return res
      .status(200)
      .json({ message: 'Tasks loaded', tasks: result.rows });
  } catch (error) {}
});

router.post('/create-task', authenticateToken, async (req, res) => {
  try {
    const {
      projectId,
      name,
      description,
      status = 'active',
      deadline,
      members = [],
    } = req.body;
    const result = await pool.query(
      `insert into tasks (project_id, title, description, status, deadline) values ($1,$2,$3,$4) returning id, project_id, title, description, status, deadline`,
      [projectId, name, description, status, deadline],
    );
    let membersResult = [];
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tasks wasnt created' });
    }

    if (members.length > 0) {
      for (let i = 0; i < members.length; i++) {
        const memberResult = await pool.query(
          'insert into task_user (task_id, user_id) select $1, id from users where id = $2 returning user_id',
          [projectId, req.user?.id],
        );

        membersResult[i] = memberResult.rows;
      }
    }

    return res.status(200).json({
      message: 'Task was created',
      task: result.rows,
      members: membersResult,
    });
  } catch (error) {
    console.error('Task creation failed: ', error);
  }
});

router.delete('/delete-task/:taskId', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const result = await pool.query(`delete from tasks where id = $1`, [
      taskId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tasks was not found' });
    }

    return res.status(200).json({ message: 'Tasks was deleted' });
  } catch (error) {
    console.error('Something went wrong deleting the task', error);
  }
});

router.put('/update-task', authenticateToken, async (req, res) => {
  try {
    const { taskId, name, description, status, deadline } = req.body;

    if (!taskId || !name || !description) {
      return res.status(404).json({ message: 'Not a valid task' });
    }

    const result = await pool.query(`update tasks set title = $1, description =$2, status = $3, deadline = $4 where id = $5`, [
      name,
      description,
      status,
      deadline,
      taskId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task wasnt updated' });
    }

    return res.status(200).json({ message: 'Task was successfully updated', task: result.rows });
  } catch (error) {
    console.error('Couldnt update task', error);
  }
});

export default router;
