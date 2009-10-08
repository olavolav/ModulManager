class Focus < ActiveRecord::Base
  has_and_belongs_to_many :modules, :class_name => "Studmodule", :join_table => "foci_studmodules"

#  has_and_belongs_to_many :themen, :class_name => "Studmodule", :join_table => "foci_themes"
#  has_and_belongs_to_many :profil, :class_name => "Studmodule", :join_table => "foci_profil"
#  has_and_belongs_to_many :pflicht, :class_name => "Studmodule", :join_table => "foci_pflicht"

  has_many :groups, :class_name => "Group", :foreign_key => "focus_id"
end
