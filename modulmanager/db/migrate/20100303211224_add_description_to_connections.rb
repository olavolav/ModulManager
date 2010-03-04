class AddDescriptionToConnections < ActiveRecord::Migration
  def self.up
    add_column :connections, :description, :text
  end

  def self.down
    remove_column :connections, :description
  end
end
