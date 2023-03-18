import tasksRoutes from './tasks.js';
import usersRoutes from './users.js';

export const routes = [
  ...usersRoutes,
  ...tasksRoutes,
]