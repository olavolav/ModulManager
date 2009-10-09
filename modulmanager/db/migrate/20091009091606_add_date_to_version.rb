class AddDateToVersion < ActiveRecord::Migration
  def self.up
    add_column :versions, :date, :date
  end

  def self.down
    remove_column :versions, :date
  end
end
