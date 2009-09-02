class AddFocusToModuleSelections < ActiveRecord::Migration
  def self.up
    add_column :module_selections, :focus_id, :integer
  end

  def self.down
    remove_column :module_selections, :focus_id
  end
end
