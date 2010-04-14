class AndConnection < Connection

  def collected_credits selected_modules, non_permitted_modules = Array.new
    if self.is_part_of_focus?
      return self.collected_credits_with_focus selected_modules, non_permitted_modules
    else
      credits = 0
      selected_modules.each do |s_module|
        unless s_module.class == Semester
          unless non_permitted_modules.include? s_module.moduledata
            if s_module.class == CustomModule
              found = false
              s_module.categories.each { |category| found = true if self.categories.include? category }
              credits += s_module.credits if found
            else
              if s_module.category != nil && s_module.category.exclusive != 1
                if self.categories.include? s_module.category
                  if s_module.credits == nil
                    credits += s_module.moduledata.credits
                  else
                    credits += s_module.credits
                  end
                end
              else
                if self.modules.include? s_module.moduledata
                  if s_module.credits == nil
                    #                    credits += s_module.moduledata.credits
                    credits += s_module.credits unless s_module.credits == nil
                  else
                    credits += s_module.credits
                  end
                end
              end
            end
          end
        end
      end
      return credits
    end
  end

  def collected_modules selected_modules, non_permitted_modules = Array.new
    if self.is_part_of_focus?
      return self.collected_modules_with_focus selected_modules, non_permitted_modules
    else
      modules = 0
      selected_modules.each do |s_module|
        unless s_module.class == Semester
          unless non_permitted_modules.include? s_module.moduledata
            if s_module.class == CustomModule
              found = false
              s_module.categories.each { |category| found = true if self.categories.include? category }
              modules += 1 if found
            else
              if s_module.category != nil && s_module.category.exclusive != 1
                if self.categories.include? s_module.category
                  modules += 1
                end
              else
                if self.modules.include? s_module.moduledata
                  modules += 1
                end
              end
            end
          end
        end
      end
      return modules
    end
  end

  def evaluate selected_modules, options = nil
    options = Array.new if options == nil
    if self.has_parent_focus?
      return evaluate_with_focus selected_modules, options
    else
      if self.child_connections.length > 0
        self.child_connections.each { |d| return -1 unless d.evaluate(selected_modules, options) == 1 }
      elsif self.child_rules.length > 0
        self.child_rules.each { |d| return -1 unless d.evaluate(selected_modules, options) == 1 }
      end
      if self.collected_credits(selected_modules, options) >= self.credits_needed
        if self.collected_modules(selected_modules, options) >= self.modules_needed
          return 1
        end
      end
      return -1
    end
  end

  def evaluate_with_focus selected_modules, non_permitted_modules
    if self.child_connections.length > 0
      self.child_connections.each { |d| return -1 unless d.evaluate_with_focus(selected_modules, non_permitted_modules) == 1 }
    elsif self.child_rules.length > 0
      self.child_rules.each { |d| return -1 unless d.evaluate_with_focus(selected_modules, non_permitted_modules) == 1 }
    end
    if self.collected_credits_with_focus(selected_modules, non_permitted_modules) >= self.credits_needed
      if self.collected_modules_with_focus(selected_modules, non_permitted_modules) >= self.modules_needed
        return 1
      end
    end
    return -1
  end

  def collected_credits_with_focus selected_modules, n_p_m
    credits = 0
    selected_modules.each do |smodule|
      unless smodule.class == Semester
        unless n_p_m.include? smodule.moduledata
          if self.modules.include? smodule.moduledata
            if smodule.credits == nil
              credits += smodule.moduledata.credits
            else
              credits += smodule.credits
            end
          end
        end
      end
    end
    return credits
  end

  def collected_modules_with_focus selected_modules, n_p_m
    modules = 0
    selected_modules.each do |smodule|
      unless smodule.class == Semester
        unless n_p_m.include? smodule.moduledata
          if self.modules.include? smodule.moduledata
            modules += 1
          end
        end
      end
    end
    return modules
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
