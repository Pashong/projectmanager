import express from 'express';
import { pool } from '../../database/database';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `SELECT project.id project.title, project.description, project.status, project.deadline, members.user_id
        FROM public.project_users members 
        join public.projects project on members.project_id = project.id
        where members.user_id = $1
        ORDER BY project.deadline
        `,
      [userId],
    );

    return res.json({ projects: result.rows });
  } catch (error) {
    console.log('Error getting projects', error);
  }
});

// insert into project_users (project_id, user_id) values ('1', '5');

router.post('/create-project', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      title,
      description,
      status = 'active',
      deadline,
      members = [],
    } = req.body;

    const result = await pool.query(
      `insert into projects (title, description, status, deadline) values ($1,$2,$3,$4) returning id`,
      [title, description, status, deadline],
    );

    const projectId = result.rows[0].id;

    await pool.query(
      'insert into project_users (project_id, user_id) values ($1,$2)',
      [projectId, userId],
    );

    // unsure if member ids are already known, most likely not but leaving it like this for now need to change it later
    if (members.length > 0) {
      for (let i = 0; i < members.length; i++) {
        await pool.query(
          'insert into project_users (project_id, user_id) select $1, id from users where email = $2',
          [projectId, members[i].email],
        );
      }
    }

    res.status(200).json({message: "Project was created", projectId: projectId});

  } catch (error) {
    console.log('Creating a project failed', error);
    res.status(500).json({ message: 'error creating the project' });
  }
});

router.post('/update-status', authenticateToken, async (req, res) => {
  try {
    const status = req.body.status;
    const projectId = req.body.projectId;

    if (!status || !projectId) return;

    const result = await pool.query(
      `update projects set status = $1 where id = $2;`,
      [status, projectId],
    );

    if(result.rowCount === 0){
        return res.status(404).json({message: "Updating the project status failed"});
    }

    return res.json({ projects: result.rows });
  } catch (error) {
    console.log('Failed to update the status', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/delete-project/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const result = await pool.query(`delete from projects where id = $1`, [projectId]);

    if(result.rowCount === 0){
        return res.status(404).json({message: "Project not found"});
    }

    res.status(200).json({message: "Project deleted", projectId: result.rows[0].id})

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
