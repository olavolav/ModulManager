class CreateGroupsStudmodules < ActiveRecord::Migration
  def self.up
    create_table :groups_studmodules, :id => false do |t|
      t.integer :group_id, :studmodule_id
    end
  end

  def self.down
    drop_table :groups_studmodules
  end
end
