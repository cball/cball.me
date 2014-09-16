---
title: Help I have no tests!
date: 2014-09-16 00:00 EDT
image: http://cball.me.s3.amazonaws.com/help-i-have-no-tests.jpg
tags: testing, development
---

---
There will come a point in your career as a developer that you run across one of two common scenarios.

1. [You come face-to-face with a project that has no tests (or very few)](#no-tests).
2. [You come face-to-face with a project that has incorrect tests](#incorrect-tests).

These two scenarios are variations on the same theme. Tests exist to verify that your code is working how it should, and are there for you to lean on when adding new features or refactoring. If you can’t lean on a good test suite, it’s very hard to ship and improve a product.

Let’s talk about strategies for dealing with each of these scenarios.

---
---

<a name="no-tests" />

#### Testing an app with no tests (or very few).
There can be many reasons why an app has no tests, but by far the most common one is that developers “don’t have time for them”. Another (and one that I’ve run into recently in Ember apps) is that the framework is so new that best practices are not fully established or well understood by the community. This often leads to developer confusion, and a “we’ll come back to it later” attitude. Thankfully, with Ember this is increasingly less common due to conventions put in place by ember-cli. If you run into this situation, how can you deal with it?

#### Start by writing acceptance-level tests.
When an app is without tests, you can’t be sure the code is working as expected. What you can be sure of, however, is how it functions from an end user point of view. This is exactly where you should start! Begin by writing tests for the user interactions that you can verify in the browser. By doing this, you’ll end up with a safety net that you can lean on as you start diving deeper in to the models and unit level tests.

I’ve found a few patterns helpful when implementing this approach:

- Write more acceptance tests than you normally would.
- Extract a login helper.
- Cast a wide net, then write a success and fail scenario for each major feature in the app.

#### Write more acceptance tests.
Typically an application should have lots of unit tests and just enough acceptance tests to cover combined and/or complicated scenarios, but because we’re starting from ground zero it helps to temporarily flip that mentality. Again, focus on writing tests for things you **know are correct from a user point of view**.

#### Extract a login helper.
The first thing that you’ll want to do is extract a login helper. You’ll be using this in all of your acceptance tests, so its a logical place to start.

The implementation is different depending on your framework of choice, but you’ll usually want a `login` method that takes a user model as an argument. 

Here’s an example from an Ember app that is using QUnit and Ember Simple Auth as the authentication library:

~~~javascript
// tests/helpers/login.js
Ember.Test.registerAsyncHelper('login', function(user, app) {
  var applicationRoute = app.__container__.lookup('route:application');

  authenticateSession();
  applicationRoute.set('session.currentUser', user);
});
~~~

And another example that doesn’t use an authentication framework, and creates the user in the store. Adding the object to the store is helpful because subsequent calls to `this.store.find('user', 1)` from within the same test scenario will return the same user. Stub the login API request using something like [pretender](http://github.com/trek/pretender).

~~~javascript
// tests/helpers/login.js
Ember.Test.registerAsyncHelper('login', function(app) { 
  var applicationRoute = app.__container__.lookup('route:application');
  var server = new Pretender(function(){
    this.get('/login', function(request){
      return [200, {"Content-Type": "application/json"}, JSON.stringify({token: 'foo'})];
    });
  });


  Ember.run(function(){
    var user = applicationRoute.store.createRecord('user', {
      id: 1,
      firstName: "The",
      lastName: "Dude",
      email: "dude@wee.net" 
    });

    visit('login');
    fillIn('#email', user.email);
    fillIn('#password', 'mattersnot');
    click('#login');

    server.shutdown();
  });
});
~~~

If you’re implementing this in a server-side framework, things are a bit easier since you have direct database access. You won’t have to mock the login API, but the concept of a login helper is the same. If you’re in an API only server-side app, you might do this by generating a user and passing the proper headers in a network request.

#### Cast a wide net, then write success and fail scenarios.
When you’re faced with a large task like writing a full test suite where there is none, it’s easy to get overwhelmed. To quickly cover as much of your app as possible, start by finding groups of features that you can implement as a single acceptance test. Then, go back and fill in the gaps with tests for smaller or more specific features.

Examples of groups of features include:

- A user adds a post and then comments on it
- A user that is not signed in, tries to vote but can’t. Then they sign up and should be able to vote.
- A user visits a profile page, friends a user, and sees another user in a “You are both friends with” box.

By doing this, you can actually cover a large percentage of your app at a high level. Next, try to figure out a success and failure scenario for each major feature. If you’ve already covered a success scenario when implementing the wide net approach, there is no need to add a redundant test.

Once you have an acceptable base of acceptance tests, you’re ready to dive down and start writing unit tests. If you come across bugs in the code for your app go ahead and fix them, writing unit tests to back up your changes. You should have enough test coverage from the acceptance test layer to catch bugs introduced by small code changes like this.

Continuing on, you will eventually have a comprehensive test suite in place. You can then use this test suite to improve your code by refactoring.

--- 
---

<a name="incorrect-tests" />

#### Testing a project that has incorrect tests.
A project that has incorrect tests is sometimes hard to spot. I’ve come across two common cases:

- The app has unit tests that are heavily mocked.
- The test case isn’t really testing what it needs to.

#### Heavily mocked tests
When used properly, mocks are great. However, they can be abused. If you find yourself wanting to mock more than just one or two items in a unit test, it probably means you could improve your application design. Work on teasing apart models or service objects to reduce coupling and dependencies. 

One of the biggest dangers with mocks is that something is mocked wrong and you don’t realize it. The test will pass because you mocked it, but could disguise a bug since you’re not using the real object.

#### Testing the wrong thing
You might also have a good sized test suite, but some of your tests might be testing the wrong thing. This is dangerous because it can give a false sense of security. It’s tough to spot tests like this, but most commonly it happens by testing behavior of one class from within the unit test of another.

It can also happen when an object has too many responsibilities. One of those responsibilities slips through the cracks test-wise, and later changes can break things.

#### How to fix it
The fix for this is actually pretty simple. If you’re skeptical of an area of your test suite, write a few tests that you think may break it. If you can write a failing test, fix the code so that the test is passing. Next, verify that the entire suite is still passing. If it is, look at the older test and decide if it’s worth keeping around as an alternate scenario. It might be completely invalid, or it might overlap the new test you just wrote. Use your best judgement, and if it’s not worth keeping around don’t be afraid to delete it!

If you you are unable to write a failing test, then you can breathe a little easier. See if the new test is worth keeping around as an alternate scenario. If not, feel free to trash it.

After doing this, if things still don’t feel right, then use the confidence from the test coverage to refactor and simplify the code.

#### Making it better
These strategies should help you start to take hold of projects you come across that have less than ideal test suites. Often the biggest hurdle is just knowing where to start.