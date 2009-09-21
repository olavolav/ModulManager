# To change this template, choose Tools | Templates
# and open the template in the editor.

class AndConnection < Connection
  has_many :child_connections, :foreign_key => "parent_id", :class_name => "Connection"
  has_many :child_rules, :foreign_key => "parent_id", :class_name => "Rule"
  belongs_to :parent, :foreign_key => "parent_id", :class_name => "Connection"
  
  def evaluate selected_modules
    if self.child_connections.length > 0
      c = self.child_connections
      c.each { |d| return -1 if d.evaluate(selected_modules) == -1 }
    elsif self.child_rules.length > 0
      c = self.child_rules
      c.each { |d| return -1 if d.evaluate(selected_modules) == -1 }
    end
    return 1
  end

  def credits_needed
    credits = 0
    if self.child_connections.length > 0
      c = self.child_connections
      c.each { |d| credits += d.credits_needed }
    elsif self.child_rules.length > 0
      c = self.child_rules
      c.each { |d| credits += d.count if d.class == CreditRule }
    end
    return credits
  end

  def modules_needed
    modules = 0
    if self.child_connections.length > 0
      c = self.child_connections
      c.each { |d| modules += d.modules_needed }
    elsif self.child_rules.length > 0
      c = self.child_rules
      c.each { |d| modules += d.count if d.class == ModuleRule }
    end
    return modules
  end

end
