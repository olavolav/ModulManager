class CreateFocusStudmodules < ActiveRecord::Migration
  def self.up
    create_table :foci_studmodules, :id => false do |t|
      t.integer :focus_id
      t.integer :studmodule_id
    end
  end

  def self.down
    drop_table :foci_studmodules
  end
end
