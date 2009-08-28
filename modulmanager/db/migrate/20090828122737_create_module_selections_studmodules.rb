class CreateModuleSelectionsStudmodules < ActiveRecord::Migration
  def self.up
    create_table :module_selections_studmodules, :id => false do |t|
      t.integer :module_selection_id, :studmodule_id
      
      t.timestamps
    end
  end

  def self.down
    drop_table :module_selections_studmodules
  end
end
