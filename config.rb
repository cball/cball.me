Time.zone = 'America/New_York'

set :css_dir, 'stylesheets'
set :js_dir, 'javascripts'
set :images_dir, 'images'
set :frontmatter_extensions, %w(.html .slim)

activate :blog do |blog|
  # blog.prefix = "blog"
  blog.permalink = ":title.html"
  blog.sources = "content/:title.html"
  blog.summary_separator = /(READMORE)/
  blog.summary_length = 250
  blog.layout = "article_layout"

  blog.tag_template = "tag.html"
  blog.taglink = 'topics/:tag.html'
  blog.calendar_template = "calendar.html"
end

activate :directory_indexes

activate :deploy do |deploy|
  deploy.build_before = true
  deploy.method = :git
  # deploy.remote = "custom-remote" # remote name or git url, default: origin
  # deploy.branch = "custom-branch" # default: gh-pages
end

page "/feed.xml", :layout => false

configure :build do
  activate :minify_css
  activate :minify_javascript

  # Compress PNGs after build
  require "middleman-smusher"
  activate :smusher
  activate :gzip, :exts => %w(.atom .css .html .js .rss .svg .txt .xhtml .xml)
end
