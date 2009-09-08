class Error < ActiveRecord::Base
  belongs_to :rule,
    :class_name => "Rule",
    :foreign_key => "rule_id"
end
