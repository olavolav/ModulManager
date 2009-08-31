module AbfragenHelper

  def rekursiv(c, xml)
  if c.categories == [] && c.modules != []
    c.modules.each { |m|
      xml.module do
        xml.tag!("id", m.id)
        xml.name(m.name)
        xml.short(m.short)
        xml.credits(m.credits)
      end
    }
  elsif c.categories != []
    c.categories.each { |d|
      xml.categorie(:id => d.id, :name => d.name) do
        rekursiv d, xml
      end
    }
  end
end

end
