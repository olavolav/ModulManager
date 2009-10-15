xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.root do

  xml.category(:name => "Bachelor", :class => "Allgemein", :category_id => "null") do
    build_xml_bachelor_recursive(@root, xml, false)
  end

  @schwerpunkte.each do |s|
    xml.category(:name => s.name, :class => "Schwerpunkt", :category_id => "focus#{s.id}") do
      s.groups.each do |g|
        xml.category(:name => g.name, :category_id => "#{g.name.gsub(" ", "_").downcase}#{s.id}") do
          g.modules.each do |m|

            m.parts > 1 ? partial = true : partial = false

            xml.module(:id => m.id, :class => "non-custom", :partial => partial) do
              xml.name(m.name)
              xml.short(m.short)
              xml.credits(m.credits)
              xml.mode(g.modus)
              m.parts > 1 ? xml.parts(m.parts) : xml.parts(0)
            end

            if partial
              m.parts.times do |j|
                i = j + 1
                xml.module(:id => "#{m.id}#{i}", :class => "non-custom", :partial => "true", :parent => m.id) do
                  xml.name "#{m.name} (Teil #{i})"
                  xml.short "#{m.short}_#{i}"
                  c = m.credits / m.parts
                  xml.credits c
                  xml.mode(g.modus)
                  xml.parts(0)
                end
              end

            end

#            xml.module(:id => m.id, :class => "non-custom") do
#              xml.tag! "id", m.id
#              xml.name m.name
#              xml.short m.short
#              xml.credits m.credits
#            end
          end
        end
      end

    end
  end
  
end


