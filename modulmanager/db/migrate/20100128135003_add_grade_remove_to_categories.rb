class AddGradeRemoveToCategories < ActiveRecord::Migration
  def self.up
    add_column :categories, :grade_remove, :integer, :default => 0
  end

  def self.down
    remove_column :categories, :grade_remove
  end
end
