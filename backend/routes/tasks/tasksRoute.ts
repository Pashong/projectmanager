import express from 'express';
import { authenticateToken } from '../../middleware/auth.middleware';
import { pool } from '../../database/database';

const router = express.Router();



router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `select tasks.*, 
      COALESCE(
        json_agg(
            json_build_object(
                'id', users.id,
                'firstName', users.first_name,
                'lastName', users.last_name,
                'email', users.email
            )
        ) FILTER (WHERE users.id IS NOT NULL),
        '[]'
    ) AS members
      from tasks join task_users tu on tu.task_id = tasks.id 
	  join users on tu.user_id = users.id
    and 
    EXISTS (SELECT 1 from task_users current_tu
    where current_tu.task_id = tasks.id
    AND current_tu.user_id = $1)
	  GROUP BY tasks.id`,
      [userId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    // muss noch call in frontend machen und service für tasks und ein task model erstellen
    return res
      .status(200)
      .json({ message: 'Tasks loaded', tasks: result.rows });
  } catch (error) {
    console.error(error);
  }
});


router.get('/:projectId', authenticateToken, async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.user?.id;

    const result = await pool.query(
      `select tasks.*, 
      COALESCE(
        json_agg(
            json_build_object(
                'id', users.id,
                'firstName', users.first_name,
                'lastName', users.last_name,
                'email', users.email
            )
        ) FILTER (WHERE users.id IS NOT NULL),
        '[]'
    ) AS members
      from tasks join task_users tu on tu.task_id = tasks.id 
	  join users on tu.user_id = users.id
    where project_id = $1
	  GROUP BY tasks.id`,
      [projectId],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No tasks found' });
    }

    // muss noch call in frontend machen und service für tasks und ein task model erstellen
    return res
      .status(200)
      .json({ message: 'Tasks loaded', tasks: result.rows });
  } catch (error) {
    console.error(error);
  }
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
      `insert into tasks (project_id, title, description, status, deadline) values ($1,$2,$3,$4,$5) returning id, title, description, status, deadline`,
      [projectId, name, description, status, deadline],
    );

    let membersResult = [];
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Tasks wasnt created' });
    }

    await pool.query(
      'insert into task_users (task_id, user_id) select $1, id from users where id = $2 returning user_id',
      [result.rows[0].id, req.user?.id],
    );

    if (members.length > 0) {
      for (let i = 0; i < members.length; i++) {
        const memberResult = await pool.query(
          'insert into task_users (task_id, user_id) select $1, id from users where email = $2 returning user_id',
          [result.rows[0].id, members[i]],
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
    const {
      project_id,
      id,
      title,
      description,
      status,
      deadline,
      members,
    } = req.body;

    if (!id || !title || !project_id) {
      return res.status(404).json({ message: 'Not a valid task' });
    }

    const result = await pool.query(
      `update tasks set title = $1,project_id = $2, description =$3, status = $4, deadline = $5 where id = $6 returning id, title, project_id, description, status, deadline`,
      [title, project_id, description, status, deadline, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Task wasnt updated' });
    }

    
    if (members.length > 0) {
      for (let i = 0; i < members.length; i++) {
         await pool.query(
          'insert into task_users (task_id, user_id) values ($1, $2) ON CONFLICT (task_id, user_id) DO NOTHING',
          [id, members[i].id],
        );
      }
    }


      const taskMembersResult = await pool.query(
        `SELECT user_id
    FROM task_users
    WHERE task_id = $1`,
        [id],
      );

    const taskMembers = taskMembersResult.rows.map((row) => row.user_id);

    return res.status(200).json({
      message: 'Task was successfully updated',
      task: result.rows[0],
      members: taskMembers,
    });
  } catch (error) {
    console.error('Couldnt update task', error);
  }
});


router.delete('/remove-user/:taskId/:userId', authenticateToken, async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const userId = req.params.userId;
    const result = await pool.query(`delete from task_users where task_id = $1 and user_id = $2`, [
      taskId, userId
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Tasks was not found' });
    }

    return res.status(200).json({ message: 'User was removed from task' });
  } catch (error) {
    console.error('Something went wrong deleting the task', error);
  }
});



export default router;
