module AbfragenHelper

  def build_xml_bachelor_recursive(c, xml)
    if c.categories == [] && c.modules != []
      c.modules.each { |m|
        xml.module(:id => m.id) do
          # xml.tag!("id", m.id)
          xml.name(m.name)
          xml.short(m.short)
          xml.credits(m.credits)
        end
      }
    elsif c.categories != []
      c.categories.each { |d|
        xml.category(:category_id => "category#{d.id}", :name => d.name) do
          build_xml_bachelor_recursive d, xml
        end
      }
    end
  end

  def build_xml_rules_recursive(r, xml, errors)
    if r.categories == [] && r.rules != []
      r.rules.each { |ru|
        xml.rule do
          xml.tag!("id", ru.id)
          xml.name(ru.name)
          errors.each { |e|
            if ru.id == e.rule.id
              xml.alert(e.description)
              # xml.less(e.less)
            end
          }
        end
      }
    elsif r.categories != []
      r.categories.each { |c|
        xml.category(:id => c.id, :name => c.name) do
          build_xml_rules_recursive c, xml, errors
        end
      }
    end
  end

end
