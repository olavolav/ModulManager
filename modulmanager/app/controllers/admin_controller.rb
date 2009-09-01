class AdminController < ApplicationController
  def groups
    @groups = Group.all
  end

  def edit_group
    if params[:id]
      @group = Group.find(params[:id])
    else
      @group = Group.create
    end
  end

  def save_group
    @group = Group.find(params[:id])
    @group.update_attributes params[:group]
    if @group.save
      flash[:notice] = "<p style='color:green;'>Speichern erfolgreich.</p>"
    else
      flash[:notice] = "<p style='color:red;'>Speichern fehlgeschlagen.</p>"
    end
    redirect_to :action => "groups"
  end

  def delete_group
    if Group.find(params[:id]).delete
      flash[:notice] = "<p style='color:green;'>Löschen erfolgreich.</p>"
    else
      flash[:notice] = "<p style='color:red;'>Löschen fehlgeschlagen.</p>"
    end
    redirect_to :action => "groups"
  end

  def rules
    @rules = Rule.all
  end

  def edit_rule
    if params[:id]
      @rule = Rule.find(params[:id])
    else
      @rule = Rule.create
    end
  end

  def save_rule
    @rule = Rule.find(params[:id])
    if @rule.update_attributes params[:rule]
      flash[:notice] = "<p style='color:green;'>Speichern erfolgreich.</p>"
    else
      flash[:notice] = "<p style='color:red;'>Speichern fehlgeschlagen.</p>"
    end
    redirect_to :action => "rules"
  end

  def delete_rule
    if Rule.find(params[:id]).delete
      flash[:notice] = "<p style='color:green;'>Löschen erfolgreich.</p>"
    else
      flash[:notice] = "<p style='color:red;'>Löschen fehlgeschlagen.</p>"
    end
    redirect_to :action => "rules"
  end

end
