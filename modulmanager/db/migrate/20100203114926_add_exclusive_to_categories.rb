class AddExclusiveToCategories < ActiveRecord::Migration
  def self.up
    add_column :categories, :exclusive, :integer, :default => 0
  end

  def self.down
    remove_column :categories, :exclusive
  end
end
