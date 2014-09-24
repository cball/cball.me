---
title: Realtime App Version Notices with socket.io and Redis
date: 2014-09-24 19:18 EDT
image: http://cball.me.s3.amazonaws.com/realtime-app-version/realtime-app-version-notices.jpg
tags: development
---

---

If you’ve been on a site powered by [Discourse](http://www.discourse.org/), you may have seen the following notification:

![discourse update](http://cball.me.s3.amazonaws.com/discourse_update.png)

How and why did they do this?

One of the built-in benefits of rendering frontend templates server-side is that you are guaranteed users will be using the most recent version of your application. Since most actions require a refresh from the server, the user usually gets an updated template the next time they click on something.

If you’re using a client-side framework, however, this is not the case. Your app may have loaded everything it needs from the backend API and might go a very long time without requesting anything new from the server. Or, your user might leave the app open in a tab so they can come back to it at lunchtime. 

Even if you’re not using a client-side framework, this situation can happen if part of your application makes ajax requests to get updated information but stays on the page otherwise.

How can we show users that there is a new version of the app available?

#### Determine the current version of the app
There are many ways to figure out the current version of your application.

If you’re using ember with ember-cli you could grab the version of your application.js using information from the `broccoli-asset-rev` plugin.

If your client-side application is being served from within Rails, you could use `Rails.application.assets.digest`.

The method I like best is to use a `deploy task` to set an application version using git. Assuming you use the same or similar deployment scripts across your apps, it gives a universal way to access app version information regardless of the language the app is using. This of course assumes that all of your application use git for source control.

#### Store the current version somewhere globally accessible
We use Redis quite a bit at [echobind](http://echobind.com). Redis is a great (fast!) key value store and has client libraries for many different languages. This makes it a great candidate to hold our global app version. Since we’re looking at real time notifications, we’ll also use the [Pub/Sub](http://redis.io/topics/pubsub) functionality.

#### Example Ruby deploy task backed by Redis
~~~ruby
# Rakefile
require './app_version'                    
                                           
desc 'deploys the app'                     
task :deploy do                            
  app_version = AppVersion.new "frontend"  
                                           
  app_version.update_to version_from_git do
    # deploy production                    
    `divshot push production`           
  end                                      
end                                        
                                           
def version_from_git                       
  `git rev-parse HEAD`.strip               
end
~~~

~~~ruby
# app_version.rb
require 'redis'                                                         
                                                                        
class AppVersion                                                        
  attr_reader :app_key, :use_pubsub, :version_key, :previous_version_key
                                                                        
  def initialize(app_key, use_pubsub=true)                              
    @app_key = app_key                                                  
    @use_pubsub = use_pubsub                                            
    @version_key = "#{app_key}-app-version"                             
    @previous_version_key = "#{app_key}-app-version-prev"               
  end                                                                   
                                                                        
  def current                                                           
    redis.get version_key                                               
  end                                                                   
                                                                        
  def current=(version)                                                 
    puts "Setting #{app_key} app-version to #{version}."                
    redis.set version_key, version                                      
    publish_new_version version                                         
  end                                                                   
                                                                        
  def previous                                                          
    redis.get previous_version_key                                      
  end                                                                   
                                                                        
  def previous=(version)                                                
    redis.set previous_version_key, version                             
  end                                                                   
                                                                        
  def update_to(version, &block)                                        
    self.previous = current                                             
    yield                                                               
    self.current = version                                              
  rescue                                                                
    rollback                                                            
  end                                                                   
                                                                        
  private                                                               
                                                                        
  def redis                                                             
    @redis ||= Redis.new                                                
  end                                                                   
                                                                        
  def rollback                                                          
    puts "An error occured, rolling back #{app_key} app-version."       
    self.current = previous                                             
    redis.del previous_version_key                                      
  end                                                                   
                                                                        
  def publish_new_version(version)                                      
    if use_pubsub                                                       
      redis.publish version_key, version                                
    end                                                                 
  end                                                                   
end                                                                                                                                     
~~~

Now that we have Redis storing the current version of our deployed application, we need a way for the client app to read it.

#### Websockets
Websockets sound great in theory, but bring overhead and complication. For this reason, Discourse [built their own solution](https://meta.discourse.org/t/why-does-discourse-not-use-web-sockets/18302). Recently though, a library called [socket.io](http://socket.io/) has improved quite a bit, and now does a great job of fixing most these issues. So if you’re thinking of using websockets, use socket.io. If you looked at this library pre 1.0 its worth looking at it again.

Since we’re using Redis as a global store, we can set up a small server that has has the single responsibility of forwarding app version changes to other apps through Redis Pub/Sub and socket.io. This will give us maximum scalability, and won’t impact our main application.

~~~javascript
// server.js
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var redis = require('redis');
var redisClient = redis.createClient();
var redisSubscriber = redis.createClient();

// use socket.io-redis if you need lots of connections. it allows
// socket.io to work across servers
var socketIORedis = require('socket.io-redis');
io.adapter(socketIORedis({ host: 'localhost', port: 6379 }));

redisSubscriber.subscribe('frontend-app-version');
redisSubscriber.subscribe('iphone-app-version');

redisSubscriber.on('message', function(channel, message) {
  io.emit(channel, message);
});

io.on('connection', function(socket) {
  redisClient.get('frontend-app-version', function(error, value) {
    socket.emit('frontend-app-version', value);
  });
});

// in the real world the following would be an api call that renders json
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
~~~

~~~html
<!-- index.html -->
<ul id="versions"></ul>

<script src="/socket.io/socket.io.js"></script>
<script src="http://code.jquery.com/jquery-1.11.1.js"></script>
<script>
  var socket = io();

  socket.on('frontend-app-version', function(msg){
    $('#versions').append($('<li>').text(msg));
  });
</script>
~~~

Here’s what our server looks like in use. The image is a little small, but we have 4 browsers getting a “new version” message sent 3 different ways. The full source code can be found at [cball/socket.io-new-app-version](https://github.com/cball/socket.io-new-app-version). It’s a creative name, I know.

- From a deploy rake task looking at the git version
- A manual version from redis-cli
- A manual version from the ruby redis client

![socket.io redis example](http://cball.me.s3.amazonaws.com/realtime-app-version/socketio-redis.gif)

#### Polling & Response Headers
If using socket.io is not an option, we can use polling and a special response header in our API. We can check this value on every request, or make an API call on a preset interval (say every 20 minutes), to get the current value.

If you want to hear more on this approach, shoot me an email or comment below and I’ll write about it.

#### Dealing with a new version
Now that we’ve done all the hard work, we just have to check the current version of the app and compare it with the new version.

In our express app, we get the current version on connect. All we need to do is change our ‘frontend-app-version’ socket listener to show a popup when the versions don’t match.

~~~javascript
var socket = io();
var currentAppVersion;

socket.on('frontend-app-version', function(msg){
  currentAppVersion || (currentAppVersion = msg);
  if(currentAppVersion !== msg) {
    // show new version alert
  }
});
~~~

#### There are lots of good techniques here!
Developing this feature gives us lots of good techniques. Here’s what we did:

- Wrote a rake task.
- Grabbed the git reference that was deployed to production.
- Saved current/previous app versions backed by Redis.
- If the deploy fails, we roll back the current version and make the previous version the current one.
- Published an update via Redis PubSub
- Wrote a small Express server that hooks Redis Pub/Sub and socket.io together.

Before implementing this, be sure your app really needs the functionality. Not all apps do. If users typically sit on pages for long periods of time, and you need to ensure users use the most up-to-date version of your app, give real time app versions a try.