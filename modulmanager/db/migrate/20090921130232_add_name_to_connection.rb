class AddNameToConnection < ActiveRecord::Migration
  def self.up
    add_column :connections, :name, :string
  end

  def self.down
    remove_column :connections, :name
  end
end
