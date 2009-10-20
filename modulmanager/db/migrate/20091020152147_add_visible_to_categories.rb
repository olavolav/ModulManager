class AddVisibleToCategories < ActiveRecord::Migration
  def self.up
    add_column :categories, :visible, :boolean
  end

  def self.down
    remove_column :categories, :visible
  end
end
