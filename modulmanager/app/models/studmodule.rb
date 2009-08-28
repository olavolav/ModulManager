class Studmodule < ActiveRecord::Base
  belongs_to :category,
    { :class_name => "Category", :foreign_key => "category_id" }
  has_and_belongs_to_many :foci,
    :class_name => "Focus",
    :join_table => "foci_studmodules"
  has_and_belongs_to_many :selections,
    :class_name => "ModuleSelection",
    :join_table => "module_selections_studmodules"
end
