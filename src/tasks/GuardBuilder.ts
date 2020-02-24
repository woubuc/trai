import { TaskFunction, TaskInitialiser } from './Task';
import { Guard } from './Guard';

export interface GuardBuilder<
	In extends Record<string, any>,
	State extends Record<string, any>
	> {
	initialise<S extends Record<string, any>>(init : TaskInitialiser<S>) : GuardBuilder<In, S>;
	run<Out extends Record<string, any>>(guard : TaskFunction<In, {}, State>) : Guard<In, State>;
}
