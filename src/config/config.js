// config.js

const config = {
  Base_URL: "/",

  BASE_ROUTE: Object.freeze({
    ADMIN: "admin",
    SELLER: "seller",
    MAGASIN: "magasin",
    SUPER_ADMIN: "superadmin",
  }),
  
  ROLE_NAME: Object.freeze({
    ADMIN: "Admin",
    SELLER: "Seller",
    MAGASIN: "magasin",
    SUPER_ADMIN: "Super Admin",
  }),

  ROLE_NAME_TEXT: Object.freeze({
    ADMINS: "Adminisrateurs",
    SELLERS: "Vendeurs",
    SUPER_SLLERS: "Super Vendeurs",
    MAGASINIERS: "Magasiniers",
    SUPER_ADMINS: "Super Admins",
  }),

  StatusCodes: Object.freeze({
    SUCCESS: 200,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
  }),

  MAX_UPLOAD_SIZE: 5 * 1024 * 1024, // 5 MB
  SUPPORTED_IMAGE_FORMATS: ["image/jpeg", "image/png", "image/gif"],
};

config.getRouteName = (route) => {
  switch (route) {
    case config.BASE_ROUTE.ADMIN:
      return config.ROLE_NAME.ADMIN;
    case config.BASE_ROUTE.SELLER:
      return config.ROLE_NAME.SELLER;
    case config.BASE_ROUTE.SUPER_ADMIN:
      return config.ROLE_NAME.SUPER_ADMIN;
    default:
      return "Unknown Role";
  }
};

export default config;
