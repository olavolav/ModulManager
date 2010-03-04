class SelectedModule < ActiveRecord::Base

  belongs_to :semester,
    :class_name => "Semester",
    :foreign_key => "semester_id"

  belongs_to :moduledata,
    :class_name => "Studmodule",
    :foreign_key => "module_id"

  has_and_belongs_to_many :categories,
    :class_name => "Category",
    :join_table => "categories_selected_modules"

  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

end
