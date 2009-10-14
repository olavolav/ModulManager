class ModuleRule < Rule
  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  def act_modules selected_modules
    modules = 0
    rule_modules = Array.new
    rule_modules = self.category.modules unless self.category == nil
    self.modules.each { |m| rule_modules.push m }
    selected_modules.each do |sm|
      rule_modules.each do |rm|
        if sm.id == rm.id
          modules += 1
        end
      end
    end
    return modules
  end

  def evaluate selected_modules
    modules_in_selection = act_modules selected_modules
    if self.relation == "min"
      return 1 if modules_in_selection >= self.count
    elsif self.relation == "max"
      return 1 if modules_in_selection <= self.count
    end
    return -1
  end

end
