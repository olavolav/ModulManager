class ModuleSelection < ActiveRecord::Base

  has_many :semesters,
    :class_name => "Semester",
    :foreign_key => "selection_id",
    :dependent => :delete_all
  belongs_to :focus,
    :class_name => "Focus",
    :foreign_key => "focus_id"

  belongs_to :version,
    :class_name => "Version",
    :foreign_key => "version_id"

  def modules
    modules = Array.new
    self.semesters.each do |s|
      s.studmodules.each do |sm|
        modules.push sm
      end
    end
    modules
  end

  def selection_modules
    mods = Array.new
    self.semesters.each do |s|
      s.modules.each do |sm|
        mods.push sm
      end
    end
    mods
  end

end
