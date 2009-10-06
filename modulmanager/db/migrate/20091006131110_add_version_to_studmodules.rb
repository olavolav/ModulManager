class AddVersionToStudmodules < ActiveRecord::Migration
  def self.up
    add_column :studmodules, :version, :string
  end

  def self.down
    remove_column :studmodules, :version
  end
end
