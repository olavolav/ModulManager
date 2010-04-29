# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class Category < ActiveRecord::Base

  belongs_to :super_category,
    :class_name => "Category",
    :foreign_key => "category_id"

  has_many :sub_categories,
    :class_name => "Category",
    :foreign_key => "category_id"

  has_and_belongs_to_many :modules,
    :class_name => "Studmodule",
    :join_table => "categories_studmodules"

  has_many :selected_modules,
    :class_name => "SelectedModule",
    :foreign_key => "category_id"

  #  has_and_belongs_to_many :rules,
  has_many :rules,
    :class_name => "Rule",
    :foreign_key => "category_id"
#    :join_table => "categories_rules"

  has_many :connections,
    :through => :rules,
    :class_name => "Connection",
    :source => :parent_connection

  belongs_to :version,
    :class_name => "Version",
    :foreign_key => "version_id"

  belongs_to :focus,
    :class_name => "Focus",
    :foreign_key => "focus_id"

  def option_name
    return "#{self.super_category.name} / #{self.name}"
  end

  def self.get_array_from_category_string categories_string
    c = Array.new
    categories = categories_string.split(",")
    categories.each { |cat|
      cat.strip!
      c.push Category.find(:first, :conditions => "name = '#{cat}'")
    }
    return c
  end

  def count_removed_grades selection
    counter = 0
    selected_modules = selection.selection_modules
    selected_modules.each do |sm|
      if self.modules.include? sm.moduledata && sm.has_grade == false
        counter += 1
      end
    end
    return counter
  end

  def grade_remove_allowed?(studmodule, selection)
    unless self.grade_remove == nil
      if studmodule.categories.include?(self) && count_removed_grades(selection) < self.grade_remove
        return true
      end
    end
    return false
  end

end
