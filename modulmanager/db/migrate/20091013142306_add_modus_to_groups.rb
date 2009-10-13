class AddModusToGroups < ActiveRecord::Migration
  def self.up
    add_column :groups, :modus, :string
  end

  def self.down
    remove_column :groups, :modus
  end
end
