---
title: Go Code Spelunking
date: 2014-04-07
tags: development
image: http://cball.me.s3.amazonaws.com/go_code_spelunking.jpg
---

---
Code Spelunking (a fancy way to say reading and understanding source code) is an great way to level up quickly. Think about it - your favorite open source library is a pool of knowledge from a talented community that has been improved over time. Learn from it!READMORE

Let's look at two specific ways this can help you as a programmer. First, it can give you a proper way to structure a concept. Second, it can teach you ways to use your favorite language in ways you didn't think of. Let's look specifically at **adding configuration to a ruby gem**.

### Adding Configuration to a Ruby Gem

Lets assume you've written a ruby gem that does something awesome when a branch is pushed to git. You as the developer make it happen:

~~~ruby
module CoolGitGem
  class Git
    def push_received(data)
      do_awesome_stuff
    end
  end
end
~~~

Ship it. Then you realize that you're only really supposed to do awesome stuff when the master branch is pushed to:

~~~ruby
module CoolGitGem
  class Git
    def push_received(data)
      if branch_should_do_awesome_stuff?(data)
        do_awesome_stuff
      end
    end

    private

    def branch_should_do_awesome_stuff?(data)
      parsed_git_branch(data) =~ /master/
    end

    def parsed_git_branch(data)
      git_branch = data[:git][:branch].to_s.strip
      git_branch.sub(/^origin\//, '')
    end
  end
end
~~~

Glory. Next, let's say you want to add custom data to an internal dashboard when other developers push code (for sake of argument, assume your company runs its own git server instead of using GitHub). The dashboard is on a separate app, so you add your newly created gem to it. But now, you've got a problem... one app should do_awesome_stuff when master is involved and the other should do _awesome_stuff all the time.

This is a perfect time for to add configuration to your gem. Rather than asking StackOverflow, lets look at some gems that we know have quality code and see how they do configuration. Not only will that give us a correct answer, but also a chance to look at how others have a approached this problem in open-source libraries that get a lot of use by the community.

#### Example: Clearance (simplified)
~~~ruby
module Clearance
  class Configuration
    attr_writer :allow_sign_up

    attr_accessor \
      :cookie_domain,
      :cookie_expiration,
      :cookie_path,
      #...

    def initialize
      @allow_sign_up = true
      @cookie_expiration = ->(cookies) { 1.year.from_now.utc }
      @cookie_path = '/'
      #...
    end

    def user_model
      @user_model || ::User
    end

    def allow_sign_up?
      @allow_sign_up
    end

    def user_id_parameter
      "#{user_model.model_name.singular}_id".to_sym
    end
  end

  def self.configuration
    @configuration ||= Configuration.new
  end

  def self.configuration=(config)
    @configuration = config
  end

  def self.configure
    yield configuration
  end
end
~~~

#### Example: Carrierwave (simplified)
~~~ruby
module CarrierWave

  module Uploader
    module Configuration
      extend ActiveSupport::Concern

      included do
        class_attribute :_storage, :_cache_storage, :instance_writer => false

        add_config :root
        add_config :base_path
        add_config :asset_host
        add_config :permissions
        #...

       	# set default values
        reset_config
      end

      module ClassMethods

        def storage(storage = nil)
          if storage
            self._storage = storage.is_a?(Symbol) ? eval(storage_engines[storage]) : storage
          end
          _storage
        end
        alias_method :storage=, :storage

        def add_config(name)
          class_eval <<-RUBY, __FILE__, __LINE__ + 1
            #... a bunch of methods that get added to class
          RUBY
        end

        def configure
          yield self
        end

        def reset_config
          configure do |config|
            config.permissions = 0644
            config.directory_permissions = 0755
            #...
          end
        end
      end

    end
  end
end
~~~

In both of these examples, the api that the developer using the gem interacts with is the same:

~~~ruby
Clearance.configure do |config|
  config.allow_sign_up = true
  config.cookie_domain = '.example.com'
end
~~~

~~~ruby
CarrierWave.configure do |config|
  config.permissions = 0666
  config.directory_permissions = 0777
  config.storage = :file
end
~~~

After looking at both libraries, you decide you like the **clearance** implementation for the following reasons:

* Does not rely on ```ActiveSupport::Concern```
* Uses mostly ```attr_accessor``` combined with methods when more logic is needed
* Seems simpler (this is subjective)
* You have no need for reset config logic

Keeping this approach in mind, you flush out your Git configuration object:

~~~ruby
# lib/cool_git_gem/configuration.rb
module CoolGitGem
  class Configuration
    
    def awesome_branches
      @awesome_branches || [/.*/]
    end

    def awesome_branches=(branches)
      @awesome_branches = items_to_regex(branches)
    end

    private

    def items_to_regex(branches)
      if branches.respond_to?(:map)
        branches.map{|b| Regexp.new(b)}
      end
    end
  end
    
  def self.configuration
    @configuration ||= Configuration.new
  end

  def self.configuration=(config)
    @configuration = config
  end

  def self.configure
    yield configuration
  end
end

# lib/cool_git_gem.rb
module CoolGitGem
  class Git
    def push_received(data)
      if branch_should_do_awesome_stuff?(data)
        do_awesome_stuff
      end
    end

    private

    def branch_should_do_awesome_stuff?(data)
      branch = parsed_git_branch(data)
      CoolGitGem.configuration.awesome_branches.any?{|b| branch =~ b}
    end

    def parsed_git_branch(data)
      git_branch = data[:git][:branch].to_s.strip
      git_branch.sub(/^origin\//, '')
    end
  end
end

# config/initializers/cool_git_gem.rb - app 1
CoolGitGem.configure do |config|
  config.awesome_branches = %w(master)
end

# config/initializers/cool_git_gem.rb - app 2
# nothing needed, matches any branch by default

# config/initializers/cool_git_gem.rb - app 3
CoolGitGem.configure do |config|
  config.awesome_branches = ['.*-dev', /crazy/]
end
~~~

And just like that, anyone can add arrays of regex's or regex strings to match branch names. We also now have a really great structure to store configuration as our gem grows.

Using this technique, I'll bet you understand your new config object far better than you would have by just consulting StackOverflow and doing the copy/paste approach.

