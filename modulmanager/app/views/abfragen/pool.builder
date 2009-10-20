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

            xml.module(
              :id => m.id,
              :class => classification,
              :partial => partial,
              :has_grade => has_grade,
              :parent => parent,
              :total_credits => total_credits
            ) do

              xml.name(m.name)
              xml.subname(m.subname) unless m.subname == nil
              xml.short(m.short)
              xml.credits(m.credits)
              xml.mode(g.modus)
              xml.parent(parent) unless m.parent == nil
              xml.total_credits(total_credits) if partial
            end
          }
        end
      end

    end
  end
  
end


