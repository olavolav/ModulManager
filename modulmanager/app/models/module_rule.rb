class ModuleRule < Rule

  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  def act_modules selected_modules, non_permitted_modules = nil
    modules = 0
    rule_modules = Array.new

    non_permitted_modules = Array.new if non_permitted_modules == nil
    evaluation_modules = Rule::remove_modules_from_array selected_modules, non_permitted_modules
    
    rule_modules = self.category.modules unless self.category == nil
    self.modules.each { |m| rule_modules.push m }

    evaluation_modules.each do |em|
      rule_modules.each { |rm| modules += 1 if em.id == rm.id }
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
