class CreateVersions < ActiveRecord::Migration
  def self.up
    create_table :versions do |t|
      t.string :name
      t.string :short
      t.string :description

      t.timestamps
    end
  end

  def self.down
    drop_table :versions
  end
end
