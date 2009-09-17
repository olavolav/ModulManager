# To change this template, choose Tools | Templates
# and open the template in the editor.

class OrConnection < Connection
  has_many :child_connections, :foreign_key => "parent_id", :class_name => "Connection"
  has_many :child_rules, :foreign_key => "parent_id", :class_name => "Rule"
  belongs_to :parent, :foreign_key => "parent_id", :class_name => "Connection"

  def evaluate selected_modules
    if self.child_connections.length > 0
      c = self.child_connections
      c.each { |d| return true if d.evaluate selected_modules }
    elsif self.child_rules.length > 0
      c = self.child_rules
      c.each { |d| return true if d.evaluate selected_modules }
    end
    return false
  end

end
