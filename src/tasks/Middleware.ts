import { Task } from './Task';

export interface Middleware<
	In extends Record<string, any>,
	Out extends Record<string, any>,
	State extends Record<string, any> = any,
> extends Task<In, Out, State> { }
