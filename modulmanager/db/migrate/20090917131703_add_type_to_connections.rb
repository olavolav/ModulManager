class AddTypeToConnections < ActiveRecord::Migration
  def self.up
    add_column :connections, :type, :string
  end

  def self.down
    remove_column :connections, :type
  end
end
