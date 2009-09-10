class CreateFocus < ActiveRecord::Migration
  def self.up
    create_table :focus do |t|
      t.string :name

      t.timestamps
    end

    Focus.create :name => "Nanostrukturphysik"
    Focus.create :name => "Physikinformatik"
    Focus.create :name => "Astro- und Geophysik"
    Focus.create :name => "Biophysik und Physik komplexer Systeme"
    Focus.create :name => "Festkörper- und Materialphysik"
    Focus.create :name => "Kern- und Teilchenphysik"

  end

  def self.down
    drop_table :focus
  end
end
