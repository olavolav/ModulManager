xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.root do

  xml.category(:name => "Bachelor", :class => "Allgemein", :category_id => "null") do
    build_xml_bachelor_recursive(@root, xml, false)
  end

  @schwerpunkte.each do |s|
    xml.category(:name => s.name, :class => "Schwerpunkt", :category_id => "focus#{s.id}") do
      s.groups.each do |g|
        xml.category(:name => g.name, :category_id => "#{g.name.gsub(" ", "_").downcase}#{s.id}") do


          g.modules.each { |m|
            classification = "non-custom"
            18.times { |i| classification = "custom" if m.short == "custom#{(i+1)}" }
            m.children.length > 0 ? partial = true : partial = false
            has_grade = true

            m.parent == nil ? parent = "" : parent = m.parent.id
            m.credits_total == m.credits ? total_credits = "" : total_credits = m.credits_total
            m.children.length > 0 ? parts = m.children.length + 1 : parts = 0
            m.subname == nil ? subname = "" : subname = m.subname
            m.categories.length > 1 ? mult_cat = true : mult_cat = false

            xml.module(
              :id => m.id,
              :class => classification,
              :partial => partial,
              :has_grade => has_grade,
              :parent => parent,
              :total_credits => total_credits,
              :parts => parts,
              :multiple_categories => mult_cat,
              :additional_server_info => has_additional_server_infos(m)
            ) do

              xml.name(m.name)
              xml.add_sel_name(subname)
              xml.short(m.short)
              xml.credits(m.credits)
              xml.mode(g.modus)
              xml.parent(parent) unless m.parent == nil
              xml.total_credits(total_credits) if partial
              xml.parts(parts)
              xml.categories do
                m.categories.each { |c| xml.category c.id }
              end if mult_cat
            end
          }
        end
      end

    end
  end
  
end


