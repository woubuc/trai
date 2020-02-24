import { server } from '../server';

server.route('GET', '/user')
	.handle(async ctx => {
		return {
			user: ctx.user,
		};
	});
