class ClearStudmodules < ActiveRecord::Migration
  def self.up
    Studmodule.all.each { |s| s.destroy }
  end

  def self.down
  end
end
