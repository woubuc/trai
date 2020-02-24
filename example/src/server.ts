import { createServer } from '../..';
import { userMiddleware } from './middleware/user';
import { usersPlugin } from './plugins/users';

export const server = createServer()
	.enableLogging()
	.findRoutes(__dirname + '/routes')
	.plugin(usersPlugin)
	.middleware(userMiddleware)
	.create();
