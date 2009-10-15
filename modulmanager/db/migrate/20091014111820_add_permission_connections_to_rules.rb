class AddPermissionConnectionsToRules < ActiveRecord::Migration
  def self.up
    add_column :rules, :condition_id, :integer
  end

  def self.down
    remove_column :rules, :condition_id
  end
end
