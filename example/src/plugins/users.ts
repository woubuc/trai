import { createPlugin } from '../../..';

export const usersPlugin = createPlugin()
	.run(async server => {
		let users = new Map<number, { role : string }>();

		users.set(1, { role: 'admin' });
		users.set(2, { role: 'user' });

		return { users };
	});
