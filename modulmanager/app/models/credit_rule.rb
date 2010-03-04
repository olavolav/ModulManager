class CreditRule < Rule

  def collected_credits selected_modules, non_permitted_modules = nil
    
    credits = 0
    rule_modules = self.category.modules unless self.category == nil
    evaluation_modules = Rule::remove_modules_from_array selected_modules, non_permitted_modules

    evaluation_modules.each do |e_module|
      unless e_module.categories.length < 1 && e_module.moduledata.categories.length < 1
        if e_module.categories.include?(self.category) || e_module.moduledata.categories.include?(self.category)
          if rule_modules.include? e_module.moduledata
            e_module.credits == nil ? credits += e_module.moduledata.credits : credits += e_module.credits
          end
        end
      end
    end
    return credits
  end

#  def act_credits selected_modules, non_permitted_modules = nil
#    credits = 0
#    rule_modules = Array.new
#    custom_modules = Array.new
#    non_permitted_modules = Array.new if non_permitted_modules == nil
#    evaluation_modules = Rule::remove_modules_from_array selected_modules, non_permitted_modules
#
#    rule_modules = self.category.modules unless self.category == nil
#    #    self.modules.each { |m| rule_modules.push m }
#
#    evaluation_modules.each do |em|
#
#      if em.categories.length == 0 || self.has_category(em.categories)
#        if em.class == CustomModule
#          custom_modules.push em
#        else
#          rule_modules.each do |rm|
#            if em.moduledata.id == rm.id && em.categories.length == 0
#              credits += rm.credits if em.moduledata.id == rm.id
#            elsif em.categories.length > 0
#              custom_modules.push em
#            end
#          end
#        end
#
#      end
#
#    end
#
#    custom_modules.uniq!
#
#    custom_modules.each do |m|
#      if m.class == CustomModule
#        credits += m.credits
#      elsif m.class != CustomModule && self.has_category(m.categories)
#        credits += m.moduledata.credits
#      end
#    end
#
#    return credits
#  end

  def evaluate selected_modules, non_permitted_modules = nil
    puts "checking credit-rule..."
    return -1 if self.removed_too_many_grades? selected_modules
    puts "not removed too many grades"
    #    credits_in_selection = act_credits selected_modules, non_permitted_modules
    credits_in_selection = self.collected_credits selected_modules, non_permitted_modules
    puts "credits_in_selection : #{credits_in_selection}"
    if self.relation == "min"
      puts "min-relation"
      if credits_in_selection < self.count
        puts "not enough credits"
        return -1
      end
    elsif self.relation == "max"
      puts "max-relation"
      if credits_in_selection > self.count
        puts "too much credits"
        return -1
      end
    end
    puts "everything is OK"
    return 1
  end
  
end
