import { server } from '../server';

server.route('GET', '/hello/:name')
	.param('name')
	.handle(async ctx => {
		return {
			hello: ctx.params.name,
		};
	});
