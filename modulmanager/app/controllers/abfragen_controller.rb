class AbfragenController < ApplicationController

  def ueberblick
    selection = current_selection

    @super_rules = nil
    @focus_rules = nil
    @errors = Array.new

    @super_rules = Connection.find(:all,
      :conditions => "parent_id IS NULL AND focus = 0 AND version_id = '#{selection.version.id}'")

    unless selection.focus == nil
      @focus_rules = Connection.find(:first,
        :conditions => "name = '#{selection.focus.name}' AND version_id = '#{selection.version.id}'")
    end

    @errors = get_errors selection

    respond_to do |format|
      format.html { render :action => "ueberblick", :layout => false }
    end
  end

  private

  def get_errors selection
    errors = Array.new

    selection.semesters.each do |semester|
      count = semester.count
      semester.modules.each do |mod|
        permission = 1
        permission = mod.moduledata.permission.evaluate(selection.semesters, count) unless mod.moduledata.permission == nil

        errors.push mod.moduledata unless permission == 1
      end
    end
    return errors
  end

  public

  def auswahl
    @selection = current_selection
    respond_to do |format|
      format.xml { render :action => "auswahl", :layout => false }
    end
  end

  def pool
    @root = Category.find(:first, :conditions => "category_id IS null")
    @schwerpunkte = Focus.all
    respond_to do |format|
      format.xml { render :action => "pool", :layout => false }
    end
  end

  def errors

    selection = current_selection
    @errors = get_errors selection

    respond_to do |format|
      format.xml { render :action => "errors", :layout => false }
    end
  end

  def get_module_info

    @module = Studmodule.find(params[:module_id])

    respond_to do |format|
      format.html {render :file => "abfragen/module_info", :layout => false}
    end

  end

  def add_module_to_selection
    selection = current_selection
    unless semester = selection.semesters.find(:first, :conditions => "count = #{params[:sem_count]}")
      semester = Semester.create(:count => params[:sem_count])
      selection.semesters << semester
    end
    id = params[:mod_id]
    found = false
    parent_id = ""
    part_id = ""
    id.each_char do |c|
      if c == "_"
        found = true
      end
      parent_id = "#{parent_id}#{c}" unless found
      part_id = "#{part_id}#{c}" if found && c != "_"
    end
    parent_module = Studmodule.find(parent_id)
    unless found
      semester.modules << SelectedModule.create(:moduledata => parent_module)
    else
      semester.modules << PartialModule.create(:parent_id => parent_id, :short => "#{parent_module.short}_#{part_id}")
    end
    render :text => "Module added successfully..."
  end

  def add_custom_module_to_selection

    selection = current_selection

    unless semester = selection.semesters.find(:first, :conditions => "count = #{params[:sem_count]}")
      semester = Semester.create(:count => params[:sem_count])
      selection.semesters << semester
    end

    studmodule = Studmodule.find(params[:mod_id])

    unless my_module = CustomModule.find(:first, :conditions => "short = '#{studmodule.short}'")
      semester.modules << CustomModule.create(
        :moduledata => studmodule,
        :short => studmodule.short,
        :credits => params[:credits],
        :name => params[:name],
        :category => Category.find(params[:category_id])
      )
    else
      my_module.credits = params[:credits]
      my_module.name = params[:name]
      my_module.save
    end

    render :text => "CostumModule created and added successfully..."

  end

  def remove_module_from_selection
    current_selection.selection_modules.each { |m| m.destroy if m.module_id.to_i == params[:mod_id].to_i }
    render :text => "Module removed from selection..."
  end

  def remove_semester_from_selection
    s1 = Semester.find(
      :first,
      :conditions => "selection_id = #{current_selection.id} AND count = #{params[:sem_count]}").destroy
    modules = s1.modules
    modules.each { |m| m.destroy }
    render :text => "Semester removed from selection..."
  end

  def save_module_grade

    selection = current_selection
    module_id = params[:mod_id]
    grade = params[:grade]

    selection.semesters.each do |s|
      s.modules.each do |m|
        if m.module_id.to_i == module_id.to_i
          m.grade = grade
          m.save
        end
      end
    end

    render :text => "Module grade saved successfully..."

  end

  def note

    @grade = get_note

    respond_to do |format|
      format.html { render :action => "note", :layout => false }
    end

  end

  def info

    id = params[:id]

    regel = Connection.find(:first, :conditions => "id = '#{id}'")

    modules = current_selection.modules

    fullfilled = regel.evaluate modules

    @status = "<strong>Es sind keine Informationen über den aktuellen Stand verfügbar...</strong>"
    @status = "<strong>Es sind alle Bedingungen erfüllt.</strong>" if fullfilled == 1
    @status = "<strong>Es sind noch nicht alle Bedingungen erfüllt.</strong>" if fullfilled == -1 || fullfilled == 0

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

end
