module AbfragenHelper

  def build_xml_bachelor_recursive(c, xml, modus)
    modus = c.modus unless c.modus == nil
    if c.sub_categories == [] && c.modules != []
      c.modules.each { |m|
        classification = "non-custom"
        18.times { |i| classification = "custom" if m.short == "custom#{(i+1)}" }
        m.parts > 1 ? partial = true : partial = false
        has_grade = true
        
        xml.module(
          :id => m.id,
          :class => classification,
          :partial => partial,
          :has_grade => has_grade
        ) do

          xml.name(m.name)
          xml.short(m.short)
          xml.credits(m.credits)
          xml.mode(modus)
          m.parts > 1 ? xml.parts(m.parts) : xml.parts(0)

        end

        if partial

          m.parts.times do |i|

            part = i + 1
            short = "#{m.short}.#{part}"
            mod = Studmodule.find(
              :first,
              :conditions => "short = '#{short}'"
            )

            has_grade = true

            xml.module(
              :id => "#{mod.id}",
              :class => "non-custom",
              :partial => "true",
              :has_grade => has_grade,
              :parent => m.id
            ) do

              xml.name mod.name
              xml.short mod.short
              xml.credits mod.credits
              xml.mode modus
              mod.parts > 1 ? xml.parts(mod.parts) : xml.parts(0)

            end
          end
        end
      }
    elsif c.sub_categories != []
      c.sub_categories.each { |d|
        xml.category(:category_id => "category#{d.id}", :name => d.name) do
          build_xml_bachelor_recursive d, xml, modus
        end
      }
    end
  end


  def build_html_rules_recursive r, padding_left, padding_addition, non_permitted_modules

    name = r.name
    fullfilled = r.evaluate current_selection.modules, non_permitted_modules
    image = ""
    case fullfilled
    when 1
      image = "iPunkt.png"
    when -1
      # image = "Ausrufezeichen.png"
      image = "AusrufezeichenBlinkend.gif"
    when 0
      image = "Fragezeichen.png"
    end
    credits_needed = r.credits_needed
    credits_earned = r.credits_earned current_selection.modules, non_permitted_modules
    id = r.id
    element = <<EOF
  <div>
    <table>
      <tr>
        <td class='ueberblick_name'>#{name}</td>
        <td class='ueberblick_image'>
          <div class='ueberblick_info_box' id='box##{id}' onClick='get_modul_info_in_overview(#{id})' >
                 #{image_tag image}
         </div>
        </td>
        <td class='ueberblick_credits'>#{credits_earned} / #{credits_needed} C</td>
      </tr>
    </table>
  </div>
EOF

    if r.child_connections != []

      list = "#{element}<ul style='padding-left: #{padding_left}px'>"

      r.child_connections.each do |cc|
        list += "<li style='padding-right: #{padding_left}px'>#{build_html_rules_recursive(cc, (padding_left + padding_addition), padding_addition, non_permitted_modules)}</li>"
      end
      list += "</ul>"
      return list
    elsif r.child_connections == []
      return "#{element}"
    end

  end

end