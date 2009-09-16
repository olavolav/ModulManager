class AddDescriptionToFocus < ActiveRecord::Migration
  def self.up
    add_column :focus, :description, :text
  end

  def self.down
    remove_column :focus, :description
  end
end
