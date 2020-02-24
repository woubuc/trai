import { Middleware } from './Middleware';
import { TaskFunction, TaskInitialiser } from './Task';

export interface MiddlewareBuilder<
	In extends Record<string, any>,
	State extends Record<string, any>
> {
	initialise<S extends Record<string, any>>(init : TaskInitialiser<S>) : MiddlewareBuilder<In, S>;
	run<Out extends Record<string, any>>(middleware : TaskFunction<In, Out, State>) : Middleware<In, Out, State>;
}

