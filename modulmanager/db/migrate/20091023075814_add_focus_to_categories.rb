class AddFocusToCategories < ActiveRecord::Migration
  def self.up
    add_column :categories, :focus_id, :integer
  end

  def self.down
    remove_column :categories, :focus_id
  end
end
