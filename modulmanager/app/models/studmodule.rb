# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class Studmodule < ActiveRecord::Base

  has_and_belongs_to_many :categories,
    :class_name => "Category",
    :join_table => "categories_studmodules"

#  has_and_belongs_to_many :foci,
#    :class_name => "Focus",
#    :join_table => "foci_studmodules"

  has_and_belongs_to_many :rules,
    :class_name => "Rule",
    :join_table => "rules_studmodules"

  belongs_to :version,
    :class_name => "Version",
    :foreign_key => "version_id"

  has_one :permission,
    :class_name => "Connection",
    :foreign_key => "owner_id"

  has_many :children,
    :class_name => "Studmodule",
    :foreign_key => "parent_id"

  belongs_to :parent,
    :class_name => "Studmodule",
    :foreign_key => "parent_id"

  def self.get_array_from_module_string module_string
    mod_array = Array.new
    modules = module_string.split(",")
    modules.each { |m|
      m.strip!
      mod = Studmodule.find(:first, :conditions => "short = '#{m}'")
      mod_array.push mod
    }
    return mod_array
  end

  # D E P R E C A T E D
  def credits_total
    credits = self.credits
    self.children.each {|m| credits += m.credits} if self.children.length > 0
    return credits
  end



  def has_additional_server_infos
    result = false
    result = true if self.categories.length > 1
    return result
  end

  def has_grade
    if read_attribute("has_grade") == nil
      return true
    elsif read_attribute("has_grade") == ""
      return true
    else
      return read_attribute("has_grade")
    end
  end

  def is_partial_module
    result = false
    self.children.length > 0 ? result = true : result = false
    return result
  end

  def parent_id
    self.parent == nil ? result = "" : result = self.parent.id
    return result
  end

  def classification
    self.short.include?("custom") ? result = "custom" : result = "non-custom"
    return result
  end

  def total_credits
    result = ""
    credits = self.credits
    self.children.each {|m| credits += m.credits} if self.children.length > 0
    credits == self.credits ? result = "" : result = credits
    return result
  end

  def parts
    result = 0
    self.children.length > 0 ? result = self.children.length + 1 : result = 0
    return result
  end

  def displayable_subname
    result = ""
    self.subname == nil ? result = "" : result = self.subname
    return result
  end

  def has_multiple_categories
    result = false
    self.categories.length > 1 ? result = true : result = false
    return result
  end
  
end
