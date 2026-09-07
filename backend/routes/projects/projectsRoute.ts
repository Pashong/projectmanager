import express from 'express';
import { pool } from '../../database/database';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;

    const result = await pool.query(
      `SELECT project.id, project.title, project.description, project.status, project.deadline,
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
        FROM public.project_users members 
        join public.projects project on members.project_id = project.id
        join public.users users on users.id = members.user_id
        and EXISTS
		(SELECT 1
        FROM public.project_users pu_current_user
        WHERE pu_current_user.project_id = project.id
          AND pu_current_user.user_id = $1)
        group by project.id
        `,
      [userId],
    );

    return res.json({ projects: result.rows });
  } catch (error) {
    console.error('Error getting projects', error);
  }
});

router.get('/:projectId', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const projectId = req.params.projectId;

    const result = await pool.query(
      `SELECT project.id, project.title, project.description, project.status, project.deadline,
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
        FROM public.project_users members 
        join public.projects project on members.project_id = project.id
        join public.users users on users.id = members.user_id
        where project.id = $1
        and 
        EXISTS (SELECT 1
        FROM public.project_users pu_current_user
        WHERE pu_current_user.project_id = project.id
          AND pu_current_user.user_id = $2)
        group by project.id`,
      [projectId, userId],
    );

    return res.json({ project: result.rows[0] });
  } catch (error) {
    console.error('Error getting projects', error);
  }
});

// insert into project_users (project_id, user_id) values ('1', '5');

router.post('/create-project', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    const {
      projectName,
      description,
      status = 'active',
      deadline,
      members = [],
    } = req.body;

    const result = await pool.query(
      `insert into projects (title, description, status, deadline) values ($1,$2,$3,$4) returning id, title, description, status, deadline`,
      [projectName, description, status, deadline],
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

    return res
      .status(200)
      .json({ message: 'Project was created', project: result.rows[0] });
  } catch (error) {
    console.error('Creating a project failed', error);
    res.status(500).json({ message: 'error creating the project' });
  }
});

router.put('/update-status', authenticateToken, async (req, res) => {
  try {
    const { projectId, name, description, status, deadline } = req.body;

    if (!status || !projectId) return;

    const result = await pool.query(
      `update projects set title = $1, description = $2, status = $3, deadline = $4 where id = $5;`,
      [name, description, status, deadline, projectId],
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ message: 'Updating the project status failed' });
    }

    return res.json({ projects: result.rows });
  } catch (error) {
    console.error('Failed to update the status', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.delete('/delete-project/:projectId', async (req, res) => {
  try {
    const projectId = req.params.projectId;

    const result = await pool.query(`delete from projects where id = $1`, [
      projectId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
