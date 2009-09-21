module AbfragenHelper

  def build_xml_bachelor_recursive(c, xml, pflicht)
    pflicht = true if c.name == "Pflichtmodule"
    if c.sub_categories == [] && c.modules != []
      c.modules.each { |m|
        xml.module(:id => m.id) do
          # xml.tag!("id", m.id)
          xml.name(m.name)
          xml.short(m.short)
          xml.credits(m.credits)
          xml.mode("p") if pflicht
        end
      }
    elsif c.sub_categories != []
      c.sub_categories.each { |d|
        xml.category(:category_id => "category#{d.id}", :name => d.name) do
          build_xml_bachelor_recursive d, xml, pflicht
        end
      }
    end
  end

  def build_rules_recursive r, xml
    if r.child_rules != []
      r.child_rules.each do |s|
        xml.result(:id => "result#{s.id}") do
          xml.tag! "id", s.id
#          xml.category s.category.name
#          xml.count s.count
#          xml.relation s.relation
          fullfilled = s.evaluate current_selection.modules
          xml.fullfilled fullfilled
          unless fullfilled == 1
            text = ""
            s.relation == "min" ? text += "Du musst mehr als " : text += "Du darfst nicht mehr als "
            text += "#{s.count} "
            text += "Credits im Bereich \"#{s.category.name}\" haben (#{s.act_credits} von #{s.count})." if s.class == CreditRule
            text += "Module im Bereich \"#{s.category.name}\" haben (#{s.act_modules} von #{s.count})." if s.class == ModuleRule
            xml.text text
          else
            xml.text "Du hast alle Vorraussetzungen für diesen Bereich erfüllt."
          end
          xml.category s.category.name
        end
      end
    elsif r.child_connections != []
      r.child_connections.each do |s|
        xml.category(:id => s.id, :credits_needed => s.credits_needed, :modules_needed => s.modules_needed) do
          fullfilled = s.evaluate current_selection.modules
          xml.fullfilled fullfilled
          build_rules_recursive(s, xml)
          unless fullfilled == 1
            text = "Du benötigst aus diesem Bereich #{s.credits_needed} Credits und #{s.modules_needed} Module."
            xml.text text
          end
        end
      end
    end
  end

#  def build_xml_rules_recursive(r, xml, errors)
#    if r.sub_categories == [] && r.rules != []
#      r.rules.each { |ru|
#        xml.rule do
#          xml.tag!("id", ru.id)
#          xml.name(ru.name)
#          errors.each { |e|
#            if ru.id == e.rule.id
#              xml.alert(e.description)
#              # xml.less(e.less)
#            end
#          }
#        end
#      }
#    elsif r.sub_categories != []
#      r.sub_categories.each { |c|
#        xml.category(:id => c.id, :name => c.name) do
#          build_xml_rules_recursive c, xml, errors
#        end
#      }
#    end
#  end

  def current_selection
    session[:selection_id] ||= new_selection
    ModuleSelection.find session[:selection_id]
  end

  def new_selection(focus = nil)
    ms = ModuleSelection.create
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
    s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.605'")
    ms.semesters << s2
    s3 = Semester.create :count => 3
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.103'")
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.410'")
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
    ms.semesters << s6
    return ms.id
  end

end
