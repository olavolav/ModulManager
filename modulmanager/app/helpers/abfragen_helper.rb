module AbfragenHelper

  def build_xml_bachelor_recursive(c, xml, modus)
    modus = c.modus unless c.modus == nil
    if c.sub_categories == [] && c.modules != []
      c.modules.each { |m|
        classification = "non-custom"
        partial = false
        m.children.length > 0 ? partial = true : partial = false
        
        18.times { |i| classification = "custom" if m.short == "custom#{(i+1)}" }
        
        has_grade = true
        
        xml.module(
          :id => m.id,
          :class => classification,
          :partial => partial,
          :has_grade => has_grade
        ) {
          xml.name(m.name)
          xml.subname(m.subname) unless m.subname == nil
          xml.short(m.short)
          xml.credits(m.credits)
          xml.mode(modus)
          m.children.length > 0 ? xml.parts(m.parts) : xml.parts(0)
        }

#        if partial
#
#          m.parts.times do |i|
#            part = i + 1
#            short = "#{m.short}.#{part}"
#            has_grade = true
#
#            mod = Studmodule.find(
#              :first,
#              :conditions => "short = '#{short}'"
#            )
#
#            xml.module(
#              :id => "#{mod.id}",
#              :class => "non-custom",
#              :partial => "true",
#              :has_grade => has_grade,
#              :parent => m.id
#            ) {
#              xml.name m.name
#              xml.add_sel_name mod.name
#              xml.short mod.short
#              xml.credits mod.credits
#              xml.mode modus
#              mod.parts > 1 ? xml.parts(mod.parts) : xml.parts(0)
#            }
#          end
#        end
      }

    elsif c.sub_categories != []
      c.sub_categories.each do |d|
        xml.category(:category_id => "category#{d.id}", :name => d.name) do
          build_xml_bachelor_recursive d, xml, modus
        end
      end
    end
  end


  def build_html_rules_recursive r, padding_left, padding_addition, non_permitted_modules
    image = ""
    name = r.name
    id = r.id
    fullfilled = r.evaluate current_selection.selection_modules, non_permitted_modules
    credits_needed = r.credits_needed
#    credits_earned = r.credits_earned current_selection.modules
    credits_earned = r.credits_earned current_selection.selection_modules

    case fullfilled
    when 1
      image = "iPunkt.png"
    when -1
      # image = "Ausrufezeichen.png"
      image = "AusrufezeichenBlinkend.gif"
    when 0
      image = "Fragezeichen.png"
    end
    
    
    element = <<EOF
  <div>
    <table cellspacing='0'>
      <tr>
        <td class='ueberblick_name'>#{name}</td>
        <td class='ueberblick_image'>
          <div class='ueberblick_info_box' id='box##{id}' >
            <a href='#' alt='Weitere Informationen' onClick='javascript:get_modul_info_in_overview(#{id});'>
              #{image_tag image}
            </a>
         </div>
        </td>
        <td class='ueberblick_credits'>#{credits_earned} / #{credits_needed} C</td>
      </tr>
    </table>
  </div>
EOF

    if r.child_connections != []

      list = "#{element}<ul>"

      r.child_connections.each do |cc|
        list += <<EOF
  <li>
    #{build_html_rules_recursive(cc, (padding_left + padding_addition), padding_addition, non_permitted_modules)}
  </li>
EOF
      end

      list += "</ul>"
      return list

    elsif r.child_connections == []
      return "#{element}"
    end
  end

end