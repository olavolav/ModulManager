class Category < ActiveRecord::Base
  belongs_to :super_category,
    {
    :class_name => "Category",
    :foreign_key => "category_id"
    }

  has_many :sub_categories,
    {
    :class_name => "Category",
    :foreign_key => "category_id"
    }

  has_and_belongs_to_many :modules,
    {
    :class_name => "Studmodule",
    :join_table => "categories_studmodules"
    }

  has_and_belongs_to_many :rules,
    {
    :class_name => "Rule",
    :join_table => "categories_rules"
    }

  # has_many :credit_rules, { :class_name => "CreditRule", :foreign_key => "category_id" }
  # has_many :module_rules, { :class_name => "ModuleRule", :foreign_key => "category_id" }
end
