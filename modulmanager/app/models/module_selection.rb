class ModuleSelection < ActiveRecord::Base
  has_many :semesters,
    :class_name => "Semester",
    :foreign_key => "selection_id",
    :dependent => :delete_all
  belongs_to :focus,
    :class_name => "Focus",
    :foreign_key => "focus_id"

  def modules
    modules = Array.new
    self.semesters.each do |s|
      modules.push s.modules
    end
    modules
  end
end
