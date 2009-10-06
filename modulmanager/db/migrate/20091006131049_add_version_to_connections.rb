class AddVersionToConnections < ActiveRecord::Migration
  def self.up
    add_column :connections, :version, :string
  end

  def self.down
    remove_column :connections, :version
  end
end
