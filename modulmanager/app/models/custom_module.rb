# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class CustomModule < SelectedModule
  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"
 
  def to_string_for_printing show_grade = true
    text = self[:name].to_s + " (vom Benutzer erstellt), " +
      self.credits.to_s + " Credits"
    unless show_grade == false
      text += ", " + self.written_grade.to_s
    end
    return text
  end

end
