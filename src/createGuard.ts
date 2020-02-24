import { GuardBuilder } from './tasks/GuardBuilder';
import { GuardBuilderImpl } from './tasks/GuardBuilderImpl';

export function createGuard<In extends Record<string, any> = {}>() : GuardBuilder<In, {}> {
	return new GuardBuilderImpl();
}
