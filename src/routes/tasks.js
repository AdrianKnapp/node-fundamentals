import { randomUUID } from 'crypto';
import { Database } from "../db/database.js";
import { buildRoutePath } from '../utils/build-route-path.js';

const database = new Database();

const errorMessages = {
  requiredFields: 'Title and description are required.',
  taskNotFound: 'Task id not found.'
}

const tasksRoutes = [{
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const tasks = database.select('tasks');

      return res.end(JSON.stringify(tasks));
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      if (!req?.body?.title || !req?.body?.description) {
        return res.writeHead(400).end(JSON.stringify({
          error: errorMessages.requiredFields
        }));
      }
      
      const {
        title,
        description
      } = req.body;

      
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      database.insert('tasks', task);

      return res.writeHead(201).end();
    }
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      const {
        id
      } = req.params;

      try {
        database.delete('tasks', id);
      } catch(err) {
        return res.writeHead(404).end(JSON.stringify({
          error: errorMessages.taskNotFound
        }));
      }

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req, res) => {
      if (!req?.body?.title || !req?.body?.description) {
        return res.writeHead(400).end(JSON.stringify({
          error: errorMessages.requiredFields
        }));
      }

      const {
        id
      } = req.params;
      
      const {
        title,
        description,
      } = req.body;

      try {
        database.update('tasks', id, {
          title,
          description,
          updated_at: new Date(),
        });
      } catch (error) {
        return res.writeHead(404).end(JSON.stringify({
          error: errorMessages.taskNotFound
        }));
      }

      return res.writeHead(204).end();
    }
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req, res) => {
      const {
        id
      } = req.params;



      try {
        database.update('tasks', id, {
          completed_at: new Date(),
        });
      } catch (err) {
        return res.writeHead(404).end(JSON.stringify({
          error: errorMessages.taskNotFound
        }));
      }

      return res.writeHead(204).end();
    }
  }
];

export default tasksRoutes;