class AddUniqueNameToCategories < ActiveRecord::Migration
  def self.up
    add_column :categories, :unique_name, :string
  end

  def self.down
    remove_column :categories, :unique_name
  end
end
