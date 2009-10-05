xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.root do

  xml.category(:name => "Bachelor", :class => "Allgemein", :category_id => "null") do
    build_xml_bachelor_recursive(@root, xml, false)
  end

  @schwerpunkte.each do |s|
    xml.category(:name => s.name, :class => "Schwerpunkt", :category_id => "focus#{s.id}") do
      if s.pflicht.length > 0
        xml.category(:name => "Pflicht", :category_id => "pflicht#{s.id}") do
          s.pflicht.each do |p|
            xml.module(:id => p.id) do
              xml.tag! "id", p.id
              xml.name p.name
              xml.short p.short
              xml.credits p.credits
            end
          end
        end
      end
      if s.themen.length > 0
        xml.category(:name => "Spezielle Themen", :category_id => "themen#{s.id}") do
          s.themen.each do |p|
            xml.module(:id => p.id) do
              xml.tag! "id", p.id
              xml.name p.name
              xml.short p.short
              xml.credits p.credits
            end
          end
        end
      end
      if s.profil.length > 0
        xml.category(:name => "Profilierungsbereich", :category_id => "profil#{s.id}") do
          s.profil.each do |p|
            xml.module(:id => p.id) do
              xml.tag! "id", p.id
              xml.name p.name
              xml.short p.short
              xml.credits p.credits
            end
          end
        end
      end
    end
  end
  
end


