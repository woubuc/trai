import { server } from '../server';
import { isAdmin } from '../guards/isAdmin';

export const adminRouter = server.router()
	.prefix('/admin')
	.guard(isAdmin)
	.create();
