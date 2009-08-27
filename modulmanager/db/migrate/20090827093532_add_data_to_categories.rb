class AddDataToCategories < ActiveRecord::Migration
  def self.up
    Category.create :name => "Bachelor-Arbeit"

    Category.create :name => "Kerncurriculum"
    Category.create :name => "Pflichtmodule",
      :category => Category.find(:first, :conditions => "name = 'Kerncurriculum'")
    Category.create :name => "Grundkurse",
      :category => Category.find(:first, :conditions => "name = 'Pflichtmodule'")
    Category.create :name => "Praktika",
      :category => Category.find(:first, :conditions => "name = 'Pflichtmodule'")
    Category.create :name => "Mathematik",
      :category => Category.find(:first, :conditions => "name = 'Pflichtmodule'")

    Category.create :name => "Spezialisierung"
    Category.create :name => "Wahlpflichtmodule",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierung'")
    Category.create :name => "Spezialisierungsbereich",
      :category => Category.find(:first, :conditions => "name = 'Wahlpflichtmodule'")
    Category.create :name => "Spezialisierungspraktikum",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungsbereich'")
    Category.create :name => "Einf&uuml;hrungen",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungsbereich'")
    Category.create :name => "Spezielle Themen",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungsbereich'")
    Category.create :name => "Profilierungsbereich",
      :category => Category.find(:first, :conditions => "name = 'Wahlpflichtmodule'")

    Category.create :name => "Schl&uuml;sselkompetenzen"
  end

  def self.down
    c = Category.all
    c.destroy_all
  end
end
