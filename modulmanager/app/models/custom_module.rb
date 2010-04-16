class CustomModule < SelectedModule
  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  def to_string_for_printing
    text = self[:name].to_s + " (vom Benutzer erstellt), " +
      self.credits.to_s + " Credits, " +
      self.written_grade.to_s
    return text
  end

end
