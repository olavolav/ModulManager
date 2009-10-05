class AddFocusToConnections < ActiveRecord::Migration
  def self.up
    add_column :connections, :focus, :boolean
  end

  def self.down
    remove_column :connections, :focus
  end
end
