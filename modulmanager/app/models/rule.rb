class Rule < ActiveRecord::Base

  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  has_and_belongs_to_many :modules,
    :join_table => "rules_studmodules",
    :class_name => "Studmodule"
end
