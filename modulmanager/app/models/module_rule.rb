class ModuleRule < Rule
  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  def act_modules selected_modules
    modules = 0
    self.category.modules.each do |cm|
      selected_modules.each do |m|
        if m.id == cm.id
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
