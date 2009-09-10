class AddDataToCategories < ActiveRecord::Migration
  def self.up

    Category.create :name => "Bachelor"

    Category.create :name => "Bachelor-Arbeit",
      :category => Category.find(:first, :conditions => "name = 'Bachelor'")

    Category.create :name => "Kerncurriculum",
      :category => Category.find(:first, :conditions => "name = 'Bachelor'")
    Category.create :name => "Pflichtmodule",
      :category => Category.find(:first, :conditions => "name = 'Kerncurriculum'")
    Category.create :name => "Grundkurse",
      :category => Category.find(:first, :conditions => "name = 'Pflichtmodule'")
    Category.create :name => "Praktika",
      :category => Category.find(:first, :conditions => "name = 'Pflichtmodule'")
    Category.create :name => "Mathematik",
      :category => Category.find(:first, :conditions => "name = 'Pflichtmodule'")

    Category.create :name => "Spezialisierung",
      :category => Category.find(:first, :conditions => "name = 'Bachelor'")
    Category.create :name => "Wahlpflichtmodule",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierung'")
    Category.create :name => "Spezialisierungsbereich",
      :category => Category.find(:first, :conditions => "name = 'Wahlpflichtmodule'")
    Category.create :name => "Spezialisierungspraktikum",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungsbereich'")
    Category.create :name => "Einführungen",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungsbereich'")
    Category.create :name => "Spezielle Themen",
      :category => Category.find(:first, :conditions => "name = 'Spezialisierungsbereich'")
    Category.create :name => "Profilierungsbereich",
      :category => Category.find(:first, :conditions => "name = 'Wahlpflichtmodule'")

    Category.create :name => "Schlüsselkompetenzen",
      :category => Category.find(:first, :conditions => "name = 'Bachelor'")
  end

  def self.down
    c = Category.all
    c.each do |d|
      d.destroy
    end
  end
end
