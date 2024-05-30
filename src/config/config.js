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
    ADMIN: "admin",
    SELLER: "seller",
    SUPER_SELLER: "superseller",
    MAGASIN: "magasin",
    SUPER_ADMIN: "superadmin",
  }),

  ROLE_NAME_TEXT: Object.freeze({
    ADMINS: "Adminisrateurs",
    SELLERS: "Vendeurs",
    SUPER_SELLERS: "Super Vendeurs",
    MAGASINIERS: "Magasiniers",
    SUPER_ADMINS: "Super Admins",
    ADMIN: "Adminisrateur",
    SELLER: "Vendeur",
    SUPER_SELLER: "Super Vendeur",
    MAGASINIER: "Magasinier",
    SUPER_ADMIN: "Super Admin",
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
      return config.ROLE_NAME_TEXT.ADMIN;
    case config.BASE_ROUTE.SELLER:
      return config.ROLE_NAME_TEXT.SELLER;
    case config.BASE_ROUTE.SUPER_ADMIN:
      return config.ROLE_NAME_TEXT.SUPER_ADMIN;
    default:
      return "Unknown Role";
  }
};

export default config;
