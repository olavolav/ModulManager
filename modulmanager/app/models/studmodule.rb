class Studmodule < ActiveRecord::Base
  has_and_belongs_to_many :categories,
    { :class_name => "Category", :join_table => "categories_studmodules" }
  has_and_belongs_to_many :foci,
    :class_name => "Focus",
    :join_table => "foci_studmodules"
  has_and_belongs_to_many :rules,
    :class_name => "Rule",
    :join_table => "rules_studmodules"

  def self.get_array_from_module_string module_string
    mod_array = Array.new
    modules = module_string.split(",")
    modules.each { |m|
      m.strip!
      mod_array.push Studmodule.find(:first, :conditions => "short = '#{m}'")
    }
    return mod_array
  end
end
