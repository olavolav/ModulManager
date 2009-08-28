xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.bachelor do

  @categories.each do |kategorie|
    xml.kategorie(:class => kategorie.name) do
      xml.data
    end
  end

end