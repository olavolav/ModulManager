class Category < ActiveRecord::Base
  belongs_to :category, { :foreign_key => "category_id" }
  has_many :categories, { :foreign_key => "category_id" }
  has_many :modules, { :class_name => "Studmodule", :foreign_key => "category_id" }
  has_many :rules, { :class_name => "Rule", :foreign_key => "category_id" }
  has_many :credit_rules, { :class_name => "CreditRule", :foreign_key => "category_id" }
  has_many :module_rules, { :class_name => "ModuleRule", :foreign_key => "category_id" }
end
