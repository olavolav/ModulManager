class AddParentIdToSelectedModules < ActiveRecord::Migration
  def self.up
    add_column :selected_modules, :parent_id, :integer
  end

  def self.down
    remove_column :selcted_modules, :parent_id
  end
end
