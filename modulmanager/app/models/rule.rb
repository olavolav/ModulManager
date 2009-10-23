class Rule < ActiveRecord::Base

  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  has_and_belongs_to_many :modules,
    :join_table => "rules_studmodules",
    :class_name => "Studmodule"

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
      end
    end
    # SelectedModules
    return array
  end

  def has_category array
    found = false
    array.each {|c|
      found = true if self.category.id == c.id
    }
    return found
  end

end
