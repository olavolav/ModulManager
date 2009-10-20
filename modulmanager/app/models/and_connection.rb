class AndConnection < Connection

  has_many :child_connections,
    :foreign_key => "parent_id",
    :class_name => "Connection"

  has_many :child_rules,
    :foreign_key => "parent_id",
    :class_name => "Rule"

  belongs_to :parent,
    :foreign_key => "parent_id",
    :class_name => "Connection"

  def credits_earned selected_modules
    credits = 0
    modules = collect_unique_modules_from_children
    modules.each do |m|
      selected_modules.each { |sm| 
        if sm.class == CustomModule
          credits += sm.credits
        else
          credits += m.credits if sm.moduledata.id == m.id
        end
      }
    end

    return credits
  end

  def modules_earned selected_modules
    modules = 0
    module_array = collect_unique_modules_from_children

    module_array.each do |m|
      selected_modules.each { |sm| modules += 1 if m.id == sm.id }
    end

    return modules
  end

  # options kann zwei mögliche Inhalte haben:
  # - Zähler des Semesters, aus der die Überprüfung kommt, bei PermissionRules
  # - Array mit Modulen, deren Voraussetzungen nicht erfüllt sind
  def evaluate selected_modules, options = nil
    if self.child_connections.length > 0
      self.child_connections.each { |d| return -1 if d.evaluate(selected_modules, options) == -1 }
    elsif self.child_rules.length > 0
      self.child_rules.each { |d| return -1 if d.evaluate(selected_modules, options) == -1 }
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

  def collect_unique_modules_from_children
    module_ids = Array.new
    module_array = Array.new

    self.child_rules.each do |rule|
      rule.category.modules.each { |m| module_ids.push m.id } unless rule.category == nil
      rule.modules.each { |m| module_ids.push m.id }
    end

    if self.child_connections.length > 0
      self.child_connections.each do |connection|
        collected_modules = connection.collect_unique_modules_from_children
        collected_modules.each { |m| module_ids.push m } unless collected_modules == nil
      end
    end
    
    module_ids.uniq.each { |id| module_array.push Studmodule.find(id) }

    return module_array
  end

end
