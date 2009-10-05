class Studmodule < ActiveRecord::Base
  has_and_belongs_to_many :categories,
    { :class_name => "Category", :join_table => "categories_studmodules" }
  has_and_belongs_to_many :foci,
    :class_name => "Focus",
    :join_table => "foci_studmodules"
  has_and_belongs_to_many :rules,
    :class_name => "Rule",
    :join_table => "rules_studmodules"
end
