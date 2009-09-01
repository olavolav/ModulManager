class CreateGroupsRules < ActiveRecord::Migration
  def self.up
    create_table :groups_rules, :id => false do |t|
      t.integer :group_id, :rule_id
    end
  end

  def self.down
    drop_table :groups_rules
  end
end
