export default {
  UPLOADS_PATH: () => {
    if (process.env.NODE_ENV === 'development') return 'server/uploads';
    
    return '/file-sharer/uploads';
  },
  IGNORED_FILES: ['.gitkeep'],
};
