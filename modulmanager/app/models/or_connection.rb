# To change this template, choose Tools | Templates
# and open the template in the editor.

class OrConnection < Connection
  has_many :child_connections, :foreign_key => "parent_id", :class_name => "Connection"
  has_many :child_rules, :foreign_key => "parent_id", :class_name => "Rule"
  belongs_to :parent, :foreign_key => "parent_id", :class_name => "Connection"

  def credits_earned
    return 0
  end

  def evaluate selected_modules
    if self.child_connections.length > 0
      c = self.child_connections
      c.each { |d| return 1 if d.evaluate(selected_modules) == 1 }
    elsif self.child_rules.length > 0
      c = self.child_rules
      c.each { |d| return 1 if d.evaluate(selected_modules) == 1 }
    end
    return -1
  end

  def credits_needed
    credits = 9999
    if self.child_connections.length > 0
      c = self.child_connections
      c.each { |d| credits = d.credits_needed if d.credits_needed < credits }
    elsif self.child_rules.length > 0
      c = self.child_rules
      c.each { |d| credits = d.count if d.count < credits }
    end
    return credits
  end

  def modules_needed
    modules = 9999
    if self.child_connections.length > 0
      c = self.child_connections
      c.each { |d| modules = d.modules_needed if d.modules_needed < modules }
    elsif self.child_rules.length > 0
      c = self.child_rules
      c.each { |d| modules = d.count if d.count < modules }
    end
    return modules
  end

end
