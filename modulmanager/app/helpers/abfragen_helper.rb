module AbfragenHelper

  def build_xml_bachelor_recursive(c, xml, modus)

    modus = c.modus unless c.modus == nil

    if c.sub_categories == [] && c.modules != []

      c.modules.each { |m|

        classification = "non-custom"

        18.times { |i| classification = "custom" if m.short == "custom#{(i+1)}" }

        m.parts > 1 ? partial = true : partial = false

        xml.module(:id => m.id, :class => classification, :partial => partial) do
          xml.name(m.name)
          xml.short(m.short)
          xml.credits(m.credits)
          xml.mode(modus)
          xml.parts(m.parts)
        end

        if partial
          m.parts.times do |j|
            i = j + 1
            xml.module(:id => "#{m.id}_#{i}", :class => "non-custom", :partial => "true") do
              xml.name "#{m.name} (Teil #{i})"
              xml.short "#{m.short}_#{i}"
              c = m.credits / m.parts
              xml.credits c
              xml.mode(modus)
              xml.parent(m.id)
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


  def build_html_rules_recursive r, padding_left, padding_addition

    name = r.name
    fullfilled = r.evaluate current_selection.modules
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
    credits_earned = r.credits_earned current_selection.modules
    id = r.id
    element = <<EOF 
  <div>
    <table>
      <tr>
        <td class='ueberblick_name'>#{name}</td>
        <td class='ueberblick_image'>
          <div class='ueberblick_info_box' id='box##{id}'>
            <a href='/abfragen/info/#{id}?height=300&width=600' class='thickbox'>
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

end
