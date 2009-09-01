class Rule < ActiveRecord::Base
  has_and_belongs_to_many :groups,
    :class_name => "Group",
    :join_table => "groups_rules"
end
