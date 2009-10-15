class CreditRule < Rule
  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  def act_credits selected_modules
    credits = 0
    rule_modules = Array.new
    rule_modules = self.category.modules unless self.category == nil
    self.modules.each { |m| rule_modules.push m }
    selected_modules.each do |sm|
      rule_modules.each do |rm|
        if sm.id == rm.id
          credits += sm.credits
        end
      end
    end
    return credits
  end

  def evaluate selected_modules, my_semester = nil
    credits_in_selection = act_credits selected_modules
    if self.relation == "min"
      return 1 if credits_in_selection >= self.count
    elsif self.relation == "max"
      return 1 if credits_in_selection <= self.count
    end
    return -1
  end
  
end
