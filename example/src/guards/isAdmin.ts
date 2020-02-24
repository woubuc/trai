import { createGuard } from '../../..';

export const isAdmin = createGuard<{ user : { role : string } }>()
	.run(async ctx => {
		return ctx.user.role === 'admin';
	});
