class CreateSemesters < ActiveRecord::Migration
  def self.up
    create_table :semesters do |t|
      t.integer :selection_id
      t.integer :count

      t.timestamps
    end
  end

  def self.down
    drop_table :semesters
  end
end
