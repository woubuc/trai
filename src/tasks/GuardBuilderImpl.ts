import { Guard } from './Guard';
import { GuardBuilder } from './GuardBuilder';
import { TaskFunction, TaskInitialiser } from './Task';
import { BadRequestError } from '..';

export class GuardBuilderImpl<In, State> implements GuardBuilder<In, State> {

	private init ?: TaskInitialiser<any>;

	initialise<S>(init : TaskInitialiser<S>) : GuardBuilder<In, S> {
		this.init = init;
		return this as any;
	}

	run(guard : TaskFunction<In, {}, State>) : Guard<In, State> {
		return {
			initialise: this.init,
			handler: async (ctx, state) => {
				let shouldContinue = await guard(ctx, state);
				if (shouldContinue) return;
				throw new BadRequestError();
			},
		};
	}
}
