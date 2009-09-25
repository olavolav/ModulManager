class MainController < ApplicationController

  def index
    respond_to do |format|
      format.html { render :layout => "modulmanager" }
    end
  end

  def start
  end

  def help
  end

  def export
  end

  # Schickt die aktuelle Auswahl als Datei an den Browser, von wo aus sie dann
  # heruntergeladen werden kann.
  def get_file

    headers["Content-Disposition"] = "attachment; filename=studienplan.stpl"
    
    respond_to do |format|
      format.xml
    end

  end

  # Liest die hochgeladene Datei ein und lädt die darin enthaltenen Daten wieder
  # in die aktuelle Session
  def post_file
    filename = ""

    name = params[:data_file].original_filename
    directory = "public/data"
    path = File.join(directory, name)

    File.open(path, "wb") { |f| f.write(params[:data_file].read); filename = f.path }

    shredder filename

    redirect_to :action => "index"
  end

  def import
  end

  private

  # Liest eine XML-Datei ein und erstellt aus ihren Elementen applikations-
  # zugehörige Objekte.
  def shredder file
    # Liest die übergebene Datei ein
    xml = File.read(file)
    # Erstellt ein neues, parserfähiges XML-Dokument
    doc = REXML::Document.new(xml)
    # Eine neue Auswahl wird instanziiert
    my_selection = ModuleSelection.create
    # Durchläuft alle Semester in der XML-Datei
    doc.root.each_element('//semester') do |s|
      # Instanziiert und speichert ein neues Semester
      my_semester = Semester.create :count => s.attributes['count']
      # Durchläuft alle Elemente d.h. Module im Semester
      s.elements.each do |m|
        # Sucht das aktuell aufgerufene Modul anhand des Kürzels
        my_module = Studmodule.find(:first, :conditions => "short = '#{m.attributes['short']}'")
        # Fügt die Modulinstanz dem neu erstellten Semester hinzu
        my_semester.studmodules << my_module
      end
      # Fügt das Semester der Auswahl hinzu
      my_selection.semesters << my_semester
    end
    # Verknüpft die Session mit der neu erstellten Auswahl
    session[:selection_id] = my_selection.id
  end

end
