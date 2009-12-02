class AddPermissionRemovedToSelectedModules < ActiveRecord::Migration
  def self.up
    add_column :selected_modules, :permission_removed, :boolean
  end

  def self.down
    remove_column :selected_modules, :permission_removed
  end
end
