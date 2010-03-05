module AbfragenHelper

  def select_image fullfillment_status
    if fullfillment_status == 1
      return "iPunkt.png"
    elsif fullfillment_status == -1
      return "Ausrufezeichen.png"
    elsif fullfillment_status == 0
      return "Fragezeichen.png"
    end
  end


  def build_html_rules_recursive r, padding_left, padding_addition, non_permitted_modules
    image = ""
    name = r.name
    id = r.id
    selection = current_selection
    fullfilled = r.evaluate selection.selection_modules, non_permitted_modules
    credits_needed = r.credits_needed
    credits_earned = r.collected_credits selection.selection_modules, non_permitted_modules

    image = select_image fullfilled

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

      child_connections = Connection.find(:all, :conditions => "parent_id = #{r.id}", :order => "position ASC")
      child_connections.each do |cc|
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


  def build_html_focus_rules_recursive rule, padding_left, padding_addition, non_permitted_modules
    image = ""
    name = rule.name
    id = rule.id
    selection = current_selection

    fullfilled = rule.evaluate_with_focus selection.selection_modules, non_permitted_modules
    credits_needed = rule.credits_needed
    credits_earned = rule.collected_credits selection.selection_modules, non_permitted_modules

    image = select_image fullfilled
  end


  def build_xml_bachelor_recursive(c, xml, modus)
    modus = c.modus unless c.modus == nil
    if c.sub_categories == [] && c.modules != []

      c.modules.each do |m|
        if m.short.include? "custom"
          xml.module(
            :id => m.id,
            :class => m.classification,
            :partial => m.is_partial_module,
            :has_grade => m.has_grade,
            :parent => m.parent_id,
            :total_credits => m.total_credits,
            :parts => m.parts,
            :multiple_categories => m.has_multiple_categories,
            :additional_server_info => m.has_additional_server_infos
          ) {
            xml.name(m.name)
            xml.add_sel_name(m.displayable_subname)
            xml.short(m.short)
            xml.credits(m.credits)
            xml.mode(modus)
            xml.parent(m.parent.id) unless m.parent == nil
            xml.total_credits(m.credits_total) if m.is_partial_module
            xml.parts(m.parts)
            xml.categories do
              m.categories.each {|c| xml.category c.id}
            end if m.has_multiple_categories
          }
        end
      end

      c.modules.each { |m|
        if m.short.include?("custom") == false
          xml.module(
            :id => m.id,
            :class => m.classification,
            :partial => m.is_partial_module,
            :has_grade => m.has_grade,
            :parent => m.parent_id,
            :total_credits => m.total_credits,
            :parts => m.parts,
            :multiple_categories => m.has_multiple_categories,
            :additional_server_info => m.has_additional_server_infos
          ) {
            xml.name(m.name)
            xml.add_sel_name(m.displayable_subname)
            xml.short(m.short)
            xml.credits(m.credits)
            xml.mode(modus)
            xml.parent(m.parent.id) unless m.parent == nil
            xml.total_credits(m.credits_total) if m.is_partial_module
            xml.parts(m.parts)
            xml.categories do
              m.categories.each {|c| xml.category c.id}
            end if m.has_multiple_categories
          }
        end
      }

    elsif c.sub_categories != []
      c.sub_categories.each do |d|
        if d.visible
          xml.category(:category_id => "category_#{d.id}", :name => d.name) do
            build_xml_bachelor_recursive d, xml, modus
          end
        end
      end
    end
  end

end