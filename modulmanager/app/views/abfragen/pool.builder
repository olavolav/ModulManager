xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.root do

  xml.category(:name => "Bachelor", :class => "Allgemein", :category_id => "null") do
    build_xml_bachelor_recursive(@root, xml, false)
  end

  @schwerpunkte.each do |s|
    xml.category(:name => s.name, :class => "Schwerpunkt", :category_id => "focus#{s.id}") do
      s.categories.each do |g|
#        xml.category(:name => g.name, :category_id => "#{g.name.gsub(" ", "_").downcase}#{s.id}") do
        xml.category(:name => g.name, :category_id => "category_#{g.id}") do
          g.modules.each { |m|
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
            ) do

              xml.name(m.name)
              xml.add_sel_name(m.displayable_subname)
              xml.short(m.short)
              xml.credits(m.credits)
              xml.mode(g.modus)
              xml.parent(m.parent_id) unless m.parent == nil
              xml.total_credits(m.total_credits) if m.is_partial_module
              xml.parts(m.parts)
              xml.categories do
                m.categories.each { |c| xml.category c.id }
              end if m.has_multiple_categories
            end
          }
        end
      end
    end
  end
end


