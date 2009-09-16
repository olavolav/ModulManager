class CreateFociPflicht < ActiveRecord::Migration
  def self.up
    create_table :foci_pflicht, :id => false do |t|
      t.integer :focus_id, :studmodule_id
    end
  end

  def self.down
    drop_table :foci_pflicht
  end
end
