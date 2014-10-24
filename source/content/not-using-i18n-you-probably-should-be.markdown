---
title: Not using I18n? You probably should be.
image: http://cball.me.s3.amazonaws.com/i18n.jpg 
date: 2014-10-24 13:00 EDT
tags: i18n, development, ember, rails
---

---

I18n is an acronym for internationalization. It is a part of most frameworks, and is used in applications to translate words or phrases to other languages. Instead of writing the phrase “My favorite songs”, you make a call to the I18n library to fetch the phrase based on a key (my.favorite.songs for example).

“But my app only needs to support English, why should I do this?” In this first part, we will look at some great reasons why, and then in [part 2](/i18n-in-practice), we will take a look at examples in both Rails and ember.js.

#### Avoid string duplication, and change easily.
Think about how many sections of your app have buttons that say “Create” or “Save”. Let’s say your designer decides that the buttons will convert better if they are specific to each action. Buttons that favorite songs should say “Add to Favorites” instead of “Create”. Wouldn’t it be easier to go change the button text in one place rather than searching the entire project for “Create” and then trying to determine if it was a button that favorited songs?

Using I18n gives us exactly that - a single place that can be referenced anywhere in the app that provides the necessary text. To make the example change above, all you’d need to do is search your I18n file(s) for the key of 'songs.favorite' and change value to “Add to Favorites”. If after running some A/B tests, your designer was incorrect, its just as easy to change back.

#### Keep your tests working if things change.
Taking the above example a step further, if you’re not using I18n, as soon as you change the necessary buttons to “Add to Favorites” your acceptance tests will break.

Using I18n in both the app and in the tests will allow you to update strings without having to immediately change your tests after doing so. Less work is a good thing.

#### If you ever need to add additional language support, you’re ready.
Admittedly, you may not ever need more than one language in your app. But, by using I18n from the start, if there ever is a need all you’ll need to do is: 

1. Create a new 18n file for the new language.
2. Have it translated. Please don’t blindly copy/paste from google translate… you could offend someone.
3. Make minor css updates if the language has long strings.

---

#### TLDR; Use I18n translations!
Using I18n even when you’re only supporting one language will help remove code duplication and reduce test churn when updating phrases throughout your app. 

It may seem unnecessary at first, but the benefits will be clear the first time you try different text on a button, or change wording around. It’s also really nice if you later have to add additional language support and already have the groundwork done.

#### I18n in practice
Check out [part 2](/i18n-in-practice) of this post, to see how using I18n as described above works in both [Rails](/i18n-in-practice#i18n-rails) and [ember.js](/i18n-in-practice#i18n-ember).