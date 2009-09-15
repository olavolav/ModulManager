class CreateCategoriesStudmodules < ActiveRecord::Migration
  def self.up
    create_table :categories_studmodules, :id => false do |t|
      t.integer :category_id, :studmodule_id
    end
  end

  def self.down
    drop_table :categories_studmodules
  end
end
