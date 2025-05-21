const ROLE =  {
  admin: [
    'view:task',
    'create:task',
    'update:task',
    'delete:task',
    'assign:task'
  ],
  user: ['view:task', 'update:task', 'edit:ownTask']
}

export function  hasPermission(
  user,
  permission
){
    return ROLE[user.role].includes(permission);
  }