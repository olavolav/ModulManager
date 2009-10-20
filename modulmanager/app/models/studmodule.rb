class Studmodule < ActiveRecord::Base

  has_and_belongs_to_many :categories,
    :class_name => "Category",
    :join_table => "categories_studmodules"

  has_and_belongs_to_many :foci,
    :class_name => "Focus",
    :join_table => "foci_studmodules"

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
      mod_array.push Studmodule.find(:first, :conditions => "short = '#{m}'")
    }
    return mod_array
  end

  def credits_total
    credits = self.credits
    self.children.each {|m| credits += m.credits} if self.children.length > 0
    return credits
  end

end
