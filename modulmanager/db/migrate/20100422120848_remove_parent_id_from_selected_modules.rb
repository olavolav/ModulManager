class RemoveParentIdFromSelectedModules < ActiveRecord::Migration
  def self.up
    remove_column :selected_modules, :parent_id
  end

  def self.down
    add_column :selected_modules, :parent_id, :integer
  end
end
