class AddCustumModuleAttributesToSelectedModules < ActiveRecord::Migration
  def self.up
    add_column :selected_modules, :type, :string
    add_column :selected_modules, :name, :string
    add_column :selected_modules, :credits, :integer
  end

  def self.down
    remove_column :selected_modules, :type
    remove_column :selected_modules, :name
    remove_column :selected_modules, :credits
  end
end
