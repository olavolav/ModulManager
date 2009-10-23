class CreditRule < Rule

  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  def act_credits selected_modules, non_permitted_modules = nil
    credits = 0
    # no-type
    rule_modules = Array.new
    # no-type or Studmodules
    non_permitted_modules = Array.new if non_permitted_modules == nil

    # SelectedModules
    evaluation_modules = Rule::remove_modules_from_array selected_modules, non_permitted_modules

    # Studmodules
    rule_modules = self.category.modules unless self.category == nil

    # Studmodules
    self.modules.each { |m| rule_modules.push m }

    # SelectedModules
    evaluation_modules.each do |em|
      # SelectedModules
      if em.category == nil || em.category.id == self.category.id
        # Studmodules
        rule_modules.each { |rm|
          # SelectedModule
          if em.class == CustomModule
            credits += em.credits if em.category.id == self.category.id
          else
#            puts "==="
#            puts "em.moduledata.id  = #{em.moduledata.id}"
#            puts "rm.id             = #{rm.id}"
#            puts "em.category.id    = #{em.category.id}"
#            puts "self.category.id  = #{self.category.id}"
            credits += rm.credits if(em.moduledata.id == rm.id || (em.category != nil && em.category.id == self.category.id))
          end

          #        if em.category == nil
          #          credits += rm.credits
          #        elsif em.category.id == self.category.id
          #          credits += rm.credits
          #        end
        }
      end
    end

    return credits
  end


  # options beinhaltet die Module, deren Bedingungen noch nicht erfüllt sind
  def evaluate selected_modules, non_permitted_modules = nil
    credits_in_selection = act_credits selected_modules, non_permitted_modules
    if self.relation == "min"
      if credits_in_selection >= self.count
        #        puts "Regel #{self.id} erfüllt..."
        return 1
      end
    elsif self.relation == "max"
      return 1 if credits_in_selection <= self.count
    end

    #    puts "Regel #{self.id} nicht erfüllt..."
    return -1
  end
  
end
