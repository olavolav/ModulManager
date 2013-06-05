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

  def self.get_array_from_module_string module_string, version
    mod_array = Array.new
    modules = module_string.split(",")
    modules.each { |m|
      m.strip!
      mod = Studmodule.find(:first, :conditions => "short = '#{m}' AND version_id = #{version.id}")
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
    return read_attribute("has_grade").to_s.blank? ? true : read_attribute("has_grade")
  end

  def is_partial_module
    return !(self.children.empty?)
  end

  def parent_id
    return (self.parent.nil? ? "" : self.parent.id)
  end

  def classification
    return (self.short.include?("custom") ? "custom" : "non-custom")
  end

  def total_credits
    result = ""
    credits = self.credits
    self.children.each {|m| credits += m.credits} if self.children.length > 0
    credits == self.credits ? result = "" : result = credits
    return result
  end

  def parts
    return self.children.length > 0 ? self.children.length + 1 : 0
  end

  def displayable_subname
    return self.subname.to_s
  end

  def has_multiple_categories
    return self.categories.length > 1
  end
  
end
