class ApplicationController < ActionController::Base

  helper :all # just make sure to include all helpers

  def get_note
    selection = current_selection
    grade = Hash.new(0)
    credits = 0

    selection.semesters.each do |s|
      if s.count > 0
        s.modules.each do |m|

          permitted = 1
          m.moduledata.permission == nil ? permitted = 1 : permitted = m.moduledata.permission.evaluate(selection.semesters, m.semester.count)

          if permitted == 1
            if m.moduledata.children != [] && m.moduledata.children != nil
              teil_kumul = 0
              teil_credits = 0

              ges_credits = 0

              if m.grade != nil
                teil_kumul += m.grade.to_f * m.moduledata.credits.to_f
                teil_credits += m.moduledata.credits.to_f
              end
              ges_credits += m.moduledata.credits

              m.moduledata.children.each do |child|

                selection.selection_modules.each do |modul|
                  if modul.moduledata.id == child.id
                    ges_credits += modul.moduledata.credits
                    if modul.grade != nil
                      teil_kumul += modul.grade.to_f * modul.moduledata.credits.to_f
                      teil_credits += modul.moduledata.credits.to_f
                    end
                  end
                end

              end

              teil_credits > 0 ? note_gewichtet = (teil_kumul.to_f / teil_credits.to_f) : note_gewichtet = 0

              grade["gesamt"] += (note_gewichtet.to_f * ges_credits.to_f)
              credits += ges_credits.to_f unless note_gewichtet == 0

            elsif m.moduledata.parent == nil && m.grade != nil && m.class != CustomModule
              note_gewichtet = (m.moduledata.credits.to_f * m.grade.to_f)
              grade["gesamt"] += note_gewichtet
              credits += m.moduledata.credits.to_f
            elsif m.class == CustomModule
              note_gewichtet = (m.credits.to_f * m.grade.to_f)
              grade["gesamt"] += note_gewichtet
              credits += m.credits.to_f
            end
          end
        end
      end
    end

    grade["gesamt"] = (((grade["gesamt"] * 100) / credits).round.to_f / 100) if credits > 0

    return grade
  end

  def current_selection
    session[:selection_id] ||= create_standard_selection
    ModuleSelection.find session[:selection_id]
  end

  def create_standard_selection
    semesters = create_pre_selection
    ms = ModuleSelection.create :version => get_latest_po,
      :semesters => semesters
    return ms.id
  end

  def create_pre_selection focus_name = nil
    focus_name = "standard" if focus_name == nil
    # TODO Muss noch variabel gestaltet werden
    pre_selection_file = File.open("config/basedata/po_ss_2009/vorauswahl.yml")

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
            puts short
            m = Studmodule.find(:first, :conditions => "short = '#{short}'")
            s.studmodules << m
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
