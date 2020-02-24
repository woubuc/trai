import { PluginBuilder } from './plugins/PluginBuilder';
import { PluginBuilderImpl } from './plugins/PluginBuilderImpl';

export function createPlugin<In extends Record<string, any> = {}>() : PluginBuilder<In> {
	return new PluginBuilderImpl();
}
