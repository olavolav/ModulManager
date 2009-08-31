class CreateSelectedModules < ActiveRecord::Migration
  def self.up
    create_table :selected_modules do |t|
      t.integer :module_id
      t.integer :semester_id

      t.timestamps
    end
  end

  def self.down
    drop_table :selected_modules
  end
end
