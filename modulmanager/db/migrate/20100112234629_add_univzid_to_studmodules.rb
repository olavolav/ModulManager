class AddUnivzidToStudmodules < ActiveRecord::Migration
  def self.up
    add_column :studmodules, :univzid, :string
  end

  def self.down
    remove_column :studmodules, :univzid
  end
end
