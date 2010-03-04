class ModuleRule < Rule

  def collected_modules selected_modules, non_permitted_modules = nil
    modules = 0
    rule_modules = self.category.modules unless self.category == nil
    evaluation_modules = Rule::remove_modules_from_array selected_modules, non_permitted_modules

    evaluation_modules.each do |e_module|
      if e_module.category != nil && e_module.category.exclusive != 1
        if e_module.category == self.category
          if rule_modules.include? e_module.moduledata
            modules += 1
          end
        end
      elsif e_module.moduledata.categories.length > 0
        if e_module.moduledata.categories.include? self.category
          if rule_modules.include? e_module.moduledata
            modules += 1
          end
        end
      end
    end
    return modules
  end

  #  def act_modules selected_modules, non_permitted_modules = nil
  #    modules = 0
  #    rule_modules = Array.new
  #    custom_modules = Array.new
  #    non_permitted_modules = Array.new if non_permitted_modules == nil
  #    evaluation_modules = Rule::remove_modules_from_array selected_modules, non_permitted_modules
  #
  #    rule_modules = self.category.modules unless self.category == nil
  #    #    self.modules.each { |m| rule_modules.push m }
  #
  #    evaluation_modules.each do |em|
  #
  #      if em.categories.length == 0 || self.has_category(em.categories)
  #        if em.class == CustomModule
  #          custom_modules.push em
  #        else
  #          rule_modules.each do |rm|
  #            if em.moduledata.id == rm.id && em.categories.length == 0
  #              modules += 1 if em.moduledata.id == rm.id
  #            elsif em.categories.length > 0
  #              custom_modules.push em
  #            end
  #          end
  #        end
  #
  #      end
  #
  #    end
  #
  #    custom_modules.uniq!
  #
  #    custom_modules.each do |m|
  #      if m.class == CustomModule
  #        modules += 1
  #      elsif m.class != CustomModule && self.has_category(m.categories)
  #        modules += 1
  #      end
  #    end
  #
  #    return modules
  #  end

  #  def evaluate selected_modules, non_permitted_modules = nil
  #    return -1 if self.removed_too_many_grades? selected_modules
  #    #    modules_in_selection = act_modules selected_modules, non_permitted_modules
  #    modules_in_selection = collected_modules selected_modules, non_permitted_modules
  #    if self.relation == "min"
  #      return 1 if modules_in_selection >= self.count
  #    elsif self.relation == "max"
  #      return 1 if modules_in_selection <= self.count
  #    end
  #    return -1
  #  end

  def evaluate selected_modules, non_permitted_modules = nil
    return -1 if self.removed_too_many_grades? selected_modules
    modules_in_selection = self.collected_modules selected_modules, non_permitted_modules
    if self.relation == "min"
      if modules_in_selection < self.count
        return -1
      end
    elsif self.relation == "max"
      if modules_in_selection > self.count
        return -1
      end
    end
    return 1
  end

end
