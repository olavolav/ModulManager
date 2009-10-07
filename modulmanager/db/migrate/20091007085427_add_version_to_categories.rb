class AddVersionToCategories < ActiveRecord::Migration
  def self.up
    add_column :categories, :version, :string
  end

  def self.down
    remove_column :categories, :version
  end
end
