class AddVersionToFocus < ActiveRecord::Migration
  def self.up
    add_column :focus, :version, :string
  end

  def self.down
    remove_column :focus, :version
  end
end
