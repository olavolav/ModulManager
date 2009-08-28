class ModuleSelection < ActiveRecord::Base
  has_and_belongs_to_many :modules,
    :class_name => "Studmodule",
    :join_table => "module_selections_studmodules"
end
