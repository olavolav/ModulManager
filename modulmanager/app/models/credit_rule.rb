class CreditRule < Rule

  def collected_credits selected_modules, non_permitted_modules = nil
    credits = 0
    rule_modules = self.category.modules unless self.category == nil
    evaluation_modules = Rule::remove_modules_from_array selected_modules, non_permitted_modules

    evaluation_modules.each do |e_module|
      if e_module.category != nil && e_module.category.exclusive != 1
        if e_module.category == self.category
          if rule_modules.include? e_module.moduledata
            e_module.credits == nil ? credits += e_module.moduledata.credits : credits += e_module.credits
          end
        end
      elsif e_module.moduledata.categories.length > 0
        if e_module.moduledata.categories.include? self.category
          if rule_modules.include? e_module.moduledata
            e_module.credits == nil ? credits += e_module.moduledata.credits : credits += e_module.credits
          end
        end
      end
    end
    return credits
  end

  def evaluate selected_modules, non_permitted_modules = nil
    return -1 if self.removed_too_many_grades? selected_modules
    credits_in_selection = self.collected_credits selected_modules, non_permitted_modules
    if self.relation == "min"
      if credits_in_selection < self.count
        return -1
      end
    elsif self.relation == "max"
      if credits_in_selection > self.count
        return -1
      end
    end
    return 1
  end
  
end
