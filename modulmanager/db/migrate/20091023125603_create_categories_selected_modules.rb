class CreateCategoriesSelectedModules < ActiveRecord::Migration
  def self.up
    create_table :categories_selected_modules, :id => false do |t|
      t.integer :category_id, :selected_module_id
    end
  end

  def self.down
    drop_table :categories_selected_modules
  end
end
