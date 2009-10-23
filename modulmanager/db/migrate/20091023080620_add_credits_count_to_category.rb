class AddCreditsCountToCategory < ActiveRecord::Migration
  def self.up
    add_column :categories, :credits, :integer
    add_column :categories, :count, :integer
  end

  def self.down
    remove_column :categories, :count
    remove_column :categories, :credits
  end
end
