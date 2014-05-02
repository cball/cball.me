---
title: Non-RESTful API calls with Ember Data
date: 2014-05-02 11:00 EDT
image: http://cball.me.s3.amazonaws.com/ember-making-non-restful-api-calls.jpg
tags: ember
---

---

When developing an application using Ember and Ember Data, if the API you're using is a completely RESTful interface, things are very straightforward. Once you need to make a call that does not fit into standard REST conventions, such as **task/:id/complete** as PUT request, you have a choice to make. Your first instinct might be to reach for Ember.$.ajax, but don't; especially if you're sending custom headers or using a namespace. READMORE 

The following examples use ember-cli, but should be the same for an application using ember-appkit.

#### Know thy adapter

Ember Data has the concept of an adapter that tells your application how to talk to your persistence layer. It is typically called from the store object through the use of something like ```this.store.find('task', 1)```, but occasionally you'll need to use it directly.

Let's say we have an application that is in the process of moving to version 2 of an API, and we want start by updating our Task model to use that version. In version 1 of the API, we just updated the complete boolean on a Task. For version 2, we need to perform a number of actions on task complete, so a dedicated /**tasks/:id/complete** API call was added. With Ember Data, using different API versions on a per-model basis is a breeze.

Here is our application-wide adapter:

~~~js
// app/adapters/application.js
export default DS.ActiveModelAdapter.extend({                            
  host: 'http://api.coolapp.com',                                                                                   
  headers: {                                                             
    'Accept': 'application/vnd.api.coolapp.com; version=1'
  }                                                                      
});                           
~~~

And the new task adapter:

~~~js
// app/adapters/task.js
export default DS.ActiveModelAdapter.extend({
  headers: {                                                             
    'Accept': 'application/vnd.api.coolapp.com; version=2'
  }              
});
~~~


#### Make the Non-RESTful call
Now that the adapters are in place, we add a complete action to our TasksShowController that will make the proper API call.

~~~js
// app/controllers/tasks/show.js
var TasksShowController = Ember.ObjectController.extend({           
  actions: {                                                        
    complete: function(){                                           
      var _this = this;
      var task = this.get('content');
      var adapter = this.container.lookup('adapter:task');
                                                                    
      adapter.ajax(this.completeTaskUrl(adapter), 'PUT')
        .then(function(response) {
          task.setProperties(response.task);
          _this.transitionToRoute('tasks'); 
        }, this.completeFailure);
  },

  taskCompleteFailure: function(response) {
    // show a nice message
  },

  completeTaskUrl: function(adapter) {                                   
    return adapter.buildURL('task', this.content.get('id')) + '/complete'
  }

export default TasksShowController;
~~~

We first store the current context to a variable, since we will lose the scope inside the ```.then``` function. 

Then, we grab the content (which represents the task) from our controller using ```this.get('content')```.

Next, we look up the TaskAdapter, and use the ajax method defined there. Using ```adapter.ajax``` instead of ```Ember.$.ajax``` will leverage any headers or namespaces defined on the adapter.

Finally, we want to construct a url that has the correct host and path. If you are running your API on the same host as your Ember application, you could just use '/tasks/1/complete' in the ajax call above, but building the url through the adapter is a great practice since you are insulated from change at an adapter level down the line.

When we get the response back, we call ```task.setProperties``` with the updated task from the response. This will mark the task as complete.

#### Lessons Learned

With adapters, Ember Data gives you a wonderful mechanism for incrementally upgrading an API version in an application, or even using a different API backend on a per-model basis.

If you need to make a non-RESTful call in an application using Ember Data, reach for ```adapter.ajax```.