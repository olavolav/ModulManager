class ChangeFocusTypeInConnections < ActiveRecord::Migration
  def self.up
    remove_column :connections, :focus
    add_column :connections, :focus, :integer
  end

  def self.down
    remove_column :connections, :focus
    add_column :connection, :focus, :boolean
  end
end
