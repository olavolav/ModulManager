class ChangeVersionTypes < ActiveRecord::Migration
  def self.up
    remove_column :connections, :version
    remove_column :studmodules, :version
    remove_column :focus, :version
    remove_column :module_selections, :version
    remove_column :categories, :version
    add_column :connections, :version_id, :integer
    add_column :studmodules, :version_id, :integer
    add_column :focus, :version_id, :integer
    add_column :module_selections, :version_id, :integer
    add_column :categories, :version_id, :integer
  end

  def self.down
    remove_column :connections, :version
    remove_column :studmodules, :version
    remove_column :focus, :version
    remove_column :module_selections, :version
    remove_column :categories, :version
    add_column :connections, :version, :string
    add_column :studmodules, :version, :string
    add_column :focus, :version, :string
    add_column :module_selections, :version, :string
    add_column :categories, :version, :string
  end
end
