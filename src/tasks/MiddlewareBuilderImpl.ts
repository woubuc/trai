import { Middleware } from '../index';
import { MiddlewareBuilder } from './MiddlewareBuilder';
import { TaskFunction, TaskInitialiser } from './Task';

export class MiddlewareBuilderImpl<In, State> implements MiddlewareBuilder<In, State> {

	private init ?: TaskInitialiser<any>;

	initialise<S>(init : TaskInitialiser<S>) : MiddlewareBuilder<In, S> {
		this.init = init;
		return this as any;
	}

	run<Out>(middleware : TaskFunction<In, Out, State>) : Middleware<In, Out, State> {
		return {
			initialise: this.init,
			handler: middleware,
		};
	}
}
