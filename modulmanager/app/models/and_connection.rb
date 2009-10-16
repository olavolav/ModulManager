# To change this template, choose Tools | Templates
# and open the template in the editor.

class AndConnection < Connection
  has_many :child_connections, :foreign_key => "parent_id", :class_name => "Connection"
  has_many :child_rules, :foreign_key => "parent_id", :class_name => "Rule"
  belongs_to :parent, :foreign_key => "parent_id", :class_name => "Connection"

  def credits_earned selected_modules, non_permitted_modules

    module_ids = collect_unique_modules_from_rules

    module_array = Array.new

    module_ids.each do |id|
      module_array.push Studmodule.find(id)
    end

    credits = 0

    module_array.each do |m|
      selected_modules.each do |sm|
        credits += m.credits if sm.id == m.id
      end
    end
    return credits
  end

  def modules_earned selected_modules, non_permitted_modules
    modules = 0
    if self.child_connections.length > 0
      self.child_connections.each do |cc|
        modules += cc.modules_earned selected_modules, non_permitted_modules
      end
    elsif self.child_rules.length > 0
      self.child_rules.each do |cr|
        modules += cr.act_modules(selected_modules, non_permitted_modules) if cr.class == ModuleRule
      end
    end
    return modules
  end

  # options kann zwei mögliche Inhalte haben:
  # - Zähler des Semesters, aus der die Überprüfung kommt, bei PermissionRules
  # - Array mit Modulen, deren Voraussetzungen nicht erfüllt sind
  def evaluate selected_modules, options = nil
    if self.child_connections.length > 0
      c = self.child_connections
      c.each { |d| return -1 if d.evaluate(selected_modules, options) == -1 }
    elsif self.child_rules.length > 0
      c = self.child_rules
      c.each { |d| return -1 if d.evaluate(selected_modules, options) == -1 }
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

  def collect_unique_modules_from_rules
    modules = Array.new
    self.child_rules.each do |rule|
      rule.category.modules.each { |m| modules.push m.id }
      rule.modules.each { |m| modules.push m.id }
    end
    if self.child_connections.length > 0
      self.child_connections.each { |connection|
        collected_modules = connection.collect_unique_modules_from_rules
        collected_modules.each { |m| modules.push m } unless collected_modules == nil
      }
    end
    modules.uniq!
    return modules
  end

end
