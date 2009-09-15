class CreateCategoriesRules < ActiveRecord::Migration
  def self.up
    create_table :categories_rules, :id => false do |t|
      t.integer :category_id, :rule_id
    end
  end

  def self.down
    drop_table :categories_rules
  end
end
