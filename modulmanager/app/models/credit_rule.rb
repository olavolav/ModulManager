class CreditRule < Rule

  #  belongs_to :category,
  #    :class_name => "Category",
  #    :foreign_key => "category_id"

  def act_credits selected_modules, non_permitted_modules = nil
    credits = 0
    rule_modules = Array.new
    custom_modules = Array.new
    non_permitted_modules = Array.new if non_permitted_modules == nil
    evaluation_modules = Rule::remove_modules_from_array selected_modules, non_permitted_modules

    rule_modules = self.category.modules unless self.category == nil
    self.modules.each { |m| rule_modules.push m }

    counter = 0

    evaluation_modules.each do |em|

      if em.categories.length == 0 || self.has_category(em.categories)
        if em.class == CustomModule
          custom_modules.push em
        else
          rule_modules.each do |rm|
            if em.moduledata.id == rm.id && em.categories.length == 0
              credits += rm.credits if em.moduledata.id == rm.id
            elsif em.categories.length > 0
              custom_modules.push em
            end
          end
        end

      end

      counter += 1

    end

    custom_modules.uniq!

    custom_modules.each do |m|
      if m.class == CustomModule
        credits += m.credits
      elsif self.has_category(m.categories)
        credits += m.moduledata.credits
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
