# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class AndConnection < Connection

  def collected_credits selected_modules, non_permitted_modules = Array.new
    if self.is_part_of_focus?
      return self.collected_credits_with_focus selected_modules, non_permitted_modules
    else
      credits = 0
      selected_modules.each do |s_module|
        unless s_module.class == Semester
          if s_module.semester.count > 0
            unless non_permitted_modules.include? s_module.moduledata
              if s_module.class == CustomModule
                found = false
                s_module.categories.each { |category| found = true if self.categories.include? category }
                credits += s_module.credits if found
              else
                if s_module.category != nil && s_module.category.exclusive != 1
                  if self.categories.include? s_module.category
                    credits += s_module.credits
                  end
                elsif s_module.category != nil && s_module.category.exclusive == 1
                  if self.exclusive_modules.include? s_module.moduledata
                    credits += s_module.credits
                  end
                else
                  if self.modules.include? s_module.moduledata
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
          if s_module.semester.count > 0
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
      end
      return modules
    end
  end

  def collected_modules_array selected_modules, non_permitted_modules = Array.new
    if self.is_part_of_focus?
      return self.collected_modules_array_with_focus
    else
      modules = Array.new
      selected_modules.each do |s_module|
        unless s_module.class == Semester
          if s_module.semester.count > 0
            unless non_permitted_modules.include? s_module.moduledata
              if s_module.class == CustomModule
                found = false
                s_module.categories.each {|category| found = true if self.categories.include? category}
                modules.push s_module if found
              else
                if s_module.category != nil && s_module.category.exclusive != 1
                  if self.categories.include? s_module.category
                    modules.push s_module
                  end
                else
                  if self.modules.include? s_module.moduledata
                    modules.push s_module
                  end
                end
              end
            end
          end
        end
      end
    end
    return modules
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
        if smodule.semester.count > 0
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
    end
    return credits
  end

  def collected_modules_with_focus selected_modules, n_p_m
    modules = 0
    selected_modules.each do |smodule|
      unless smodule.class == Semester
        if smodule.semester.count > 0
          unless n_p_m.include? smodule.moduledata
            if self.modules.include? smodule.moduledata
              modules += 1
            end
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

  def get_status_description_string_for_printing(modules, errors, rtex = false)

    processing_modules = modules
    modules = Array.new
    processing_modules.each { |m| modules.push m if m.semester.count > 0 && errors.include?(m.moduledata) == false }

    text = "Die Anforderungen dieses Bereiches sind "
    if rtex
      if self.evaluate(modules, errors) != 1
        text += "nicht erfüllt."
      else
        text += "erfüllt"
        if self.removed_too_many_grades? modules
          text += ", da zu viele Noten entfernt wurden"
        end
        text += "."
      end
      text += " "
    else
      text += "<strong>"
      if self.evaluate(modules, errors) != 1
        text += "<span style='color: red;'>nicht erfüllt.</span>"
      else
        text += "<span style='color: green;'>erfüllt"
        if self.removed_too_many_grades? modules
          text += ", da zu viele Noten entfernt wurden"
        end
        text += ".</span>"
      end
      text += "</strong><br>"
    end
    text += "Es werden momentan " +
      self.collected_credits(modules, errors).to_s +
      " von " +
      self.credits_needed.to_s +
      " Credits"
    if self.modules_needed > 0
      text += " sowie " +
        self.collected_modules(modules, errors).to_s +
        " der " +
        self.modules_needed.to_s +
        " in diesem Bereich erforderlichen Module "
    end
    text += " eingebracht."
    unless rtex
      if self.removeable_grades > 0
        text += " Außerdem wurden " +
          self.removed_grades(modules).to_s +
          " von " +
          self.removeable_grades.to_s +
          " erlaubten Noten gestrichen und zählen somit nicht mit in die Gesamtnote."
      else
        text += " In dieser Kategorie ist das Streichen von Noten nicht zulässig."
      end
    end
    return text
  end
  
end
