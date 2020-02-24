import { Plugin, PluginFunction } from './Plugin';

export interface PluginBuilder<In extends Record<string, any>> {
	run<Out extends Record<string, any>>(plugin : PluginFunction<In, Out>) : Plugin<In, Out>;
}

