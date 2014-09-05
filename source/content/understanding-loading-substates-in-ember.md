---
title: Understanding Loading Substates in Ember
date: 2014-09-05 8:50 EDT
image: http://cball.me.s3.amazonaws.com/loading-substates/understanding-loading-substates.jpg
tags: ember
---

---

Ember applications (and client-side applications in general) respond quickly to user interaction. In a perfect world, the API powering your application also responds quickly, but unfortunately most of us don’t live in a perfect world.

Ember has a few different loading behaviors built-in to help us deal with this situation:

- [Nested loading templates](#nested-loading-templates)
- [A loading event in routes](#loading-event)

I’ll also show you how to [use loading templates manually](#manual).

The [guides for loading substates](http://emberjs.com/guides/routing/loading-and-error-substates/) are excellent, so read through those if you haven’t already. Instead of just reiterating what the guides say, I'd like to try to show you visual examples using a real world application.

#### Our example app

Let’s assume we are building a Rdio clone (all Rdio screenshots are copyright them and not me) and we want to add a loading state to each section of the album page.

![rdio UI](http://cball.me.s3.amazonaws.com/loading-substates/1-interface.png)

Our album template is divided into the following sections:

![rdio sections](http://cball.me.s3.amazonaws.com/loading-substates/2-template-sections.png)

Here’s what our router and models might look like:

~~~javascript
// router.js
App.Router.map(function() {
  this.resource('album', { path: '/album/:album_id'}, function() {
    this.resource('activities', function() {});
    this.resource('reviews', function() {});
  });
});

// models/album.js
export default DS.Model.extend({
  title: DS.attr(),
  image: DS.attr(),
  reviews: DS.hasMany('review', { async: true }),
  activities: DS.hasMany('activity', { async: true })
});

// models/review.js
export default DS.Model.extend({
  body: DS.attr(),
  album: DS.belongsTo('album')
});

// models/activity.js
export default DS.Model.extend({
  name: DS.attr(),
  album: DS.belongsTo('album')
});
~~~

Since we are _nesting our UI_ (comments and activity appears within the album template) _our routes are also nested_. We want Ember to automatically generate index routes for both activities and reviews. We don't need any other route actions, so we’ll just pass an empty function as the second argument to this.resource.

Also note that we're using `async: true` for the hasMany associations.

<a name="nested-loading-templates"/>

#### Using nested loading templates
To start things off, let’s add our application template, index template, and a top-level loading template. The loading template will automatically render when a route’s `beforeModel/model/afterModel` hook returns an unresolved promise, and then automatically render the route’s normal template in its place when the promise resolves.

You might have noticed that by default any of these hooks will pause a transition while the promise resolves. Once we define a loading template it will become an eager transition (meaning it will transition immediately instead of waiting for promises in our model hooks to resolve). You’ll know when a route is using an eager transition because the URL will update right away.

~~~handlebars
{{! templates/application.hbs }}
<div id="wrapper">
  <h2>Rdio Clone</h2>
  <div id="sidebar">
    <h4>playlists</h4>
    <ul>
      <li>Cool Playlist</li>
    </ul>
  </div>
  <div id="main">
    {{outlet}}
  </div>
</div>

{{! templates/index.hbs }}
<h3 class="top-title">Cool Playlist</h3>
<div class="albums">
  {{#each album in model}}
    {{#link-to 'album' album class="album"}}
      <img {{bind-attr src=album.image}} />
      {{album.title}}
    {{/link-to}}
  {{/each}}
</div>

{{! templates/loading.hbs }}
<div class="loader">
  <i class="fa fa-cog fa-spin"></i>
  <p>Loading...</p>
</div>
~~~

Clicking our _Load an album_ link should look like this:

![root-loading-template](http://cball.me.s3.amazonaws.com/loading-substates/3-root-loading-template.gif)

With this change in place, _any route that loads a template into the top level outlet_ will transition to our loading template while any of its model hook promises are resolving.

If you look at the preview, you’ll see that we start at the root of the app. Our loading template renders in two different cases - once while the list of albums is being fetched, and another while a single album is being fetched (the page was reloaded while on the album page). The loading template does not render when navigating from the list of albums to the album view since Ember already has the required data.

Next, let’s say we want to show a different loading state for other items on the album page. To do this, add an album/loading template.

~~~handlebars
{{! templates/album/loading.hbs }}
<div class="loader">
  <i class="fa fa-cog fa-spin"></i>
  <p>Fetching album data...</p>
</div>
~~~

Ember will load our `album/loading` template into the outlet inside the album template. That would look like this (again, with a refresh thrown in for good measure):

![album loading](http://cball.me.s3.amazonaws.com/loading-substates/4-album-loading-template.gif)

This looks good, so we move on to adding the review section, but realize both activities and reviews will render into the same outlet. This would be desired behavior if we were using a tabbed interface to show activities and reviews. Since we aren’t, we should use `named outlets`. For named outlets to work with loading substates, we’ll need to tell each route the outlet it should render templates into using the `renderTemplate` hook.

~~~handlebars
{{! templates/album.hbs }}
<div id="activities" class="section">
  <h3>Activity</h3>
  <div>{{#link-to 'activities'}}Load Activity{{/link-to}}</div>
  {{outlet activities}}
</div>
      
<div id="reviews" class="section">
  <h3>Reviews</h3>
  <div>{{#link-to 'reviews'}}Load Reviews{{/link-to}}</div>
  {{outlet reviews}}
</div>  
~~~

~~~javascript
// routes/activities-index.js
export default Ember.Route.extend({
  model: function() {
    var album = this.modelFor('album');
    return album.get('activities');
  },

  renderTemplate: function() {
    this.render({ outlet: 'activities' });
  }
});

// routes/activities.js
export default Ember.Route.extend({
  renderTemplate: function() {
    this.render({ outlet: 'activities' });
  }
});
~~~

~~~javascript
// routes/reviews-index.js
export default Ember.Route.extend({
  model: function() {
    var album = this.modelFor('album');
    return album.get('reviews');
  },

  renderTemplate: function() {
    this.render({ outlet: 'reviews'});
  },
});

// routes/reviews.js
export default Ember.Route.extend({
  renderTemplate: function() {
    this.render({ outlet: 'reviews' });
  }
});
~~~

Now we’re getting closer. The loading, activity, and review templates are rendering into separate areas of the page. Ignoring for a second that loading reviews still removes activities from the UI, we can see that our `album/loading` template is being used in both cases.

![named-outlets](http://cball.me.s3.amazonaws.com/loading-substates/5-named-outlets.gif)

Taking things a step further, we can now add specific loading templates for both activities and reviews. Because we are using named outlets, we again need to specify where the loading templates should render. If you don’t need named outlets, you can omit the loading route code entirely.

~~~handlebars
{{! templates/activities/loading.hbs }}
<div class=“loader">
  <i class="fa fa-cog fa-spin"></i>
  <p>Fetching activity data...</p>
</div>

{{! templates/reviews/loading.hbs }}
<div class="loader">
  <i class="fa fa-cog fa-spin"></i>
  <p>Fetching review data...</p>
</div>
~~~

~~~javascript
// routes/activities/loading.js
export default Ember.Route.extend({
  renderTemplate: function() {
    this.render({ outlet: 'activities'}); 
  }
});

// routes/reviews/loading.js
export default Ember.Route.extend({
  renderTemplate: function() {
    this.render({ outlet: 'reviews'}); 
  }
});
~~~

![separate-loading-templates](http://cball.me.s3.amazonaws.com/loading-substates/6-separate-loading-templates.gif)

This is very close to what we need, but we're still not quite there. The UI really needs to load data without changing the URL and without removing the other sections from the page. For that we'll have to manage our loading states manually. But first, let’s discuss the `loading event`.

<a name="loading-event"/>

#### Using the loading event
If you need to do something more custom than the default loading substate behavior, Ember provides a loading event that is fired on the current route and bubbles upward to your application route.

To use this hook, define a loading action in the the current route or any of its parents.

~~~javascript
// routes/activities.js
export default Ember.Route.extend({
  actions: {
    loading: function() {
      alert('crazy custom stuff');
    }
  }
});
~~~

The loading substate behavior in Ember does not kick until the loading action fully bubbles past the ApplicationRoute. If we implement a loading action somewhere and fail to return true (like the example above) the _loading substate behavior will not occur_.

Our Rdio clone will eventually load our activity and review sections when the user scrolls them into view rather than when a user clicks a link. If we want to keep our existing loading template behavior but track when reviews are loaded, we could also use the loading hook. For this to work, we just need to `return true` from the loading action (which will cause the event	 to bubble up and eventually the default loading substate to occur). 

~~~javascript
// routes/reviews.js
export default Ember.Route.extend({
  actions: {
    loading: function() {
      postDataToAnalytics('reviews:loaded');
      return true;
    }
  }
});
~~~

<a name="manual"/>

#### Using loading templates manually
If you find yourself in a situation where you need loading substate type behavior, but don’t actually want to transition to a new route, you’ll have to manually implement it.

We can add an action that explicitly renders templates:

~~~handlebars
{{! templates/album.hbs }}
<a href="#" {{action 'loadReviews' model}}>Load Reviews</a>
~~~

~~~javascript
// routes/album.js
export default Ember.Route.extend({
  actions: {
    loadReviews: function(album) {
      var _this = this;
      this.render('reviews/loading', {
        into: 'album',
        outlet: 'reviews'
      });
      
      album.get('reviews').then(function(reviews){
        _this.render('reviews/index', { 
          into: 'album',
          outlet: 'reviews',
          model: reviews
        });
      });
    }
  }
});
~~~

Or we can use `PromiseProxyMixin`:

~~~javascript
// controllers/reviews-index.js
export default Ember.ArrayController.extend(Ember.PromiseProxyMixin, {
  setupPromise: function() {
    this.set('promise', new Ember.RSVP.Promise(function(){}));
  }.on('init')
});

// routes/album.js
export default Ember.Route.extend({
  actions: {
    loadReviews: function(album) {
      var reviewsController = this.controllerFor('reviews.index');
      reviewsController.set('promise', album.get('reviews'));
    }
  }
});
~~~

~~~handlebars
{{! templates/album.hbs }}
…
{{render 'reviews/index'}}
…

{{! templates/reviews/index.hbs }}
{{#if isPending}}
  <div class="loader">
    <i class="fa fa-cog fa-spin"></i>
    <p>Fetching review data...</p>
  </div>
{{else}}
  <ul class="reviews">
    {{#each}}
      <li><img src="http://api.randomuser.me/portraits/thumb/lego/8.jpg" />{{body}}</li>
    {{/each}}
  </ul>
{{/if}}
~~~

Since we’re now rendering inline controllers in our app, we don’t need any of the named outlet code. Additionally, the promise needs to be resolved on controller init. Otherwise, it would show our loading state immediately since null promises are considered pending.

With all that said, here’s our final (for now) app with loading states:

![promise-proxy-loading](http://cball.me.s3.amazonaws.com/loading-substates/7-promise-proxy.gif)

#### Go forth and load

We took a pretty long route in implementing many approaches just to arrive at manual loading of templates, but in doing so I hope I’ve helped shed some light on this really interesting (and often confusing!) feature in Ember.

You should now know how to:

- use loading templates
- nest loading templates
- use loading templates with named outlets
- use a loading event
- use manual loading states when necessary

The jsbin used throughout this post is at [http://jsbin.com/pikoha](http://jsbin.com/pikoha).
