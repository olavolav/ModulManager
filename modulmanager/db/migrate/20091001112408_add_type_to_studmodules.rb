class AddTypeToStudmodules < ActiveRecord::Migration
  def self.up
    add_column :studmodules, :type, :string
  end

  def self.down
    remove_column :studmodules, :type
  end
end
