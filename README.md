# Trai
Typescript-first server framework

[![npm](https://img.shields.io/npm/v/trai)](https://www.npmjs.com/package/trai)
[![GitHub](https://img.shields.io/github/license/woubuc/trai)](https://github.com/woubuc/trai/blob/master/LICENSE.txt)
[![Dependencies](https://david-dm.org/woubuc/trai/status.svg)](https://david-dm.org/woubuc/trai)

#### Project status
Early development. Not suitable for production use, but feel free to try it out
and give feedback.

## About trai
Most existing Node.JS server frameworks are designed to be used with untyped
Javascript. This means that if you want to add validation, you probably need to
add (1) a validation schema, and (2) a Typescript interface that redefines this
schema for type checking. Most Typescript solutions for this use the dependency
injection pattern and still require rather verbose and often redundant typing.

Trai is a Typescript-first JSON Rest API server framework with two primary goals:

1. A fully typed API that enabled type checking route handlers and logic on
   compile rather than on runtime
2. An easy to use, explicitly typed API that offers the same feature set as Express.

#### Use with Javascript
Trai is designed to be used with Typescript. You can use it with regular Javascript
as well, but there are probably other solutions out there that are a better fit.

## How to use trai
This readme serves as a basic step-by-step tutorial to create a simple server
application. You can find the resulting application in the `example` directory.

Let's start by creating a Typescript project and installing the module.
```sh
yarn add trai
```

Create a server definition file `server.ts`:
```typescript
import { createServer } from 'trai';

export const server = createServer()
  .enableLogging()
  .findRoutes(__dirname + '/routes')
  .create();
```

As you can see, trai relies heavily on the builder pattern. This lets the library
construct flexible and accurate types.

Create a directory `routes` next to your `server.ts` and add your first route in
`routes/hello.ts`:
```typescript
import { server } from '../server';

server.route('GET', '/hello/:name')
  .param('name')
  .handle(async ctx => {
    return {
      hello: ctx.params.name,
    };
  });
```

Lastly, create your application's entrypoint and start the server in `index.ts`:
```typescript
import { server } from './server';

async function main() {
  let port = 8080;
  await server.start(port);
}

main();
```

When you build and run the application, your server will automatically import
every module from the `routes` directory, so you don't need to import those
routes manually. And because the routes extend from the server, they automatically
inherit the correct types from any plugins and middleware you define. Speaking
of which...

### Middleware
A middleware is a function that gets executed on each request, before a route
handler is invoked. Middleware can extend the current request context with
additional data. You can use this for a lot of things: cookie parsing, user
authentication, etc...

Let's create a user middleware in `middleware/user.ts`:
```typescript
import { createMiddleware } from 'trai';

export const userMiddleware = createMiddleware()
  .handle(async ctx => {
    return {
      user: {
        role: 'admin',
      }
    };
  });
```

Next, add it to our server in `server.ts`:
```typescript
import { createServer } from 'trai';
import { userMiddleware } from './middleware/user';

export const server = createServer()
  .enableLogging()
  .findRoutes(__dirname + '/routes')
  .middleware(userMiddleware) // <== Add your middleware
  .create();
```

And add a new route to view our user info in `routes/user.ts`:
```typescript
import { server } from '../server';

server.route('GET', '/user')
  .handle(async ctx => {
    return {
      user: ctx.user,
    };
  });
```

If you're using an IDE with autocomplete/intellisense, you'll notice that it
knows all about the `user` property on `ctx` now that you've added the middleware
to the server.

### Guards
A route guard is a middleware function that doesn't add to a request, but only
indicates whether or not a request is valid. It receives the request context
and simply returns `true` or `false`, indicating whether the request should be
handled or not.

Middlewares and guards will run in the order they are defined, so you can use
the data from an earlier middleware in a route guard.

Let's use our previously created `userMiddleware` and create a route guard to
limit access to a special admin route. First, create a guard in `guards/isAdmin.ts`:
```typescript
import { createGuard } from 'trai';

export const isAdmin = createGuard()
  .handle(async ctx => {
    return ctx.user.role === 'admin';
  });
```

You'll notice that Typescript throws an error here. Since this guard doesn't
extend from the server, it doesn't know about the `user` property that the
`userMiddleware` adds. So we'll need to explicitly specify what properties we
expect `ctx` to have, by adding a generic type to the `createGuard` function:
```typescript
import { createGuard } from 'trai';

export const isAdmin = createGuard<{ user : { role : string } }>()
  .handle(async ctx => {
    return ctx.user.role === 'admin';
  });
```

Now we'll only be able to add this guard to routes that have a `user` property
on their `ctx` that conforms to the generic signature we added.

This generics-based approach allows anyone to make and publish middleware,
guards and plugins for trai while maintaining strict type checking.

Guards can't be set directly on the server, only on routes or routers (see below).
So let's create an admin route with our new guard in `routes/admin.ts`:
```typescript
import { server } from '../server';
import { isAdmin } from '../guards/isAdmin';

server.route('GET', '/admin')
  .guard(isAdmin)
  .handle(async ctx => {
    return {
      status: 'you are an admin',
    };
  });
```

When you visit the `/admin` route, you'll see the status message being returned.
However, watch what happens if you change the `role` to anything else in your
middleware...

### Plugins
A plugin is a function that gets executed once, before the server starts. It has
access to the main server object and it can add global data that will be added to
every request. You can use a plugin for things like creating a database pool that
is accessible from every route handler.

Let's create a plugin to add a `users` map to each request in `plugins/users.ts`:
```typescript
import { createPlugin } from 'trai';

export const usersPlugin = createPlugin(async server => {
	let users = new Map<number, { role : string }>();

	users.set(1, { role: 'admin' });
	users.set(2, { role: 'user' });

	return { users };
});

```

Then add the plugin to the server:
```typescript
import { createServer } from 'trai';
import { userMiddleware } from './middleware/user';
import { usersPlugin } from './plugins/users';

export const server = createServer()
  .enableLogging()
  .findRoutes(__dirname + '/routes')
  .plugin(usersPlugin) // <== Add the plugin
  .middleware(userMiddleware)
  .create();
```

Now every request, middleware and guard will have access to the users map
through `ctx.users`.

Like guards and middleware, plugins are executed in the order they are defined,
but they are executed only once when the server is started.

Now that we have the plugin, we can update our middleware to load the users from
`ctx.users`:
```typescript
import { createMiddleware } from 'trai';

export const userMiddleware = createMiddleware()
  .handle(async ctx => {
    return {
      user: ctx.users.get(1)!,
    };
  });
```

Our middleware has the same problem as our guard earlier: it doesn't know about
the properties set by other plugins and middleware. The solution is the same:
```typescript
import { createMiddleware } from 'trai';

export const userMiddleware = createMiddleware<{ users : Map<number, { role : string }> }>()
  .handle(async ctx => {
    return {
      user: ctx.users.get(1)!,
    };
  });
```

### Routers
If you have a lot of nested routes, you may want to organise those routes by
using a router. This lets you define guards and middleware for a collection of
routes, and it lets you easily add a prefix to all nested routes.

Let's create an admin router for all our admin routes. Move `routes/admin.ts` to
`/routes/admin/admin.ts` and create a new router in `routes/adminRouter.ts`:
```typescript
import { server } from '../server';
import { isAdmin } from '../guards/isAdmin';

export const adminRouter = server.router()
  .prefix('/admin')
  .guard(isAdmin)
  .create();
```

Now we can update our route to use the router and remove the guard in `routes/admin/admin.ts`:
```typescript
import { adminRouter } from '../adminRouter';

adminRouter.route('GET', '/admin')
	.handle(async ctx => {
		return {
			status: 'you are an admin',
		};
	});
```


That covers most of the functionality currently in trai.

If you notice any errors or mistakes in this readme, be sure to file an issue.
