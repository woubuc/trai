import { TypedContext } from '../index';

export type TaskInitialiser<State> = () => State | Promise<State>;
export type TaskFunction<In, Out, State> = (ctx : TypedContext<In>, state : State) => Out | Promise<Out>;

export interface Task<
	In extends Record<string, any>,
	Out extends Record<string, any>,
	State extends Record<string, any>,
> {
	initialise ?: TaskInitialiser<State>;
	handler : TaskFunction<In, Out, State>;
}
