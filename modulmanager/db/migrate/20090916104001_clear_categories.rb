class ClearCategories < ActiveRecord::Migration
  def self.up
    Category.all.each { |c| c.destroy }
  end

  def self.down
  end
end
