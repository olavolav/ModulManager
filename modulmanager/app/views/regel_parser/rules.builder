xml.instruct! :xml => "1.0", :encoding => "UTF-8"

xml.rules do
  @rules.each do |r|
    xml.rule do
      xml.type r.type
      xml.count r.count
      xml.relation r.relation
      xml.groups do
        r.groups.each { |g| xml.group g.name }
      end
    end
  end
end