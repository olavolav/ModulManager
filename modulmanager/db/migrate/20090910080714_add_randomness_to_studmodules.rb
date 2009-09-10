class AddRandomnessToStudmodules < ActiveRecord::Migration
  def self.up
    add_column :studmodules, :randomness, :string
    Studmodule.all.each do |s|
      s.randomness = "p"
      s.save
    end
  end

  def self.down
    remove_column :studmodules, :randomness
  end
end
