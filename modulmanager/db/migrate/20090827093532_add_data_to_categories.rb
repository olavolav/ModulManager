class AddDataToCategories < ActiveRecord::Migration
  def self.up

    Category.create :name => "Bachelor"

    Category.create :name => "Bachelor-Arbeit",
      :super_category => Category.find(:first, :conditions => "name = 'Bachelor'")

    Category.create :name => "Kerncurriculum",
      :super_category => Category.find(:first, :conditions => "name = 'Bachelor'")
    Category.create :name => "Pflichtmodule",
      :super_category => Category.find(:first, :conditions => "name = 'Kerncurriculum'")
    Category.create :name => "Grundkurse",
      :super_category => Category.find(:first, :conditions => "name = 'Pflichtmodule'")
    Category.create :name => "Praktika",
      :super_category => Category.find(:first, :conditions => "name = 'Pflichtmodule'")
    Category.create :name => "Mathematik",
      :super_category => Category.find(:first, :conditions => "name = 'Pflichtmodule'")

    Category.create :name => "Spezialisierung",
      :super_category => Category.find(:first, :conditions => "name = 'Bachelor'")
    Category.create :name => "Wahlpflichtmodule",
      :super_category => Category.find(:first, :conditions => "name = 'Spezialisierung'")
    Category.create :name => "Spezialisierungsbereich",
      :super_category => Category.find(:first, :conditions => "name = 'Wahlpflichtmodule'")
    Category.create :name => "Spezialisierungspraktikum",
      :super_category => Category.find(:first, :conditions => "name = 'Spezialisierungsbereich'")
    Category.create :name => "Einführungen",
      :super_category => Category.find(:first, :conditions => "name = 'Spezialisierungsbereich'")
    Category.create :name => "Spezielle Themen",
      :super_category => Category.find(:first, :conditions => "name = 'Spezialisierungsbereich'")
    Category.create :name => "Profilierungsbereich",
      :super_category => Category.find(:first, :conditions => "name = 'Wahlpflichtmodule'")

    Category.create :name => "Schlüsselkompetenzen",
      :super_category => Category.find(:first, :conditions => "name = 'Bachelor'")
  end

  def self.down
    c = Category.all
    c.each do |d|
      d.destroy
    end
  end
end
