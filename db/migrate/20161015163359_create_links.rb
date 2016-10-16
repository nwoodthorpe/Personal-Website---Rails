class CreateLinks < ActiveRecord::Migration
  def change
    create_table :links do |t|
      t.string :text, null: false
      t.string :url, null: false
      t.integer :project_id, null: false
      t.timestamps null: false
    end
  end
end
