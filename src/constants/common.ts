export const UPLOAD_FILE: {[key: string]: any} = {
  UPLOAD_TYPE: [
    'LOGO',
    'BANNER',
    'FOODIMAGE',
    'EXTRA',
    'ICON'
  ],
  LOGO: {
    expireTime: 3600,
    path: 'logo/'
  },
  BANNER: {
    expireTime: 3600,
    path: 'banner/'
  },
  FOODIMAGE: {
    expireTime: 3600,
    path: 'foodimage/'
  },
  ICON: {
    expireTime: 3600,
    path: 'icon/'
  },
  EXTRA: {
    expireTime: 3600,
    path: 'extra/'
  }
}