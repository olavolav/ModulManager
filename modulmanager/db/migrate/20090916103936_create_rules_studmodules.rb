class CreateRulesStudmodules < ActiveRecord::Migration
  def self.up
    create_table :rules_studmodules, :id => false do |t|
      t.integer :rule_id, :studmodule_id
    end
  end

  def self.down
    drop_table :rules_studmodules
  end
end
