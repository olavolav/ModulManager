# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

module ApplicationHelper

  def current_selection
    session[:selection_id] ||= create_standard_selection
    selection = ModuleSelection.find session[:selection_id]

    #    puts "currently in selection:"
    #    selection.modules.each {|m| puts "- #{m.name}"}

    return selection

  end

  def create_standard_selection
    semesters = create_pre_selection nil, get_latest_po
    ms = ModuleSelection.create :version => get_latest_po,
      :semesters => semesters
    return ms.id
  end

  def create_pre_selection focus_name = nil, version = nil

    unless session[:selection_id] == nil
      selection = current_selection
      selection.semesters.each do |semester|
        semester.modules.each {|mod| mod.destroy}
        semester.destroy
      end
    end

    focus_name = "standard" if focus_name == nil
    version = current_selection.version if version == nil
    path = version.path
    pre_selection_file = File.open("config/basedata/#{path}/vorauswahl.yml")

    y = YAML::load(pre_selection_file)

    semesters = Array.new
    return_array = Array.new

    y.each do |p|

      if p["name"] == focus_name

        semesters.push p["semester1"] if p["semester1"] != nil
        semesters.push p["semester2"] if p["semester2"] != nil
        semesters.push p["semester3"] if p["semester3"] != nil
        semesters.push p["semester4"] if p["semester4"] != nil
        semesters.push p["semester5"] if p["semester5"] != nil
        semesters.push p["semester6"] if p["semester6"] != nil

        i = 0
        semesters.each do |content|
          i += 1
          shorts = content.split(", ")
          s = Semester.new :count => i
          shorts.each do |short|
            m = Studmodule.find(:first, :conditions => "short = '#{short}' AND version_id = #{version.id}")
            sm = SelectedModule.new :moduledata => m, :category => m.categories[0]
            #            s.studmodules << m
            s.modules << sm
          end
          s.save
          return_array.push s
        end
      end
    end
    return_array.push Semester.create :count => 0 # Freiwillige Zusatzleistungen
    return return_array
  end



#  def create_pre_selection focus_name = nil, version = nil
#
#    unless session[:selection_id] == nil
#      selection = current_selection
#      selection.semesters.each do |semester|
#        semester.modules.each {|mod| mod.destroy}
#        semester.destroy
#      end
#    end
#
#    focus_name = "standard" if focus_name == nil
#    version == nil ? path = current_selection.version.path : path = version.path
#    pre_selection_file = File.open("config/basedata/#{path}/vorauswahl.yml")
#
#    y = YAML::load(pre_selection_file)
#
#    semesters = Array.new
#    return_array = Array.new
#
#    y.each do |p|
#
#      if p["name"] == focus_name
#
#        semesters.push p["semester1"]
#        semesters.push p["semester2"]
#        semesters.push p["semester3"]
#        semesters.push p["semester4"]
#        semesters.push p["semester5"]
#        semesters.push p["semester6"]
#
#        i = 0
#        semesters.each do |content|
#          i += 1
#          shorts = content.split(", ")
#          s = Semester.new :count => i
#          shorts.each do |short|
#            m = Studmodule.find(:first, :conditions => "short = '#{short}'")
#            sm = SelectedModule.new :moduledata => m, :category => m.categories[0]
#            #            s.studmodules << m
#            s.modules << sm
#          end
#          s.save
#          return_array.push s
#        end
#      end
#    end
#    return return_array
#  end

  def get_latest_po
    po = Version.all
    latest_po = po[0]

    po.each do |p|
      latest_po = p if p.date > latest_po.date
    end

    return latest_po
  end



end
