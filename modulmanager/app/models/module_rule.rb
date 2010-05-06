# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class ModuleRule < Rule

  def collected_modules selected_modules, non_permitted_modules = nil
    if self.is_part_of_focus?
      return self.collected_modules_with_focus selected_modules, non_permitted_modules
    else
      modules = 0
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
        end
      end
      return modules
    end
  end

  def collected_modules_with_focus selected_modules, n_p_m
    modules = 0
    n_p_m = Array.new if n_p_m == nil

    selected_modules.each do |smodule|
      if smodule.semester.count > 0
        unless n_p_m.include? smodule.moduledata
          if self.modules.include? smodule.moduledata
            modules += 1
          end
        end
      end
    end
    return modules
  end

  def evaluate selected_modules, non_permitted_modules = nil
    if self.is_part_of_focus?
      return evaluate_with_focus selected_modules, non_permitted_modules
    else
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

  def evaluate_with_focus selected_modules, non_permitted_modules
    modules_in_selection = self.collected_modules_with_focus selected_modules, non_permitted_modules
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
