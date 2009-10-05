class AddPartsToStudmodules < ActiveRecord::Migration
  def self.up
    add_column :studmodules, :parts, :integer
  end

  def self.down
    remove_column :studmodules, :parts
  end
end
