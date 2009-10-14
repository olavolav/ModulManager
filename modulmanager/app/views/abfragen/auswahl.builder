custom_count = 0

xml.instruct! :xml, :version => "1.0", :encoding => "UTF-8"

xml.auswahl(:id => @selection.id) do
  xml.focus(:id => @selection.focus.id, :name => @selection.focus.name) if @selection.focus
  xml.semesters do
    @selection.semesters.sort_by { |sem| sem.count }.each do |s|
      xml.semester(:count => s.count, :id => "sem#{s.id}") do
        s.modules.each do |m|
          if m.class == CustomModule
            custom_count += 1
            xml.module(
              :id => m.moduledata.id,
              :short => "custom#{custom_count}",
              :name => m.name,
              :credits => m.credits,
              :grade => m.grade,
              :class => "custom"
            )
          else
            if m.class == PartialModule
              part = ""
              found = false
              m.short.each_char { |c|
                part = "#{part}#{c}" if found
                found = true if c == "_"
              }
              xml.module(
                :id => "#{m.parent_id}##{part}",
                :class => "partial",
                :parent => m.parent_id,
                :short => m.short
              )
            else
              xml.module(:id => m.moduledata.id, :grade => m.grade)
            end
          end
        end
      end
    end
  end
end
