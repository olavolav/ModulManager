# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

module AbfragenHelper

  def select_image fulfillment_status
    if fulfillment_status == 1
      return "iPunkt.png"
    elsif fulfillment_status == -1
      return "Ausrufezeichen.png"
    elsif fulfillment_status == 0
      return "Fragezeichen.png"
    end
  end


  def build_html_rules_recursive r, non_permitted_modules
    name = r.name
    id = r.id
    selection = current_selection
    fulfilled = r.evaluate selection.selection_modules, non_permitted_modules
    credits_needed = r.credits_needed
    credits_earned = r.collected_credits selection.selection_modules, non_permitted_modules

    image = select_image fulfilled
    
    if fulfilled == 1
      class_tag = "category fulfilled"
    else
      class_tag = "category non-fulfilled"
    end

    element = <<EOF
  <div class='#{class_tag}'>
    <span class='ueberblick_name'>#{name}</span>
    <span class='ueberblick_credits'>#{credits_earned}&nbsp;/&nbsp;#{credits_needed}&nbsp;C</span>
    <span class='ueberblick_image'>
      <span class='ueberblick_info_box' id='box##{id}' >
        <a  alt='Weitere Informationen' onClick='javascript:info_box_overview(#{id});'>
          #{image_tag image}
        </a>
      </span>
    </span>
  </div>
EOF

    if r.child_connections != []

      list = "#{element}<ul>"

      child_connections = Connection.find(:all, :conditions => "parent_id = #{r.id}", :order => "position ASC")
      child_connections.each do |cc|
        list += <<EOF
  <li>
    #{build_html_rules_recursive(cc, non_permitted_modules)}
  </li>
EOF
      end
      list += "</ul>"
      return list

    elsif r.child_connections == []
      return "#{element}"
    end
  end
  
  # URL zur Suche in UNiVZ generieren, für Modul-Info-Boxen (OS)
  def univz_url(univzid,short)
    if univzid != nil
      if univzid == "Automatisch"
        string = "http://univz.uni-goettingen.de/qisserver/rds?state=change&type=3&" +
          "moduleParameter=pordpos_sk&nextdir=change&next=TableSelect.vm&subdir=pord&pord.pltxt1=%22" +
          short + "%22&P_start=0&P_anzahl=20"
      else
        string = "http://univz.uni-goettingen.de/qisserver/rds?state=change&type=3&" +
          "moduleParameter=pordpos_sk&nextdir=change&next=TableSelect.vm&subdir=pord&pord.pltxt1=%22" +
          univzid + "%22&P_start=0&P_anzahl=20"
      end
    else
      string = nil
    end
    return string
  end

  def build_xml_bachelor_recursive(c, xml, modus)

    puts "---"
    puts c.name
    puts c.id
    puts c.sub_categories.length
    puts "---"

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
      sub_categories = Category.find(:all, :conditions => "category_id = #{c.id}", :order => "position ASC")
      sub_categories.each do |d|
        if d.visible
          xml.category(:category_id => "category_#{d.id}", :name => d.name) do
            build_xml_bachelor_recursive d, xml, modus
          end
        end
      end
    end
  end

end