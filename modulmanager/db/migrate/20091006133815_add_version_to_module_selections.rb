class AddVersionToModuleSelections < ActiveRecord::Migration
  def self.up
    add_column :module_selections, :version, :string
  end

  def self.down
    remove_column :module_selections, :version
  end
end
