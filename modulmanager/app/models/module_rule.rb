class ModuleRule < Rule
  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  def act_modules selected_modules, non_permitted_modules = nil
    modules = 0
    rule_modules = Array.new
    rule_modules = self.category.modules unless self.category == nil
    self.modules.each { |m| rule_modules.push m }
    selected_modules.each do |sm|
      permitted = true
      non_permitted_modules.each do |pm|
        permitted = false if pm.moduledata.id == sm.id
      end
      if permitted
        rule_modules.each do |rm|
          if sm.id == rm.id
            modules += 1
          end
        end
      end
    end
    return modules
  end

  def evaluate selected_modules, non_permitted_modules = nil
    modules_in_selection = act_modules selected_modules, non_permitted_modules
    if self.relation == "min"
      return 1 if modules_in_selection >= self.count
    elsif self.relation == "max"
      return 1 if modules_in_selection <= self.count
    end
    return -1
  end

end
