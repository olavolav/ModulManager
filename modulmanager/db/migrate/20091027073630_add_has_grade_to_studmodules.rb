 class AddHasGradeToStudmodules < ActiveRecord::Migration
  def self.up
    add_column :studmodules, :has_grade, :boolean
  end

  def self.down
    remove_column :studmodules, :has_grade
  end
end
