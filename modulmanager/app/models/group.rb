class Group < ActiveRecord::Base
  has_and_belongs_to_many :modules,
    :class_name => "Studmodule",
    :join_table => "groups_studmodules"
  has_and_belongs_to_many :rules,
    :class_name => "Rule",
    :join_table => "groups_rules"
end
