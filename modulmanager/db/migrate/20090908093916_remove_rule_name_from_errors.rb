class RemoveRuleNameFromErrors < ActiveRecord::Migration
  def self.up
    remove_column :errors, :rule_name
  end

  def self.down
    add_column :errors, :rule_name, :string
  end
end
