Feature Nx Pnpm Workspaces

Monorepo support Yes Yes
Build optimization Yes Yes
Code generation Yes No
Plugin ecosystem Yes No
Community support Large&active Small
Learning curve Moderate Moderate
Integration with Good Good

# ---

First of all i think that both are great and i don't have any preference.

We've just started to creating PoCs and the first option was NX.
We are working on a PoC using Workspaces either.
The main idea is to compare them trying to run the same apps in both.

At the moment I can say some things.

The "complexity" is almost the same using one or the other.
NX have some tools that are very useful, like the generators, plugins, cache,
dependency, and others. And it's true that you have to lear to use it.
That might me the "complex" part of NX.

Creating applications inside the monorepo is very easy with NX, those tools that nx have
are very useful and let you to create the apps and libs very fast and with
Workspaces you have to do it by yourself.
For instance, if you want to create an app with NX you just have to run:

```
nx g @nrwl/react:app my-app
```

And this will setup and configure a complete react application with e2e,
unit tests, linting, etc. And you can add really quick other functionalities like
Storybook really really fast and easy. Again all of this things configured and ready to use.
You can do the same with shared libs.

And for Workspace you have to do it by yourself. You have to create the app,
configure the e2e, unit tests, linting, etc. and plug all together.

I think in this part the "complexity" on NX is lower than Workspaces.

Another thing that i was taking a look on NX is the cache.
When you run the build, test, etc. will only run the necessary tasks.
For instances, if you run the build and you didn't change anything on the code
it will not run the build again. It will use the cache. And this is really useful
when you have a lot of apps and libs.
Let suppose that we just change things in the front-end app and we run the build
for all the apps, will only run the build for the front-end app and will use the cache
for the rest of the apps. This will save us time.

As i understand, this is possible with Workspaces or you have to create your own cache
control.

Another thing that i was taking a look on NX is the dependency graph.
You can see the dependency graph of your apps and libs.
This is really useful when you have libs or apps that share code.

Let suppose that you have a lib for i18n or a lib for TS interfaces and the client
and server are using them, if we made some changes on the lib we can see the impact
on the apps. And when we have to build our app, suppose the front-end app,
NX will run the build of the dependency before to run the build of the app.

This is useful to keep your mind working just on your app and not thinking on the
dependencies and also to avoid errors and save time.

If you want this with Workspaces you have to do it by yourself. Create scripts
that runs in the order that you want.

Those are my notes at the moment.
And again i think both are great options.
As a summary of this i think NX as a toolbox with really useful tools and
Workspaces as an empty toolbox that you have to fill with the tools that you want.

The learning curve for both tools is moderate, but Nx has an advantage in terms
of code generation.
