class AbfragenController < ApplicationController

  # Überblick über alle Rgeln und deren Erfüllung. Darstellung orientiert sich
  # an der Darstellung des Pools.
  def ueberblick
    @super_rules = Connection.find(:all, :conditions => "parent_id IS NULL")
    @modules = current_selection.modules
    respond_to do |format|
      # format.xml { render :action => "ueberblick", :layout => false }
      format.html { render :action => "ueberblick", :layout => false }
    end
  end

  # Die Auswahl stellt den Hauptbereich der Arbeitsfläche dar und nimmt die
  # Module auf. Hierhin können neue Module gezogen werden sowie alte ent-
  # fernt.
  def auswahl
    @selection = current_selection
    respond_to do |format|
      format.xml { render :action => "auswahl", :layout => false }
    end
  end

  # Die Action Pool liefert eine XML-Response mit einer Baumartig untergliederten
  # Liste der Module sowie die Schwerpunkte mit den von ihnen abhängigen Modulen.
  def pool
    @root = Category.find(:first, :conditions => "category_id IS null")
    @schwerpunkte = Focus.all
    respond_to do |format|
      format.xml { render :action => "pool", :layout => false }
    end
  end

  # Die Methode muss mit den HTTP-Parametern "sem_count", für das Semester, in
  # das hinzugefügt werden soll, und "mod_id" für die ID des hinzugefügten
  # Modules aufgerufen werden. Die Methode speichert dann das übergebene Modul
  # im entsprechenden Semester der Auswahl.
  def add_module_to_selection
    # Aktuelle zur Session passende Auswahl laden
    selection = current_selection
    # Entweder das passende Semester in der Auswahl finden...
    unless semester = selection.semesters.find(:first, :conditions => "count = #{params[:sem_count]}")
      # ...oder ein neues mit der entsprechenden Zahl erstellen
      semester = Semester.create(:count => params[:sem_count])
      # und in der Auswahl speichern
      selection.semesters << semester
    end
    # Zum passenden Semester das ausgewählte Modul hinzufügen
    semester.modules << SelectedModule.create(:moduledata => Studmodule.find(params[:mod_id]))
    # Umleitung zur Liste der aktuell ausgewählten Module
    # render :action => "ueberblick", :layout => false
    render :text => "Module added successfully..."
  end

  def add_custom_module_to_selection

    selection = current_selection

    unless semester = selection.semesters.find(:first, :conditions => "count = #{params[:sem_count]}")
      semester = Semester.create(:count => params[:sem_count])
      selection.semesters << semester
    end

    semester.modules << CustomModule.create(
      :moduledata => nil,
      :credits => params[:credits],
      :name => params[:name]
    )

    render :text => "CostumModule created successfully..."

  end

  def save_module_grade

    selection = current_selection
    module_id = params[:mod_id]
    grade = params[:grade]

    selection.semesters.each do |s|
      s.modules.each do |m|
        if m.module_id == module_id
            m.grade = grade
            m.save
        end
      end
    end

    render :text => "Module grade saved successfully..."

  end

  def get_examination_grade

    selection = current_selection

    grade = 0
    credits = 0

    selection.semesters.each do |s|
      s.modules.each do |m|
        if m.grade != nil
          grade += (m.credits * m.grade)
          credits += m.credits
        end
      end
    end

    grade = grade / credits

    render :text => grade

  end

  # Die Methode muss mit dem HTTP-Parameter "mod_id" aufgerufen werden. Die
  # Methode veranlasst dann eine Löschung des entsprechenden Moduls aus der
  # Auswahl.
  def remove_module_from_selection
    current_selection.selection_modules.each { |m| m.destroy if m.module_id.to_i == params[:mod_id].to_i }
    # render :action => "ueberblick", :layout => false
    render :text => "Hallo Welt :-)"
  end

  # Entfernt ein Semester aus der aktuellen Auswahl. Dieses 
  def remove_semester_from_selection
    s1 = Semester.find(
      :first,
      :conditions => "selection_id = #{current_selection.id} AND count = #{params[:sem_count]}").destroy
    modules = s1.modules
    modules.each { |m| m.destroy }
    # redirect_to :action => "ueberblick"
    render :text => "Hallo Welt :-)"
  end

  def info

    id = params[:id]

    regel = Connection.find(:first, :conditions => "id = '#{id}'")

    modules = current_selection.modules

    fullfilled = regel.evaluate modules

    @status = "Es sind keine Informationen über den aktuellen Stand verfügbar..."
    @status = "Es sind alle Bedingungen erfüllt." if fullfilled == 1
    @status = "Es sind noch nicht alle Bedingungen erfüllt." if fullfilled == -1 || fullfilled == 0

    credits_earned = regel.credits_earned modules
    credits_needed = regel.credits_needed

    modules_earned = regel.modules_earned modules
    modules_needed = regel.modules_needed

    @credit_status = "Es wurden bereits #{credits_earned} Credits von #{credits_needed} Credits erbracht."
    @module_status = "Es wurden bereits #{modules_earned} Module von #{modules_needed} Modulen bestanden."

    respond_to do |format|
      format.html { render :action => "info", :layout => false }
    end

  end

  private

  # Diese Hilfsmethode liefert die ID der aktuellen Auswahl aus dem Session-
  # Cookie.
  def current_selection
    session[:selection_id] ||= new_selection params[:focus]
    ModuleSelection.find session[:selection_id]
  end

  # Erstellt eine neue Standardauswahl
  def new_selection(focus = nil)
    ms = ModuleSelection.create
    s1 = Semester.create :count => 1
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.101'")
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.605'")
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Mat.011'")
    s1.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Mat.012'")
    ms.semesters << s1
    s2 = Semester.create :count => 2
    s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.102'")
    s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.410'")
    s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.303'")
    # s2.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.605'")
    ms.semesters << s2
    s3 = Semester.create :count => 3
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.103'")
    # s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.410'")
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.304'")
    s3.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.201'")
    ms.semesters << s3
    s4 = Semester.create :count => 4
    s4.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.104'")
    s4.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.604'")
    s4.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.202'")
    ms.semesters << s4
    s5 = Semester.create :count => 5
    s5.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.402'")
    s5.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.203'")
    ms.semesters << s5
    s6 = Semester.create :count => 6
    s6.studmodules << Studmodule.find(:first, :conditions => "short = 'B.Phy.602'")
    ms.semesters << s6
    return ms.id
  end

  # Errechnet die Summe der Credits in den ausgewählten Modulen und den über-
  # gebenen Gruppen.
  def sum_credits categories
    # Container für die relevanten Module
    modules = select_relevant_modules categories
    sum = 0
    # Alle relevanten Module werden durchlaufen
    modules.each do |m|
      # Die Credits des aktuellen Moduls werden zur Gesamtzahl der Credits
      # hinzugezählt
      sum += m.credits
    end
    # Liefert die Summe zurück
    return sum
  end

  # Errechnet die Anzahl der Module in der aktuellen Auswahl und den übergebenen
  # Gruppen.
  def sum_modules categories
    modules = select_relevant_modules categories
    return modules.length
  end

  # Liefert die für die übergebene Gruppenmenge relevanten Module der aktuellen
  # Auswahl als Array zurück.
  def select_relevant_modules categories
    modules = Array.new
    # Alle Module der aktuellen Auswahl werden durchlaufen
    current_selection.modules.each do |m|
      # Alle Gruppen des aktuellen Moduls werden durchlaufen
      m.categories.each do |g1|
        # Alle übergebenen Gruppen werden durchlaufen
        categories.each do |g2|
          # Sollte eine der übergebenen Gruppen mit einer Gruppe des
          # aktuellen Moduls übereinstimmen, so wird dieses in den Container
          # gelegt.
          modules.push m if g1.id == g2.id
        end
      end
    end
    return modules
  end

end
