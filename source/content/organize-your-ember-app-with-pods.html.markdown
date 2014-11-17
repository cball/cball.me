---
title: Organize Your Ember App with Pods
image: http://cball.me.s3.amazonaws.com/pods.png
date: 2014-11-17 11:25 EST
tags: ember, development
---

---

You may have seen references to pods when reading up on Ember and ember-cli. What the heck are pods? Simply put, pods are a way of grouping files in your project by feature (ex: Task) rather than by type (ex: controllers). According to the ember-cli documentation, “As your app gets bigger, a feature-driven structure may be better. Splitting your application by functionality/resource would give you more power and control to scale and maintain it”.

And the best part? You don’t have to decide to go with this structure right away. Thanks to ember-cli conventions, when a pod structure is specified but the necessary file is not found, the Resolver (how ember-cli looks up files) will fall back to the default naming structure. Let’s look at how use pods, and how this convention will allow us to move an existing app to a pod-based naming structure.

#### Use pods of features for better organization.
By default, a Taco resource might have the following files:

- `app/controllers/taco.js`
- `app/routes/taco.js`
- `app/models/taco.js` 
- `app/templates/taco.hbs`

With a pod-based naming convention, the files would be located at: 

- `app/taco/controller.js`
- `app/taco/route.js`
- `app/taco/model.js`
- `app/taco/template.hbs`

As your application grows, you will end up with lots of controllers, with quite a few of them living under app/controllers. The same goes for templates and routes. While you can always wildcard search your project to open files, it can be really convenient having a route, controller, and template for a resource/feature located under the same directory.


#### Use podModulePrefix to specify the root folder for pods.
podModulePrefix is an optional configuration setting in ember-cli that specifies the root folder for all pods. It can be set in environment.js.

~~~js
// config/environment.js
module.exports = function(environment) {
  var ENV = {
    modulePrefix: 'app',
    podModulePrefix: 'app/pods'
    environment: environment,
    baseURL: '/',
    locationType: 'auto',
//...
~~~

With this in place, we can begin incrementally moving files from the default folder structure into pods. If you don’t specify `podModulePrefix`, the Resolver will look for pods under `app/`.

~~~bash
> mv app/controllers/taco.js app/pods/taco/controller.js
> mv app/routes/taco.js app/pods/taco/route.js
> mv app/templates/taco.hbs app/pods/taco/template.hbs
~~~

Going forward, just pass `--pod` to `ember generate` when generating new files.

~~~bash
> ember g route taco/cheese --pod
  create app/pods/taco/cheese/route.js
  create app/pods/taco/cheese/template.hbs
  create tests/unit/routes/taco/cheese-test.js

> ember g component hot-sauce --pod
  create app/pods/components/hot-sauce/component.js
  create app/pods/components/hot-sauce/template.hbs
  create tests/unit/components/hot-sauce-test.js
~~~

#### To pod or not to pod? It’s up to you.
Using a pod-based folder structure is optional, as is specifying a root folder for pods. Using pods can help keep a large project organized, but if you don’t like it you can still use the default and organize your files by type.

Ember-cli makes it easy to move to a pod-based structure as you have time by falling back to a type-based naming structure if the pod structure is not present.

#### Pods may become the default for Routable Components in Ember 2.0.

While not implemented yet, the current plan in Ember 2.0 is to render a *component* rather than a *controller* when entering a route. This change also advocates using a pod-based structure for these routable components, and may become the default.

See [The Road to Ember 2.0 RFC](https://github.com/emberjs/rfcs/pull/15) for more informatiorn (search for pod).

