class AddDescriptionToRules < ActiveRecord::Migration
  def self.up
    add_column :rules, :description, :text
  end

  def self.down
    remove_column :rules, :description
  end
end
