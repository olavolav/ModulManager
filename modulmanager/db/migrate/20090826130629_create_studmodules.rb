class CreateStudmodules < ActiveRecord::Migration
  def self.up
    create_table :studmodules do |t|
      t.string :name
      t.integer :credits
      t.string :short
      t.text :description
      t.integer :category_id

      t.timestamps
    end
  end

  def self.down
    drop_table :studmodules
  end
end
