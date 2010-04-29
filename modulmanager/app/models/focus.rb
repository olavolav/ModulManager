# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class Focus < ActiveRecord::Base

#  has_and_belongs_to_many :modules,
#    :class_name => "Studmodule",
#    :join_table => "foci_studmodules"

  has_many :groups,
    :class_name => "Group",
    :foreign_key => "focus_id"

  has_many :categories,
    :class_name => "Category",
    :foreign_key => "focus_id"

  belongs_to :version,
    :class_name => "Version",
    :foreign_key => "version_id"

  def rules
    rules = Array.new
    self.categories.each do |category|
      rules = rules.concat category.rules
    end
    return rules
  end

  def category_modules
    modules = Array.new
    self.categories.each do |category|
      modules = modules.concat category.modules
    end
    return modules
  end

  def rule_modules
    modules = Array.new
    self.rules.each do |rule|
      modules = modules.concat rule.modules
    end
    return modules
  end

  def main_connection
    connection = Connection.find(:first, :conditions => "name = #{self.name}")
    return connection
  end

  def contains_module? mod
    my_modules = self.category_modules
    if my_modules.include? mod
      return true
    end
    return false
  end

end
