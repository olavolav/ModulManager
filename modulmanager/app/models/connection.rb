class Connection < ActiveRecord::Base

  has_many :child_connections,
    :foreign_key => "parent_id",
    :class_name => "Connection"

  has_many :child_rules,
    :foreign_key => "parent_id",
    :class_name => "Rule"

  belongs_to :parent,
    :foreign_key => "parent_id",
    :class_name => "Connection"

  belongs_to :version,
    :class_name => "Version",
    :foreign_key => "version_id"

  belongs_to :owner,
    :class_name => "Studmodule",
    :foreign_key => "owner_id"

  def self.create_and_connection name, child_rules = nil, child_connections = nil, focus = nil, version = nil
    c = AndConnection.create :name => name, :focus => focus, :version => version
    if child_rules != nil
      c.child_rules = child_rules
    elsif child_connections != nil
      c.child_connections = child_connections
    end
    return c
  end

  def self.get_connection_array_from_category_string string
    connection_array = Array.new

    categories = string.split(",")
    categories.each do |c|
      c.strip!
      connection_array.push Connection.find(:first, :conditions => "name = '#{c}'")
    end

    return connection_array
  end

  def collect_child_rules selection

    array = Array.new

    self.child_connections.each do |child|
      array.push child.name if child.evaluate(selection.selection_modules) != 1
    end

    return array

  end
  
end
