class AddSubnameToStudmodules < ActiveRecord::Migration
  def self.up
    add_column :studmodules, :subname, :string
  end

  def self.down
    remove_column :studmodules, :subname
  end
end
