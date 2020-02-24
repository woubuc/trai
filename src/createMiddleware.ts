import { MiddlewareBuilder } from './tasks/MiddlewareBuilder';
import { MiddlewareBuilderImpl } from './tasks/MiddlewareBuilderImpl';

export function createMiddleware<In extends Record<string, any> = {}>() : MiddlewareBuilder<In, {}> {
	return new MiddlewareBuilderImpl();
}
