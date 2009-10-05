class AddShortToSelectedModules < ActiveRecord::Migration
  def self.up
    add_column :selected_modules, :short, :string
  end

  def self.down
    remove_column :selected_modules, :short
  end
end
