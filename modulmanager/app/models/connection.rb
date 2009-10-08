class Connection < ActiveRecord::Base

  belongs_to :version,
    :class_name => "Version",
    :foreign_key => "version_id"

  def self.create_and_connection name, child_rules = nil, child_connections = nil, focus = nil, version = nil
    c = AndConnection.create :name => name, :focus => focus, :version => version
    if child_rules != nil
      c.child_rules = child_rules
    elsif child_connections != nil
      c.child_connections = child_connections
    end
    return c
  end
  
end
