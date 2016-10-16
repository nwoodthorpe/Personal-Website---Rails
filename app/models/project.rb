class Project < ActiveRecord::Base
  has_many :links

  validates :title, presence: true
  validates :content, presence: true
  validates :position, presence: true, uniqueness: true
end
