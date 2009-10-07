class MainController < ApplicationController

  def index
    selection = current_selection
    selection.focus == nil ? @schwerpunkt = "Kein Schwerpunkt gewählt" : @schwerpunkt = selection.focus.name
    @selected_version = selection.version
    respond_to do |format|
      format.html { render :layout => "modulmanager" }
    end
  end

  def start
    @schwerpunkte = Focus.all
    @version = current_selection.version
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

  def focus_selection
    focus = Focus.find(:first, :conditions => "id = '#{params[:id]}'")
    selection = current_selection
    selection.focus = focus
    selection.save
    @schwerpunkte = Focus.all
    respond_to do |format|
      format.html { render :action => "focus_selection", :layout => false }
    end
  end

  def version_selection
    selection = current_selection
    selection.version = params[:selected_version]
    selection.save
    render :text => selection.version
#    respond_to do |format|
#      format.html { render :text => selection.version }
#    end
  end

  def create_selection
    selection = current_selection
    found = false
    Focus.all.each do |f|
      if selection.focus == f
        found = true
        selection.semesters = create_pre_selection f.name
        selection.save
      end
    end
    create_pre_selection "standard" unless found
    redirect_to :action => "index"
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

  def create_pre_selection focus_name

    pre_selection_file = File.open("public/rules/pre_selections.yml")

    y = YAML::load(pre_selection_file)

    semesters = Array.new
    return_array = Array.new

    y.each do |p|

      if p["name"] == focus_name

        semesters.push p["semester1"]
        semesters.push p["semester2"]
        semesters.push p["semester3"]
        semesters.push p["semester4"]
        semesters.push p["semester5"]
        semesters.push p["semester6"]

        i = 0
        semesters.each do |content|
          
          i += 1

          shorts = content.split(", ")

          s = Semester.new :count => i
          shorts.each do |short|
            puts short
            m = Studmodule.find(:first, :conditions => "short = '#{short}'")
            s.studmodules << m
          end
          s.save
          return_array.push s
        end

      end

    end
    return return_array
  end

end
