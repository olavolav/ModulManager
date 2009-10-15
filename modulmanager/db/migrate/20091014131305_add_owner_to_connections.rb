class AddOwnerToConnections < ActiveRecord::Migration
  def self.up
    add_column :connections, :owner_id, :integer
  end

  def self.down
    remove_column :connections, :owner_id
  end
end
