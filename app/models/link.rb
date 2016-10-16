class Link < ActiveRecord::Base
  belongs_to :project

  validates :project, presence: true
  validates :url, presence: true
  validates :text, presence: true
end
