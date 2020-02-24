import { Plugin, PluginFunction } from './Plugin';
import { PluginBuilder } from './PluginBuilder';

export class PluginBuilderImpl<In> implements PluginBuilder<In> {
	run<Out>(plugin : PluginFunction<In, Out>) : Plugin<In, Out> {
		return {
			handler: plugin,
		};
	}
}
