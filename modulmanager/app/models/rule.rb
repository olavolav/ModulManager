class Rule < ActiveRecord::Base

  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  has_and_belongs_to_many :modules,
    :join_table => "rules_studmodules",
    :class_name => "Studmodule"

  belongs_to :parent_connection,
    :class_name => "Connection",
    :foreign_key => "parent_id"
  

  def self.create_min_credit_rule_for_focus count, module_string
    mod_array = Studmodule::get_array_from_module_string module_string
    return CreditRule.create :count => count, :relation => "min", :modules => mod_array
  end

  def self.create_min_module_rule_for_focus count, module_string
    mod_array = Studmodule::get_array_from_module_string module_string
    return ModuleRule.create :count => count, :relation => "min", :modules => mod_array
  end

  def self.create_min_credit_rule_for_standard count, category
    r = CreditRule.create :count => count, :relation => "min",
      :category => Category.find(:first, :conditions => "name = '#{category}'")
    return r
  end

  def self.create_min_module_rule_for_standard count, category
    r = ModuleRule.create :count => count, :relation => "min",
      :category => Category.find(:first, :conditions => "name = '#{category}'")
    return r
  end

  def self.remove_modules_from_array array, remove
    # SelectedModules
    array.each do |mod|
      # Studmodules
      remove.each do |rem|
        array.delete mod if mod.moduledata.id == rem.id
      end unless remove == nil
    end
    # SelectedModules
    return array
  end

  def has_category array
    found = false
    array.each {|c|
      found = true if self.category != nil && self.category.id == c.id
    }
    return found
  end

  def directory_string

  end

  def removeable_grades
    unless self.category == nil
      return self.category.grade_remove
    end
    return 0
  end

  def removed_grades selected_modules
    counter = 0
    unless self.category == nil
      selected_modules.each do |mod|
        if mod.has_grade == false
          if self.category.modules.include? mod.moduledata
            counter += 1
          end
        end
      end
    end
    return counter
  end

  def removed_too_many_grades? selected_modules
#    unless self.category == nil
#      allowed = self.category.grade_remove
#      counted = 0
#      selected_modules.each do |s_mod|
#        if s_mod.has_grade == false
#          if self.category.modules.include? s_mod.moduledata
#            counted += 1
#          end
#        end
#      end
#      return true if counted > allowed
#    end
#    return false
    if removed_grades(selected_modules) > removeable_grades
      return true
    else
      return false
    end
  end

end
