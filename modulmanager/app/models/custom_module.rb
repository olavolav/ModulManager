class CustomModule < SelectedModule
  belongs_to :category,
    :class_name => "Category",
    :foreign_key => "category_id"

  def to_string_for_printing
    text = self[:name] + " (vom Benutzer erstellt), " +
      self.credits + " Credits, " +
      self.written_grade
    return text
  end

end
