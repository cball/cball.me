Time.zone = 'America/New_York'

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'

activate :blog do |blog|
  # blog.prefix = "blog"
  blog.permalink = ":title.html"
  blog.sources = "content/:title.html"
  blog.summary_separator = /(READMORE)/
  blog.summary_length = 250

  blog.tag_template = "tag.html"
  blog.calendar_template = "calendar.html"
end

activate :directory_indexes

page "/feed.xml", :layout => false

# Automatic image dimensions on image_tag helper
# activate :automatic_image_sizes

configure :build do
  # Compress PNGs after build
  # First: gem install middleman-smusher
  # require "middleman-smusher"
  # activate :smusher
end
