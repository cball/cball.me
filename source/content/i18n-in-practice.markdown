---
title: I18n in Practice
image: http://cball.me.s3.amazonaws.com/i18n2.jpg 
date: 2014-10-24 13:00 EDT
tags: i18n, development, ember, rails
---

---

In [part 1](/not-using-i18n-you-probably-should-be) of this series on using I18n, we looked at reasons to use I18n in your apps, even if you only need to support a single language.

Now, let’s look at how to use I18n in that context using both [Rails](#i18n-rails) and [ember.js](#i18n-ember).

<a name="i18n-rails" />

#### I18n example in Rails
Using I18n Rails is [very well documented](http://guides.rubyonrails.org/i18n.html).

To get the benefits we discussed in [part 1](/not-using-i18n-you-probably-should-be), you can use the built in lazy lookup that Rails provides:

~~~erb
<% # app/views/favorite_songs/new.html.erb %>
<%= form_for @favorite_song do |f| %>
  <%= f.submit %>
<% end %>
~~~

~~~yml
# config/locales/en.yml
en:
  helpers:
    submit:
     create: "Create a %{model}"
     update: "Update %{model}"
     favorite_song:
      create: "Add to Favorites"
~~~

~~~ruby
# spec/features/user_favorites_song_spec.rb
click I18n.t('helpers.submit.favorite_song.create')
~~~

One advantage to using the lazy lookup structure is that you can have a global fallback string of “Create a song” or “Create a playlist”, and you can add more specific values like “Add to Favorites” where required.

Or, if you prefer to be explicit and store your translations in whatever grouping makes sense to you, you can do that too:

~~~erb
<% # app/views/favorite_songs/new.html.erb %>
<%= form_for @song do |f| %>
  <%= f.submit t('songs.favorite') %>
<% end %>
~~~

~~~yml
# config/locales/en.yml
en:
  songs:
    favorite: "Add to Favorites"
~~~

~~~ruby
# spec/features/user_favorites_song_spec.rb
click I18n.t('songs.favorite')
~~~

---

<a name="i18n-ember" />

#### I18n example in ember.js
Since it’s not built into the framework, using I18n in ember is a bit less straightforward. There is an existing library called [ember-i18n](https://github.com/jamesarosen/ember-i18n) that has been around for a while and works well, though as of 10/24/14 does not support ember canary (what will be 1.9).

I wanted to see if I could build a proof of concept for a more stripped down, more ember-cli integrated library that I hope to simplify and turn into an addon shortly. It’s not quite ready yet, but you can use a similar technique manually as follows:

1. Create a simple I18n class that handles fetching a key and interpolating strings.
1. Add an initializer that injects the class as a singleton throughout the app.
1. Add a Handlebars helper that calls the injected class to get translations.
1. Add the actual translations.
1. Use them in your templates with or without bindings.

~~~js
//app/utils/i18n.js
import Ember from 'ember';
import translations from '../translations/en';

var I18n = Ember.Object.extend({
  currentLocale: 'en',
  defaultLocale: 'en',

  t: function(key, options) {
    var keyWithPrefix = this.get('_translationPrefix') + key;
    var string = translations.get(keyWithPrefix);
    Ember.assert('Missing translation: ' + keyWithPrefix, string);

    return this._interpolate(string, options.hash);
  },


  _interpolate: function(key, hash) {
    if (typeof(hash) === 'undefined') { return key; }
    hash = hash || {};

    return key.replace(/\{\{(.*?)\}\}/g, function(i, match) {
      return hash[match] || '';
    });
  },

  _translationPrefix: function() {
    return this.get('currentLocale') + '.';
  }.property('currentLocale')
});

export default I18n;
~~~

~~~js
// app/initializers/i18n-setup.js
import I18n from '../utils/i18n';

export var initialize = function(container, application) {
  application.register('util:i18n', I18n);
  application.inject('route', 'i18n', 'util:i18n');
  application.inject('controller', 'i18n', 'util:i18n');
  application.inject('helper', 'i18n', 'util:i18n');
};

export default {
  name: 'i18n-setup.js',
  initialize: initialize
};
~~~

~~~js
// app/helpers/i18n-t.js
import Ember from 'ember';

export default Ember.Handlebars.makeBoundHelper(function(key, options) {
  return this.i18n.t(key, options);
});
~~~

~~~js
// app/translations/en.js
import Ember from 'ember';

export default Ember.Object.create({
  en: {
    favoriteSongs: {
      create: "Add to {{crazy}} Favorites",
      destroy: "Remove from Favorites",
      testing: "My {{crazy}} Favorites"
    }
  }
});
~~~

~~~hbs
{{! app/templates/index.hbs }}
create: {{i18n-t 'favoriteSongs.create'}} <br />
with binding: {{i18n-t 'favoriteSongs.create' crazy=howCrazy}}

<button id="swap-locale" {{action 'swapLocale'}}>{{i18n-t 'swapLocale'}}</button>
~~~

Now, in your tests you can use it like so (in the actual library I plan to add a test helper to avoid having to call `I18n.create()`):

~~~js
import I18n from '../../utils/i18n';

var App;
var i18n;

module('Acceptance: UserDoesStuff', {
  setup: function() {
    App = startApp();
    i18n = I18n.create();
  },
  teardown: function() {
    Ember.run(App, 'destroy');
  }
});

test('visiting /', function() {                                      
  visit('/');
                                                                     
  andThen(function() {
    equal(find('#swap-locale').text(), i18n.t('swapLocale'));
  });    
});
~~~

The full source code for the proof of concept app is available at [cball/ember-cli-i18n-example](https://github.com/cball/ember-cli-i18n-example). Using this will get much simpler once you don’t manually have to put all the pieces together. I will update this post when I get things a little further along.

Happy I18n’ing!

