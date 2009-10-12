class AddModusToCategories < ActiveRecord::Migration
  def self.up
    add_column :categories, :modus, :string
  end

  def self.down
    remove_column :categories, :modus
  end
end
