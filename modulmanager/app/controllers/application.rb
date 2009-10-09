# you do not need to copy this file to your project!!!

class ApplicationController < ActionController::Base

  helper :all # just make sure to include all helpers


  def get_note

    selection = current_selection

    grade = 0
    credits = 0

    selection.semesters.each do |s|
      s.modules.each do |m|
        if m.grade != nil
          grade += (m.moduledata.credits.to_f * m.grade.to_f)
          credits += m.moduledata.credits.to_f
        end
      end
    end

    grade = grade / credits if credits > 0

    return grade

  end


  def current_selection
    session[:selection_id] ||= new_selection params[:version], params[:focus]
    ModuleSelection.find session[:selection_id]
  end

  # Erstellt eine neue Standardauswahl
  def new_selection(version = nil, focus = nil)
    version = get_latest_po if version == nil
    ms = ModuleSelection.create :version => version, :focus => focus
    s1 = Semester.create :count => 1
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.101'")
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.605'")
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Mat.011'")
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Mat.012'")
    ms.semesters << s1
    s2 = Semester.create :count => 2
    s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.102'")
    s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.410'")
    s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.303'")
    ms.semesters << s2
    s3 = Semester.create :count => 3
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.103'")
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.304'")
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.201'")
    ms.semesters << s3
    s4 = Semester.create :count => 4
    s4.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.104'")
    s4.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.604'")
    s4.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.202'")
    ms.semesters << s4
    s5 = Semester.create :count => 5
    s5.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.402'")
    s5.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.203'")
    ms.semesters << s5
    s6 = Semester.create :count => 6
    s6.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.602'")
    s6.studmodules << Studmodule.find(:first, :conditions => "short = 'Bachelor'")
    ms.semesters << s6
    return ms.id
  end

  def get_latest_po
    po = Version.all
    latest_po = po[0]
    po.each do |p|
      latest_po = p if p.date > latest_po.date
    end
    return latest_po
  end


end
