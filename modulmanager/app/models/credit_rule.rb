class CreditRule < Rule
  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  @act_credits = 0

  def act_credits
    @act_credits
  end

  def evaluate selected_modules
    puts "Regel #{self.id} wird ausgewertet...\n"
    credits_in_selection = 0
    selected_modules.each do |m|
      self.category.modules.each do |cm|
        if cm.id == m.id
          credits_in_selection += m.credits
        end
      end
    end

    @act_credits = credits_in_selection
    
    if self.relation == "min"
      return 1 if credits_in_selection >= self.count
    elsif self.relation == "max"
      return 1 if credits_in_selection <= self.count
    end

    return -1

  end
  
end
