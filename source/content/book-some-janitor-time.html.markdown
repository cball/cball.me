---
title: Book Some Janitor Time
image: http://cball.me.s3.amazonaws.com/book_janitor_time.jpg
date: 2014-04-23 19:11 EDT
tags: development, team
---

---
If your team works in an office, you probably have a janitor that comes in to clean it. It might happen daily or weekly, but chances are that it happens. What if you applied that same mindset to your codebase?READMORE

Most startups have something in common; a _massive_ feature backlog. No matter how much you work, and how productive you are, this will continue to grow. Over time, you will find that your team "has no time to make x better" because there are "too many features that have been promised to business/the client/the stakeholder". 

Or maybe you've just spent a few weeks on a feature, only to get to the very end of it and find you need a little bit of refactoring to make it perfect. Only, you've already missed your deadline so you can't afford the time. In a perfect world, you should always add that last refactor or tweak to make each feature great, but we all know that there are times when you just can't.

So, how do we find the time for these tweaks, fix-ups, or a chance to try out something that may improve app performance? By booking some janitor time.

Here are a few ways I've found that work (substitute Friday for whatever day makes sense at your company).

- #### Option 1: Every developer, every Friday
While this option is the best, its also the least realistic for most companies since nothing except high priority bugs will happen on Fridays. A hard sell, but if your company will allow you go for this.
- #### Option 2: Every developer, 9am-12pm Friday (1/2 day)
Similar to option above, just without allocating the entire day.
- #### Option 3: One developer, every Friday
The key to making this option work is to add rotation. You can keep the same day and rotate developers, or rotate both days and developers.
- #### Option 4: Every developer, first few hours of the day
This is the lowest slice of time I recommend allocating. Any lower, and chances are you'll be hitting your stride just as you have to stop and switch contexts.

### Ok, the time is booked. What do we work on?
First, develop a small queue of items other developers could address. I like to use Trello for planning things like this. Anytime you get an idea, toss it in the queue and someone can pick it up if they don't know what to work on during their janitor time.

Here are a few examples to get you started:

- **Review your most recent feature**. If there is any refactoring that can be done to increase readability or simplify the code, do it now.
- **Check for n+1 queries**. If you use Ruby, use a gem like [bullet](https://github.com/flyerhzm/bullet) or a service like [skylight.io](http://skylight.io) to help you. Kocking out 4-5 of these will drastically improve the performance of your app, especially if they are all on one page.
- **[Insert process that everyone always complains about]**. Recently, I was working with a team that had a custom process for preparing a seed database for tests. This is fine. However, if you didn't specify the test environment, it would blow away your development database, which isn't so fine. Total time to fix it? 45 seconds. 
- **Find your slowest loading page** and make it render faster. Don't just think queries either, look at iterating in templates, etc. Anything you can accomplish here is a win.
- **Implement a CDN**, add far-future expire headers, and gzip responses. People often forget this, but it has massive performance benefits.

### Try it out
I've found this to be a great way to make sure you allocate time for code cleanup. Remember: "I'll come back to that" will never come. Future you will thank you because you're protecting everyone from a landslide of technical debt and slow applications.