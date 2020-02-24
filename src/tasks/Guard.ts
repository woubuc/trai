import { Task } from './Task';

export interface Guard<
	In extends Record<string, any>,
	State extends Record<string, any> = any,
> extends Task<In, {}, State> { }
