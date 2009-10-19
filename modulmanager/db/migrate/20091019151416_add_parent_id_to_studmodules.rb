class AddParentIdToStudmodules < ActiveRecord::Migration
  def self.up
    add_column :studmodules, :parent_id, :integer
  end

  def self.down
    remove_column :studmodule, :parent_id
  end
end
