require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  test "Can create project" do
    p = Project.new(title: "title", content: "content", position: 1)
    assert p.save
  end

  test "Project must have title" do
    p = Project.new(content: "Nope", position: 2)
    refute p.save
    assert p.errors[:title]
  end

  test "Project must have content" do
    p = Project.new(title: "Nope", position: 2)
    refute p.save
    assert p.errors[:content]
  end

  test "Project must have position" do
    p = Project.new(content: "Nope", title: "Title")
    refute p.save
    assert p.errors[:position]
  end

  test "Project must have unique position" do
    p = Project.new(title: "title", content: "content", position: 1)
    assert p.save

    p2 = Project.new(title: "title2", content: "content2", position: 1)
    refute p2.save
    assert p2.errors[:position]
  end

  test "Project can have Link" do
    p = Project.new(title: "title", content: "content", position: 1)
    assert p.save
    assert p.links.create(url: "url", text: "text")
  end
end
