class CreateModuleSelections < ActiveRecord::Migration
  def self.up
    create_table :module_selections do |t|
      
      t.timestamps
    end
  end

  def self.down
    drop_table :module_selections
  end
end
