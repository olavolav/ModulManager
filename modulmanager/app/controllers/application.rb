class ApplicationController < ActionController::Base

  helper :all # just make sure to include all helpers
  protect_from_forgery

  def get_note

    auswahl = current_selection
    kumulierte_note = 0
    kumulierte_credits = 0

    auswahl.semesters.each do |semester|
      if semester.count > 0
        semester.modules.each do |modul|
          puts "Modul-Typ: " + modul.module_type
          # Kann das Modul überhaupt gezählt werden?
          if modul.is_allowed?(auswahl, semester.count)
            note = modul.calculation_grade(auswahl).to_f
            puts "Note: " + note.to_s
            if note != 0
              credits             = modul.calculation_credits(auswahl).to_f
              puts "Credits: " + credits.to_s
              kumulierte_note     += note * credits
              kumulierte_credits  += credits
            end
          end
        end
      else
        # Nichts
        # Das passiert nur, wenn Module aus der Vorratsbox aufgerufen werden...
      end
    end

    puts "Kumulierte Note: " + kumulierte_note.to_s
    puts "Kumulierte Credits: " + kumulierte_credits.to_s

    if kumulierte_credits > 0
      return kumulierte_note / kumulierte_credits
    else
      return 0
    end
    #    selection = current_selection
    #    grade = Hash.new(0)
    #    credits = 0
    #
    #    selection.semesters.each do |s|
    #      if s.count > 0
    #        s.modules.each do |m|
    #
    #          permitted = 1
    #          m.moduledata.permission == nil ? permitted = 1 : permitted = m.moduledata.permission.evaluate(selection.semesters, m.semester.count)
    #          if (permitted == 1 || m.permission_removed) && m.has_grade && m.grade != nil && m.grade != 0.0
    #            if m.moduledata.children != [] && m.moduledata.children != nil
    #              teil_kumul = 0
    #              teil_credits = 0
    #
    #              ges_credits = 0
    #
    #              if m.grade != nil
    #                if m.credits == "" || m.credits == nil
    #                  teil_kumul += m.grade.to_f * m.moduledata.credits.to_f
    #                  teil_credits += m.moduledata.credits.to_f
    #                else
    #                  teil_kumul += m.grade.to_f * m.credits.to_f
    #                  teil_credits += m.credits.to_f
    #                end
    #              end
    #              ges_credits += m.moduledata.credits
    #
    #              m.moduledata.children.each do |child|
    #                child_data = current_selection.selection_modules.find(:first, :conditions => "module_id = #{child.id}")
    #                if child_data.credits == nil
    #                  ges_credits += child_data.moduledata.credits
    #                else
    #                  ges_credits += child_data.credits
    #                end
    #                if child_data.grade == nil
    #                  if child_data.credits == nil || child_data.credits == ""
    #                    teil_credits += child_data.credits.to_f
    #                  else
    #                    teil_credits += child_data.moduledata.credits.to_f
    #                  end
    #                else
    #                  if child_data.credits == nil || child_data.credits == ""
    #                    teil_kumul += child_data.grade.to_f * child_data.moduledata.credits.to_f
    #                    teil_credits += child_data.moduledata.credits.to_f
    #                  else
    #                    teil_kumul += child_data.grade.to_f * child_data.credits.to_f
    #                    teil_credits += child_data.credits.to_f
    #                  end
    #                end
    #              end
    #              teil_credits > 0 ? note_gewichtet = (teil_kumul.to_f / teil_credits.to_f) : note_gewichtet = 0
    #              grade["gesamt"] += (note_gewichtet.to_f * ges_credits.to_f)
    #              credits += ges_credits.to_f unless note_gewichtet == 0
    #            elsif m.moduledata.parent == nil && m.grade != nil && m.class != CustomModule
    #              if m.credits == nil || m.credits == ""
    #                note_gewichtet = (m.moduledata.credits.to_f * m.grade.to_f)
    #                grade["gesamt"] += note_gewichtet
    #                credits += m.moduledata.credits.to_f
    #              else
    #                note_gewichtet = (m.credits.to_f * m.grade.to_f)
    #                grade["gesamt"] += note_gewichtet
    #                credits += m.credits.to_f
    #              end
    #            elsif m.class == CustomModule
    #              note_gewichtet = (m.credits.to_f * m.grade.to_f)
    #              grade["gesamt"] += note_gewichtet
    #              credits += m.credits.to_f
    #            end
    #          end
    #        end
    #      end
    #    end
    #
    #    grade["gesamt"] = (((grade["gesamt"] * 100) / credits).round.to_f / 100) if credits > 0
    #
    #    return grade
  end

  def current_selection
    session[:selection_id] ||= create_standard_selection
    selection = ModuleSelection.find session[:selection_id]
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
    version == nil ? path = current_selection.version.path : path = version.path
    pre_selection_file = File.open("config/basedata/#{path}/vorauswahl.yml")

    y = YAML::load(pre_selection_file)

    semesters = Array.new
    return_array = Array.new

    y.each do |p|

      if p["name"] == focus_name

        semesters.push p["semester1"]
        semesters.push p["semester2"]
        semesters.push p["semester3"]
        semesters.push p["semester4"]
        semesters.push p["semester5"]
        semesters.push p["semester6"]

        i = 0
        semesters.each do |content|
          i += 1
          shorts = content.split(", ")
          s = Semester.new :count => i
          shorts.each do |short|
            m = Studmodule.find(:first, :conditions => "short = '#{short}'")
            sm = SelectedModule.new :moduledata => m, :category => m.categories[0]
            #            s.studmodules << m
            s.modules << sm
          end
          s.save
          return_array.push s
        end
      end
    end
    return return_array
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
