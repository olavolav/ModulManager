class CreateErrors < ActiveRecord::Migration
  def self.up
    create_table :errors do |t|
      t.integer :rule_id
      t.string :rule_name
      t.text :description

      t.timestamps
    end
  end

  def self.down
    drop_table :errors
  end
end
