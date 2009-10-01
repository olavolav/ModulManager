class AddGradeToSelectedModules < ActiveRecord::Migration
  def self.up
    add_column :selected_modules, :grade, :string
  end

  def self.down
    remove_column :selected_modules, :grade
  end
end
