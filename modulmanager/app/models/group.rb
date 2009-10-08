class Group < ActiveRecord::Base
  has_and_belongs_to_many :modules, :class_name => "Studmodule", :join_table => "groups_studmodules"
  belongs_to :focus, :class_name => "Focus", :foreign_key => "focus_id"
end
