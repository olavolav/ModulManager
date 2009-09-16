class CreateFociProfil < ActiveRecord::Migration
  def self.up
    create_table :foci_profil, :id => false do |t|
      t.integer :focus_id, :studmodule_id
    end
  end

  def self.down
    drop_table :foci_profil
  end
end
