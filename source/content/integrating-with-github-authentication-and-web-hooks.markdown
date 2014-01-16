---
title: Integrating with Github - Authentication and Web Hooks
date: 2014-01-16
tags: development
image: http://cball.me.s3.amazonaws.com/integrating-with-github-authentication.jpg
---

---
Just over two weeks ago, I (and hopefully you!) started a challenge to "[Just build it](http://cball.me/just-build-it-a-two-week-challenge/)". We set a timeline of two weeks to see what we could build in order to level up our development skills. I want to go over what I built, what I've learned, and give you tips you can implement in your applications.

The application I built is called Gitshot (clearly, I didn't waste time thinking of a name), and it gives developers and designers the ability to generate screenshots from Github pull requests. READMORE So that I don't overload your brain or mine, this is a first in a series of 6 posts detailing almost every aspect of how the application works. Here's what we'll cover:

1. **Integrating with Github - Authentication and Web Hooks**
2. Launching a Virtual Machine - Buddy up with Vagrant
3. Integrating Further with Github - SSH Keys and Deploy Keys
4. Booting your App in the Background
5. Generating Screenshots with PhantomJS
6. Tying it all together - Look mom, I learned something!

### Github Authentication

#### Getting started 
Github uses OAuth for authentication. Instead of making API requests with a single token, your application will request authorization, receive a user-specific token, and make requests on behalf of that user.

Start by [registering a new application](https://github.com/settings/applications/new). Callback urls in this section do not have to be publicly accessible. Here are my settings:
![New Github Application Settings](https://s3.amazonaws.com/cball.me/new-github-app.png)

Add [octokit.rb](https://github.com/octokit/octokit.rb) to your Gemfile to interface with the Github API.

~~~ruby
gem "octokit", "~> 2.0"
~~~

Add the following environment variables to your application with the keys from the previous step:

~~~ruby
OCTOKIT_CLIENT_ID=xxxxx
OCTOKIT_SECRET=xxx
~~~

#### Show a Github link on your login/account page
We'll use Octokit to generate the authorization link for us. This link will identify our application to Github as well as request the permissions we specify. It's really important to only ask for what you need rather than trying to get all information under the sun. For Gitshot, I needed the user's email address and information about the repository:

~~~erb
<% authorize_url = Octokit.authorize_url(scope: "repo,user:email") %>
<%= link_to("Connect to Github", authorize_url) %>
~~~

#### Exchange an authorization code for a proper access token
After the user authorizes our application, Github will redirect back to our callback url that we defined in the settings page, passing along a single parameter named **code**. Let's exchange this for a proper OAuth token, which we'll store to make future calls on behalf of the user.

~~~ruby
class GithubAuthCallbacksController < ApplicationController
  def oauth_code
    if user_from_github_access_token.update_with_github_info && user.save
      sign_in(user)
    else
      flash[:error] = 'There was an error contacting Github.'
    end
    redirect_to root_path
  end

  private

  def user_from_github_access_token
    User.where(github_token: github_access_token).first_or_initialize
  end

  def github_access_token
    client = Octokit::Client.new
    token_response = client.exchange_code_for_access_token code_params[:code]
    token_response['access_token']
  end

  def code_params
    params.permit(:code)
  end
end
~~~

There are a few things to note. First, we exchange our code that we just got back for an access token using **client.exchange_code_for_access_token**. We can store the received token permanently, but keep in mind the user can revoke access at any time, and that scenario should be handled in your application. Finally, now that we are fully authenticated, we update some basic user info (email, name, and gravatar_url) by making another API request. If a user logs in using Github, it's usually safe to assume they do need a password, so we generate a random one.

~~~ruby
class User < ActiveRecord::Base
  validates :github_token, presence: true

  def update_with_github_info
    client = Octokit::Client.new access_token: github_token
    user = client.user
    self.email = user.email
    self.name = user.name
    self.gravatar_id = user.gravatar_id

    generate_password
  end

  private

  def generate_password
    if password.nil?
      self.password = SecureRandom.hex
    end
  end
end
~~~

### Github Web Hooks

In order to know when to generate screenshots and to be able to gather information from a Github pull request, we need to install a web hook. A web hook at its core is **just another callback url**, that Github will post as much information as it possibly can about a pull request, comment or other activity. Here's how we do that:

~~~ruby
class ProjectGitHookAdder
  attr_accessor :project
  delegate :user, to: :project

  def initialize(project)
    @project = project
  end

  def add
    client = Octokit::Client.new access_token: user.github_token
    hook = client.create_hook(
      project.repository,
      'web',
      hook_url_config,
      hook_options
    )

    hook.id.present?
  end

  private

  def hook_url_config
    {
      url: 'http://gitshot.24.183.111.227.xip.io/hooks/1',
      content_type: 'json'
    }
   end

  def hook_options
    {
      events: ['pull_request', 'pull_request_review_comment', 'commit_comment', 'issue_comment'],
      active: true
    }
  end
end
~~~

The important parts of the hook parameters are:

- **repository name** in the form of <user/repo>.
- **the url** (when developing locally I like to use [xip.io](http://xip.io) since it integrates nicely with pow). Keep in mind that this url _must be publicly accessible_.
- **events** all of the events that will trigger this hook.
- **active** you'll want to set this to true.

Github has great documentation on [hooks](http://developer.github.com/v3/repos/hooks/) and [event types](http://developer.github.com/v3/repos/hooks/#events) in case you need something different.

#### Testing it out
After authenticating and adding a hook to a repository, you should be able to see your new hook installed in the repository settings.

![Hook Settings](http://cball.me.s3.amazonaws.com/github-hooks.png)

_Note: If you find yourself needing to add additional event types, the only way to do so is through the API._

#### Parsing incoming hooks
Github will post to the url you set in the hook in the previous step. The payload is slightly different for each event you have registered, but a lot of the information is the same. 

In Gitshot, we need to know the url that a user wants a screenshot of, so I decided on a message convention of [screenshot /myurl]. To find this, we need to scan incoming hook data for this string. If the message is not found, or the pull request is closed, we ignore it. Here's how that works in Gitshot:

~~~ ruby
class GithubHooksController
  skip_before_action :verify_authenticity_token

  def receive
    if github_ip?
      GithubHookProcessor.new(params[:hook], project).process
    end

    render nothing: true
  end

  private

  def github_ip?
    # GH: "The Public IP addresses for these hooks are: 192.30.252.0/22"
    request.ip =~ /192.30.(252|253|254|255).\d+/
  end
end
~~~

In the controller, we just make sure the request comes from a valid Github ip address, and pass the hook params along to our **GithubHookProcessor**:

~~~ ruby
class GithubHookProcessor
  attr_accessor :hook_params, :project
  
  def initialize(hook_params, project)
    @hook_params = hook_params
    @project = project
  end

  def process
    if project? && valid_hook? && hook_repo_matches_project?
      process_pull_request || process_issue || process_comment
    end
  end

  private

  def process_pull_request
    GithubPullRequestHookProcessor.new(hook_params[:pull_request], project).process
  end

  def process_issue
    GithubIssueHookProcessor.new(hook_params, project).process
  end

  def process_comment
    GithubCommentHookProcessor.new(hook_params[:comment], project).process
end
~~~

The **GithubHookProcessor** runs the hook parameters through individual sub-processors, returning if a match for [screenshot /myurl] is found. If the processor finds the requested url, it also parses the BASE and HEAD commit hashes for the pull request, as well as checks the open/closed state to make sure its worth going any further. Unfortunately, we have to use 3 different processors, since Github formats each of the parameters differently, and its far better to split things out into separate classes than it is to add a bunch of if statements in our main processor.

In an upcoming post, we'll see how to use these parsed messages to check out Git branches and instruct PhantomJS where to go to generate a screenshot.

### Looking ahead
We've done a lot here! We started working with the Github API, authorized our application using OAuth, listed repositories for a user, and installed a hook to notify us when there is activity on the repository we care about. 

In part 2, we will be delving into virtual machines using Vagrant. This is extremely important in order to be able to check out and run code from an authorized repository in an secure, isolated, and temporary environment. [Get email updates for the rest of the series](http://cball.me/newsletter).
