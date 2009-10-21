class SelectedModule < ActiveRecord::Base

  belongs_to :semester,
    :class_name => "Semester",
    :foreign_key => "semester_id"

  belongs_to :moduledata,
    :class_name => "Studmodule",
    :foreign_key => "module_id"

  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

end
