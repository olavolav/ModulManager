class AddPathToVersions < ActiveRecord::Migration
  def self.up
    add_column :versions, :path, :string
  end

  def self.down
    remove_column :versions, :path
  end
end
