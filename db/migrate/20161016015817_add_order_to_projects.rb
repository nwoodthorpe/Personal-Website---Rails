class AddOrderToProjects < ActiveRecord::Migration
  def change
    add_column :projects, :position, :integer
  end
end
