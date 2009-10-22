module AbfragenHelper

  def build_xml_bachelor_recursive(c, xml, modus)
    modus = c.modus unless c.modus == nil
    if c.sub_categories == [] && c.modules != []
      c.modules.each { |m|
        #        classification = "non-custom"
        #
        #        18.times { |i| classification = "custom" if m.short == "custom#{(i+1)}" }

        has_grade = true

        #        partial = false
        #        m.children.length > 0         ? partial = true                : partial = false
        #        m.parent == nil               ? parent = ""                   : parent = m.parent.id
        m.credits_total == m.credits  ? total_credits = ""            : total_credits = m.credits_total
        m.children.length > 0         ? parts = m.children.length + 1 : parts = 0
        m.subname == nil              ? subname = ""                  : subname = m.subname
        m.categories.length > 1       ? mult_cat = true               : mult_cat = false

        xml.module(
          :id => m.id,
          :class => get_classification(m),
          :partial => is_partial_module(m),
          :has_grade => has_grade,
          :parent => get_parent_id(m),
          :total_credits => total_credits,
          :parts => parts,
          :multiple_categories => mult_cat,
          :additional_server_info => has_additional_server_infos(m)
        ) {
          xml.name(m.name)
          xml.add_sel_name(subname)
          xml.short(m.short)
          xml.credits(m.credits)
          xml.mode(modus)
          xml.parent(m.parent.id) unless m.parent == nil
          xml.total_credits(m.credits_total) if is_partial_module(m)
          xml.parts(parts)
          xml.categories do
            m.categories.each {|c| xml.category c.id}
          end if mult_cat
        }
      }

    elsif c.sub_categories != []
      c.sub_categories.each do |d|
        if d.visible
          xml.category(:category_id => "category#{d.id}", :name => d.name) do
            build_xml_bachelor_recursive d, xml, modus
          end
        end
      end
    end
  end

  def has_additional_server_infos studmodule
    result = false
    result = true if studmodule.categories.length > 1
    return result
  end

  def is_partial_module studmodule
    result = false
    studmodule.children.length > 0 ? result = true : result = false
    return result
  end

  def get_parent_id studmodule
    result = nil
    studmodule.parent == nil ? result = "" : result = studmodule.parent.id
    return result
  end

  def get_classification studmodule
    result = "non-custom"
    36.times { |i| result = "custom" if studmodule.short == "custom#{(i+1)}" }
    return result
  end

  def build_html_rules_recursive r, padding_left, padding_addition, non_permitted_modules
    image = ""
    name = r.name
    id = r.id
    fullfilled = r.evaluate current_selection.selection_modules, non_permitted_modules
    credits_needed = r.credits_needed
    credits_earned = r.credits_earned current_selection.selection_modules

    case fullfilled
    when 1
      image = "iPunkt.png"
    when -1
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
            <a  alt='Weitere Informationen' onClick='javascript:get_modul_info_in_overview(#{id});'>
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