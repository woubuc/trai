import { adminRouter } from '../adminRouter';

adminRouter.route('GET', '/admin')
	.handle(async ctx => {
		return {
			status: 'you are an admin',
		};
	});
