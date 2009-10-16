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
              xml.mode(g.modus)
              m.parts > 1 ? xml.parts(m.parts) : xml.parts(0)

            end
          }
        end
      end

    end
  end
  
end


