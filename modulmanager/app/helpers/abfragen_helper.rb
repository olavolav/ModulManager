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


  def build_html_rules_recursive r, padding_left, padding_addition

    name = r.name
    fullfilled = r.evaluate current_selection.modules
    image = ""
    case fullfilled
    when 1
      image = "iPunkt.png"
    when -1
      image = "Ausrufezeichen.png"
    when 0
      image = "Fragezeichen.png"
    end
    background_color = ""
    case fullfilled
    when 1
      background_color = "green"
    when -1
      background_color = "red"
    when 0
      background_color = "gray"
    end
    credits_needed = r.credits_needed
    modules_needed = r.modules_needed
    credits_earned = r.credits_earned current_selection.modules
    modules_earned = r.modules_earned current_selection.modules
    id = r.id
    info_text = "<div class='ueberblick_info_text' style='background-color: #{background_color}' id='text##{id}'>Es werden #{credits_needed} Credits (z.Zt. #{credits_earned} Credits) und #{modules_needed} Module (z.Zt. #{modules_earned} Module) im Bereich #{name} benötigt.</div>"
    element = "<div><table><tr><td class='ueberblick_name'>#{name}</td><td class='ueberblick_image'><div class='ueberblick_info_box' id='box##{id}'><a href='/abfragen/info/#{id}?height=300&width=600' class='thickbox'>#{image_tag image}</a>#{info_text}</div></td><td class='ueberblick_credits'>#{credits_earned} / #{credits_needed} C</td></tr></table></div>"

    if r.child_connections != []

      list = "#{element}<ul style='padding-left: #{padding_left}px'>"

      r.child_connections.each do |cc|
        list += "<li style='padding-right: #{padding_left}px'>#{build_html_rules_recursive(cc, (padding_left + padding_addition), padding_addition)}</li>"
      end
      list += "</ul>"
      return list
    elsif r.child_connections == []
      return "#{element}"
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
            s.relation == "min" ? text += "Es müssen mehr als " : text += "Es dürfen nicht mehr als "
            text += "#{s.count} "
            text += "Credits im Bereich \"#{s.category.name}\" haben (#{s.act_credits} von #{s.count})." if s.class == CreditRule
            text += "Module im Bereich \"#{s.category.name}\" haben (#{s.act_modules} von #{s.count})." if s.class == ModuleRule
            xml.text text
          else
            xml.text "Es sind alle Vorraussetzungen für diesen Bereich erfüllt."
          end
          xml.category s.category.name
        end
      end
    elsif r.child_connections != []
      r.child_connections.each do |s|
        c_needed = s.credits_needed
        xml.category(:id => "category#{s.id}",
          :credits_needed => c_needed,
#         :modules_needed => s.modules_needed,
          :name => s.name,
          :fullfilled => fullfilled = s.evaluate(current_selection.modules),
          :text => "In diesem Bereich werden #{c_needed} Credits und #{s.modules_needed} Module benötigt."
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
