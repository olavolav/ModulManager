# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class CreditRule < Rule

  def collected_credits selected_modules, non_permitted_modules = nil
    credits = 0
    rule_modules = self.category.modules unless self.category == nil
    evaluation_modules = Rule::remove_modules_from_array selected_modules, non_permitted_modules

    evaluation_modules.each do |e_module|
      if e_module.semester.count > 0
        if e_module.class == CustomModule
          e_module.categories.each { |category| credits += e_module.credits if self.category == category }
        else
          if e_module.category != nil && e_module.category.exclusive != 1
            if e_module.category == self.category
              if rule_modules.include? e_module.moduledata
                e_module.credits == nil ? credits += e_module.moduledata.credits : credits += e_module.credits
              end
            end
          elsif e_module.moduledata.categories.length > 0
            if e_module.moduledata.categories.include? self.category
              if rule_modules.include? e_module.moduledata
                #              e_module.credits == nil ? credits += e_module.moduledata.credits : credits += e_module.credits
                credits += e_module.credits unless e_module.credits == nil
              end
            end
          end
        end
      end
    end
    return credits
  end

  def collected_credits_with_focus selected_modules, n_p_m
    credits = 0
    n_p_m = Array.new if n_p_m == nil
    selected_modules.each do |smodule|
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
    return credits
  end

  def evaluate selected_modules, non_permitted_modules = nil
    if self.is_part_of_focus?
      return evaluate_with_focus selected_modules, non_permitted_modules
    else
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

  def evaluate_with_focus selected_modules, n_p_m
    credits_in_selection = self.collected_credits_with_focus selected_modules, n_p_m
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
