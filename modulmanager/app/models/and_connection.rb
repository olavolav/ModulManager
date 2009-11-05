class AndConnection < Connection

  def credits_earned selected_modules
    credits = 0

    if self.child_connections.length > 0
      self.child_connections.each do |connection|
        credits += connection.credits_earned selected_modules
      end
    elsif self.child_rules.length > 0
      self.child_rules.each do |rule|
        if rule.class == CreditRule
          credits += rule.act_credits selected_modules
        end
      end
    end

    return credits
  end

  def modules_earned selected_modules
    modules = 0

    if self.child_connections.length > 0
      self.child_connections.each do |connection|
        modules += connection.modules_earned selected_modules
      end
    elsif self.child_rules.length > 0
      self.child_rules.each do |rule|
        if rule.class == ModuleRule
          modules += rule.act_modules selected_modules
        end
      end
    end

    return modules
  end

  # options kann zwei mögliche Inhalte haben:
  # - Zähler des Semesters, aus der die Überprüfung kommt, bei PermissionRules
  # - Array mit Modulen, deren Voraussetzungen nicht erfüllt sind
  def evaluate selected_modules, options = nil
    if self.child_connections.length > 0
      self.child_connections.each { |d| return -1 unless d.evaluate(selected_modules, options) == 1 }
    elsif self.child_rules.length > 0
      self.child_rules.each { |d| return -1 unless d.evaluate(selected_modules, options) == 1 }
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

  def collect_unique_modules_from_children_without_custom
    found = false
    module_array = collect_unique_modules_from_children
    deletion = Array.new

    module_array.each do |mod|
      if mod.short.include? "custom"
        deletion.push mod
        found = true
      end
    end

    if found
      deletion.each { |d| module_array.delete d }
      module_array.push Studmodule.new :name => "Sonstiges Modul", :short => "" if found
    end

    return module_array

  end

end
