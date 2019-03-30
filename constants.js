export const USER_EX = {
  id: 1234567, // number
  id_str: '1234567', // string
  first_name: 'Rahul', // string
  last_name: 'Rangnekar', // string
  age: 22, // number
  dob: new Date('08-01-1996'),
  needs_parental_consent: false, // boolean
  // shape
  address: {
    billing: {
      // shape
      line1: '480 Potrero Ave', // string
      line2: 'Unit 101', // string
      city: 'San Francisco', // string
      state: 'CA', // string
      zip: 94110 // number
    },
    shipping: null, // any
    ssn: 123456789 // number
  },
  permissions: ['user:read', 'user:write'],
  // arrayOf(shape(...))
  tags: [
    // permissions: oneOfType([string, arrayOf(string)])
    {
      name: 'admin', // string
      level: 4, // number
      permissions: 'all' // string
    },
    {
      name: 'superuser', // string
      level: 10, // number
      permissions: ['read', 'modify', 'delete', 'create'] // arrayOf(string)
    }
  ],
  is_admin: () => true, // func
  // objectOf([string, number])
  property_ids: {
    'YouTube Channel 1': 'UC--XYZ123',
    'Facebook Page 1': 987654321,
    'Instagram Profile 1': '12940932423'
  }
};

export default USER_EX;
