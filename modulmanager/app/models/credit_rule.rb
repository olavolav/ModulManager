class CreditRule < Rule
  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  def act_credits selected_modules
    credits = 0
    unless self.category == nil
      selected_modules.each do |m|
        self.category.modules.each do |cm|
          if cm.id == m.id
            credits += m.credits
          end
        end
      end
    else
      credits = 0
    end
    return credits
  end

  def evaluate selected_modules
#    puts "Regel #{self.id} wird ausgewertet...\n"
    credits_in_selection = act_credits selected_modules
    
    if self.relation == "min"
      return 1 if credits_in_selection >= self.count
    elsif self.relation == "max"
      return 1 if credits_in_selection <= self.count
    end

    return -1

  end
  
end
