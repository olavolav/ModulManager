class AddDataToConnections < ActiveRecord::Migration
  def self.up

  end

  def self.down
    Rule.all.each { |r| r.destroy }
    Connection.all.each { |c| c.destroy }
  end
end
