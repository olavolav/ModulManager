class AddPositionToConnections < ActiveRecord::Migration
  def self.up
    add_column :connections, :position, :integer
  end

  def self.down
    remove_column :connections, :position
  end
end
