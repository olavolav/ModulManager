class ModuleRule < Rule
  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  @act_modules = 0

  def act_modules
    @act_modules
  end

  def evaluate selected_modules

    modules_in_selection = 0

    self.category.modules.each do |cm|
      selected_modules.each do |m|
        if m.id == cm.id
          modules_in_selection += 1
        end
      end
    end

    @act_modules = modules_in_selection

    if self.relation == "min"
      return 1 if modules_in_selection >= self.count
    elsif self.relation == "max"
      return 1 if modules_in_selection <= self.count
    end

    return -1

  end

end
