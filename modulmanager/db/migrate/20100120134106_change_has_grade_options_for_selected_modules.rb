class ChangeHasGradeOptionsForSelectedModules < ActiveRecord::Migration
  def self.up
    remove_column :selected_modules, :has_grade
    add_column :selected_modules, :has_grade, :boolean, :default => true
  end

  def self.down
    remove_column :selected_modules, :has_grade
    add_column :selected_modules, :has_grade, :boolean
  end
end
