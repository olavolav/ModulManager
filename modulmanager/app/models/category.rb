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

  has_and_belongs_to_many :rules,
    :class_name => "Rule",
    :join_table => "categories_rules"

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

end
