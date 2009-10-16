class MainController < ApplicationController
  
  def start
    @schwerpunkte = Focus.all
    @version = current_selection.version
  end
  
  def index
    selection = current_selection
    selection.focus == nil ? @schwerpunkt = "Kein Schwerpunkt gewählt" : @schwerpunkt = selection.focus.name
    @version = selection.version
    respond_to do |format|
      format.html { render :layout => "modulmanager" }
    end
  end

  def help
  end

  def export
  end
  
  def import
    respond_to do |format|
      format.html
    end
  end

  def import2
    @version = current_selection.version
    respond_to do |format|
      format.html
    end
  end

  def import3
    @version = current_selection.version
    respond_to do |format|
      format.html
    end
  end

  def save_version

    new_version = Version.find(params[:version])
    selection = current_selection
    selection.version = new_version
    selection.save
    version_modules = Studmodule.find(:all, :conditions => "version_id = '#{selection.version.id}'")

    @deprecated_modules = Array.new

    selection.selection_modules.each do |sm|
      found = false
      version_modules.each do |vm|
        found = true if (sm.moduledata.short == vm.short) && (sm.moduledata.credits == vm.credits)
      end
      unless found
        @deprecated_modules.push({:name => sm.moduledata.name, :short => sm.moduledata.short, :credits => sm.moduledata.credits, :grade => sm.grade})
        sm.destroy
      end
    end
    
    respond_to do |format|
      format.html
    end
  end
  
  def get_file

    headers["Content-Disposition"] = "attachment; filename=studienplan.stpl"
    
    respond_to do |format|
      format.xml
    end

  end

  def post_file
    filename = ""

    name = params[:data_file].original_filename
    directory = "public/data"
    path = File.join(directory, name)

    File.open(path, "wb") { |f| f.write(params[:data_file].read); filename = f.path }

    shredder filename

    if @version.all.length > 1
      redirect_to :action => "import2"
    else
      redirect_to :action => "index"
    end
  end

  def focus_selection
    focus = Focus.find(:first, :conditions => "id = '#{params[:id]}'")
    selection = current_selection
    selection.focus = focus
    selection.save
    render :text => "Supi!"
  end

  def version_selection
    selection = current_selection
    selection.version = Version.find(params[:version])
    selection.save
    render :text => selection.version.name
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
    selection.semesters = create_pre_selection "standard" unless found
    redirect_to :action => "index"
  end

  private

  def shredder file
    xml = File.read(file)
    doc = REXML::Document.new(xml)
    my_selection = ModuleSelection.create

    version_short = nil
    focus_name = nil

    doc.root.each_element('//version/short') do |e|
      version_short = e.text
    end

    doc.root.each_element('//focus/name') do |e|
      focus_name = e.text
    end

    if version_short == nil
      my_selection.verion = get_latest_po
    else
      my_selection.version = Version.find(:first, :conditions => "short = '#{version_short}'")
    end
    if focus_name == nil
      my_selection.focus = nil
    else
      my_selection.focus = Focus.find(:first, :conditions => "name = '#{focus_name}' AND version_id = '#{my_selection.version.id}'")
    end
    doc.root.each_element('//semester') do |s|
      my_semester = Semester.create :count => s.attributes['count']
      my_selection.semesters << my_semester
      custom_count = 0
      s.elements.each do |m|

        if m.attributes['id'] == "custom"
          custom_count += 1
          my_module = CustomModule.create
          my_module.short = "custom#{custom_count}"
          my_module.grade = m.attributes['grade']
          my_module.name = m.attributes['name']
          my_module.credits = m.attributes['credits']
          my_semester.modules << my_module
        else
          my_module = Studmodule.find(:first, :conditions => "short = '#{m.attributes['short']}'")
          my_semester.studmodules << my_module
          s = SelectedModule.find(:first, :conditions => "module_id = '#{my_module.id}'")
          s.grade = m.attributes['grade']
          s.save
        end
        
      end
    end
    my_selection.save
    session[:selection_id] = my_selection.id
  end

end
