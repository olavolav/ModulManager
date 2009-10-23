class Focus < ActiveRecord::Base

  has_and_belongs_to_many :modules,
    :class_name => "Studmodule",
    :join_table => "foci_studmodules"

  has_many :groups,
    :class_name => "Group",
    :foreign_key => "focus_id"

  has_many :categories,
    :class_name => "Category",
    :foreign_key => "focus_id"

  belongs_to :version,
    :class_name => "Version",
    :foreign_key => "version_id"

end
