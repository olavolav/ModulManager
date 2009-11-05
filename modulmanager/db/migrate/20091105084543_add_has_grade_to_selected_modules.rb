class AddHasGradeToSelectedModules < ActiveRecord::Migration
  def self.up
    add_column :selected_modules, :has_grade, :boolean
  end

  def self.down
    remove_column :selected_modules, :has_grade
  end
end
