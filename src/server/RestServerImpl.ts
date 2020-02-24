import http, { IncomingMessage, ServerResponse } from 'http';
import findMyWay, { HTTPMethod, HTTPVersion, Instance } from 'find-my-way';

import { BadRequestError, Context, InternalServerError, ResponseError, RestServer, RouteBuilder, Router } from '..';
import { RouterImpl } from '../router/RouterImpl';
import { loadModules } from '../utils/loadModules';
import { RouterBuilder } from '../router/RouterBuilder';
import { ServerOptions } from './ServerOptions';
import { RouteOptions } from '../route/RouteOptions';
import { joinUrl, normaliseUrl } from '../utils/url';

export class RestServerImpl<Data extends Record<string, any>> implements RestServer<Data> {

	private options : ServerOptions;
	private started : boolean = false;

	private mainRouter : Router<Data>;
	private internalRouter : Instance<HTTPVersion.V1>;

	private staticCtx : Record<string, any> = {};

	public constructor(options : ServerOptions) {
		this.options = options;

		this.mainRouter = new RouterImpl<Data>({
			prefix: '',
			middleware: [],
		}, this);

		this.internalRouter = findMyWay({
			caseSensitive: false,
		});
	}

	public log(msg : string) {
		if (this.options.logging) {
			console.log(msg);
		}
	}

	public async start(port : number) : Promise<void> {
		if (this.started) {
			throw new Error('Cannot start server multiple times');
		}

		this.started = true;

		this.log('Intialising plugins...');
		for (let p of this.options.plugins) {
			let plugin = await p;
			Object.assign(this.staticCtx, await plugin.handler(this));
		}

		this.log('Loading routes...');
		for (let dir of this.options.routeDirectories) {
			await loadModules(dir);
		}

		let server = http.createServer(this.routeHandler.bind(this));
		server.listen(port);
		this.log(`Server listening on port ${ port }`);

		this.log(this.internalRouter.prettyPrint());
	}

	private async routeHandler(req : IncomingMessage, res : ServerResponse) {
		res.setHeader('Content-Type', 'application/json');
		res.setHeader('X-Content-Type-Options', 'nosniff');

		res.setHeader('X-DNS-Prefetch-Control', 'off');
		res.setHeader('X-Frame-Options', 'DENY');
		res.setHeader('Strict-Transport-Security', 'max-age=5184000');
		res.setHeader('X-Download-Options', 'noopen');
		res.setHeader('X-Permitted-Cross-Domain-Policies', 'none');
		res.setHeader('X-XSS-Protection', '1; mode=block');

		res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
		res.setHeader('Surrogate-Control', 'no-store');
		res.setHeader('Pragma', 'no-cache');
		res.setHeader('Expires', '0');

		req.url = normaliseUrl(req.url!);

		this.internalRouter.lookup(req, res);
	}

	public addRoute<RouteData, Params>(options : RouteOptions) : void {
		let url = joinUrl(options.url);

		if (!options.handler) {
			throw new Error('Cannot create route without handler');
		}
		let handler = options.handler;

		this.internalRouter.on(options.method, url, async (req, res, params) => {

			try {
				let customStatus = false;
				let ctx : Context & Record<string, any> = {
					url: req.url!,
					params: params,

					get headers() { return req.headers },

					setStatus(status) {
						customStatus = true;
						res.statusCode = status;
					},
					setHeader: (name, value) => res.setHeader(name, value),
				};
				Object.assign(ctx, this.staticCtx);

				if (options.body) {
					await new Promise(resolve => {
						ctx.body = '';
						req.on('data', chunk => ctx.body += chunk.toString());
						req.on('end', () => resolve());
					});
				}

				if (options.params) {
					for (let param of options.params) {
						if (!Object.prototype.hasOwnProperty.call(ctx.params, param)) {
							throw new BadRequestError(); // TODO add proper error handling
						}
					}
				}

				for (let middleware of this.options.middleware) {
					Object.assign(ctx, await middleware.handler(ctx, {}));
				}

				for (let middleware of options.middleware) {
					Object.assign(ctx, await middleware.handler(ctx, {}));
				}

				let response = await handler(ctx);

				if (response === undefined) {
					if (!customStatus) {
						console.warn('Empty body, returning 204 no content response');
						res.statusCode = 204;
					}
					res.end();
				} else {
					if (!customStatus) {
						res.statusCode = 200;
					}
					res.write(JSON.stringify(response));
					res.end();
				}
			} catch (err) {
				if (!(err instanceof ResponseError)) {
					console.error(err);
					err = new InternalServerError();
				}

				res.statusCode = err.status;
				res.write(JSON.stringify({
					error: err.code,
					...err.data,
				}));
				res.end();
			}
		});
	}

	public router() : RouterBuilder<Data> {
		return this.mainRouter.router();
	}

	public route<T>(method : HTTPMethod, url : string) : RouteBuilder<Data> {
		return this.mainRouter.route(method, url);
	}
}
