require 'test_helper'

class LinkTest < ActiveSupport::TestCase
  setup do
    @p = Project.new(title: "title", content: "content", position: 1)
    @p.save
  end

  test "Can create Link" do
    assert @p.links.create(url: "url", text: "text")
  end

  test "Link must have url" do
    l = Link.new(text: "text", project: @p)
    refute l.save
    assert l.errors[:url]
  end

  test "Link must have text" do
    l = Link.new(url: "url", project: @p)
    refute l.save
    assert l.errors[:text]
  end

  test "Link must belong to project" do
    l = Link.new(text: "text", url: "url")
    refute l.save
    assert l.errors[:project]
  end
end
