class AddCategoryIdToSelectedModules < ActiveRecord::Migration
  def self.up
    add_column :selected_modules, :category_id, :integer
  end

  def self.down
    remove_column :selected_modules, :category_id
  end
end
