class Submodule < Studmodule
  belongs_to :parent, :class_name => "Studmodule", :foreign_key => "parent_id"
end
