# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

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
  

  def self.create_min_credit_rule_for_focus count, module_string, version
    mod_array = Studmodule::get_array_from_module_string module_string, version
    mod_array.each do |mod|
      if mod.children != nil
        mod_array = mod_array.concat mod.children
      end
    end
    return CreditRule.create :count => count, :relation => "min", :modules => mod_array
  end

  def self.create_min_module_rule_for_focus count, module_string, version
    mod_array = Studmodule::get_array_from_module_string module_string, version
    return ModuleRule.create :count => count, :relation => "min", :modules => mod_array
  end

  def self.create_min_credit_rule_for_standard count, category, version
    r = CreditRule.create :count => count, :relation => "min",
      :category => Category.find(:first, :conditions => "name = '#{category}' AND version_id = #{version.id}")
    return r
  end

  def self.create_min_module_rule_for_standard count, category, version
    r = ModuleRule.create :count => count, :relation => "min",
      :category => Category.find(:first, :conditions => "name = '#{category}' AND version_id = #{version.id}")
    return r
  end

  def self.remove_modules_from_array array, remove
    deletion_indexes = Array.new
    i = 0
    # SelectedModules
    array.each do |mod|
      # Studmodules
      remove.each do |rem|
        deletion_indexes.push i if mod.moduledata == rem.id
#        array.delete mod if mod.moduledata.id == rem.id
      end unless remove == nil
      i += 1
    end
    deletion_indexes.each { |i| array.delete_at i }
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
        if mod.has_removed_grade?
          if self.category.modules.include? mod.moduledata
            counter += 1
          end
        end
      end
    end
    return counter
  end

  def removed_too_many_grades?(selected_modules)
    return (removed_grades(selected_modules) > removeable_grades)
  end

  def parent_focus
    return self.parent_connection.parent_focus
  end

  def is_part_of_focus?
    return self.parent_connection.is_part_of_focus?
  end

end
