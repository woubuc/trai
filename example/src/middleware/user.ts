import { createMiddleware } from '../../..';

export const userMiddleware = createMiddleware<{ users : Map<number, { role : string }> }>()
	.run(async ctx => {
		return {
			user: ctx.users.get(2)!,
		};
	});
