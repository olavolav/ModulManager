class RemoveCategoriesRules < ActiveRecord::Migration
  def self.up
    drop_table :categories_rules
  end

  def self.down
    create_table :categories_rules, :id => false do |t|
      t.integer :category_id
      t.integer :rule_id
    end
  end
end
