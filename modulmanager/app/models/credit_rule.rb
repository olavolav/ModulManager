class CreditRule < Rule
  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  def act_credits selected_modules, non_permitted_modules = nil
    credits = 0
    non_permitted_modules = Array.new if non_permitted_modules == nil
    evaluation_modules = Rule::remove_modules_from_array selected_modules, non_permitted_modules
    rule_modules = Array.new
    rule_modules = self.category.modules unless self.category == nil
    self.modules.each { |m| rule_modules.push m }

    evaluation_modules.each do |em|
      rule_modules.each { |rm| credits += em.credits if em.id == rm.id }
    end

#    selected_modules.each do |sm|
#      permitted = true
#      non_permitted_modules.each do |pm|
#        permitted = false if pm.moduledata.id == sm.id
#      end
#      if permitted
#        rule_modules.each do |rm|
#          if sm.id == rm.id
#            credits += sm.credits
#          end
#        end
#      end
#    end
    return credits
  end


  # options beinhaltet die Module, deren Bedingungen noch nicht erfüllt sind
  def evaluate selected_modules, non_permitted_modules = nil
    credits_in_selection = act_credits selected_modules, non_permitted_modules
    if self.relation == "min"
      return 1 if credits_in_selection >= self.count
    elsif self.relation == "max"
      return 1 if credits_in_selection <= self.count
    end
    return -1
  end
  
end
