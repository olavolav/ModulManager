class AddCategoryToRules < ActiveRecord::Migration
  def self.up
    add_column :rules, :category_id, :integer
  end

  def self.down
    remove_column :rules, :category_id
  end
end
