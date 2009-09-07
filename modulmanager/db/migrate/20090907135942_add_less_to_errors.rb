class AddLessToErrors < ActiveRecord::Migration
  def self.up
    add_column :errors, :less, :integer
  end

  def self.down
    remove_column :errors, :less
  end
end
