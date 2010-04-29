# Copyright 2009,2010 adiungi GmbH, http://www.adiungi.de
# for licensing questions please refer to the README
# Created by Christian Beulke, Van Quan Nguyen and Olav Stetter

class Error < ActiveRecord::Base
  belongs_to :rule,
    :class_name => "Rule",
    :foreign_key => "rule_id"
end
