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
        xml.category(:id => "category#{s.id}",
          :credits_needed => s.credits_needed,
#         :modules_needed => s.modules_needed,
          :name => s.name,
          :fullfilled => fullfilled = s.evaluate(current_selection.modules),
          :text => "Du benötigst aus diesem Bereich #{s.credits_needed} Credits und #{s.modules_needed} Module."
          ) do
          # xml.fullfilled fullfilled
          build_rules_recursive(s, xml)
#          unless fullfilled == 1
#            text = "Du benötigst aus diesem Bereich #{s.credits_needed} Credits und #{s.modules_needed} Module."
#            xml.text text
#          end
        end
      end
    end
  end

end
