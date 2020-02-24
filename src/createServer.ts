import { ServerBuilder } from './server/ServerBuilder';
import { ServerBuilderImpl } from './server/ServerBuilderImpl';

export function createServer() : ServerBuilder<{}> {
	return new ServerBuilderImpl<{}>();
}
